/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-color-literals */
import * as React from "react"
import { StyleSheet, View, Text, PixelRatio, Platform } from "react-native"
import { useRecoilState } from "recoil"
import { IconButton } from "../components/IconButton"
import {
  editingModeState,
  glContextState,
  glProgramState,
  imageBoundsState,
  imageDataState,
  processingState,
} from "../Store"
import { Slider } from "@miblanchard/react-native-slider"
import { Asset } from "expo-asset"
import { GLView } from "expo-gl"
import * as ImageManinpulator from "expo-image-manipulator"
import * as FileSystem from "expo-file-system"
import _, { debounce, throttle } from "lodash"
import { EditorContext } from "../index"

const vertShader = `
precision highp float;
attribute vec2 position;
varying vec2 uv;
void main () {
  uv = position;
  gl_Position = vec4(1.0 - 2.0 * uv, 0, 1);
}`

const fragShader = `precision highp float;
precision highp int;
uniform sampler2D texture;
uniform highp float width;
uniform highp float height;
varying vec2 uv;
uniform highp int filterType; // New uniform to control the type of filter applied

vec4 grayscale(vec4 color) {
    float avg = (color.r + color.g + color.b) / 3.0;
    return vec4(avg, avg, avg, 1.0);
}

vec4 sepia(vec4 color) {
    float r = color.r * 0.393 + color.g * 0.769 + color.b * 0.189;
    float g = color.r * 0.349 + color.g * 0.686 + color.b * 0.168;
    float b = color.r * 0.272 + color.g * 0.534 + color.b * 0.131;
    return vec4(r, g, b, 1.0);
}

vec4 contrastBoost(vec4 color) {
    const float contrast = 1.5;
    vec3 factor = (color.rgb - 0.5) * contrast + 0.5;
    return vec4(factor, 1.0);
}

void main() {
    vec4 color = texture2D(texture, vec2(uv.x, uv.y));
    if (filterType == 2) {
        color = grayscale(color);
    } else if (filterType == 3) {
        color = sepia(color);
    } else if (filterType == 4) {
        color = contrastBoost(color);
    }
    gl_FragColor = color;
}
`

export function Filter() {
  //
  const [, setProcessing] = useRecoilState(processingState)
  const [imageData, setImageData] = useRecoilState(imageDataState)
  const [, setEditingMode] = useRecoilState(editingModeState)
  const [glContext, setGLContext] = useRecoilState(glContextState)
  const [imageBounds] = useRecoilState(imageBoundsState)
  const { throttleBlur } = React.useContext(EditorContext)

  const [sliderValue, setSliderValue] = React.useState(1)
  const [filter, setFilter] = React.useState(1)
  const [glProgram, setGLProgram] = React.useState<WebGLProgram | null>(null)

  const onClose = () => {
    // If closing reset the image back to its original
    setGLContext(null)
    setEditingMode("operation-select")
  }

  const onSaveWithBlur = async () => {
    // Set the processing to true so no UI can be interacted with
    setProcessing(true)
    // Take a snapshot of the GLView's current framebuffer and set that as the new image data
    const gl = glContext
    if (gl) {
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      const output = await GLView.takeSnapshotAsync(gl)
      // Do any addtional platform processing of the result and set it as the
      // new image data
      if (Platform.OS === "web") {
        const fileReaderInstance = new FileReader()
        fileReaderInstance.readAsDataURL(output.uri as any)
        fileReaderInstance.onload = async () => {
          const base64data = fileReaderInstance.result
          const flippedOutput = await ImageManinpulator.manipulateAsync(base64data as string, [
            { flip: ImageManinpulator.FlipType.Vertical },
          ])
          setImageData({
            uri: flippedOutput.uri,
            width: flippedOutput.width,
            height: flippedOutput.height,
          })
        }
      } else {
        const flippedOutput = await ImageManinpulator.manipulateAsync(output.uri as string, [
          { flip: ImageManinpulator.FlipType.Vertical },
        ])
        setImageData({
          uri: flippedOutput.uri as string,
          width: flippedOutput.width,
          height: flippedOutput.height,
        })
      }

      // Reset back to operation selection mode
      setProcessing(false)
      setGLContext(null)
      // Small timeout so it can set processing state to flase BEFORE
      // Blur component is unmounted...
      setTimeout(() => {
        setEditingMode("operation-select")
      }, 100)
    }
  }

  React.useEffect(() => {
    if (glContext !== null) {
      const setupGL = async () => {
        // Load in the asset and get its height and width
        const gl = glContext
        // Do some magic instead of using asset.download async as this tries to
        // redownload the file:// uri on android and iOS
        let asset
        if (Platform.OS !== "web") {
          asset = {
            uri: imageData.uri,
            localUri: imageData.uri,
            height: imageData.height,
            width: imageData.width,
          }
          await FileSystem.copyAsync({
            from: asset.uri,
            to: FileSystem.cacheDirectory + "filter.jpg",
          })
          asset.localUri = FileSystem.cacheDirectory + "filter.jpg"
        } else {
          asset = Asset.fromURI(imageData.uri)
          await asset.downloadAsync()
        }
        if (asset.width && asset.height) {
          // Setup the shaders for our GL context so it draws from texImage2D
          const vert = gl.createShader(gl.VERTEX_SHADER)
          const frag = gl.createShader(gl.FRAGMENT_SHADER)
          if (vert && frag) {
            // Set the source of the shaders and compile them
            gl.shaderSource(vert, vertShader)
            gl.compileShader(vert)
            gl.shaderSource(frag, fragShader)
            gl.compileShader(frag)
            // Create a WebGL program so we can link the shaders together
            const program = gl.createProgram()
            if (program) {
              // Attach both the vertex and frag shader to the program
              gl.attachShader(program, vert)
              gl.attachShader(program, frag)
              // Link the program - ensures that vetex and frag shaders are compatible
              // with each other
              gl.linkProgram(program)
              // Tell GL we ant to now use this program
              gl.useProgram(program)
              // Create a buffer on the GPU and assign its type as array buffer
              const buffer = gl.createBuffer()
              gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
              // Create the verticies for WebGL to form triangles on the screen
              // using the vertex shader which forms a square or rectangle in this case
              const verts = new Float32Array([-1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, 1])
              // Actually pass the verticies into the buffer and tell WebGL this is static
              // for optimisations
              gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)
              // Get the index in memory for the position attribute defined in the
              // vertex shader
              const positionAttrib = gl.getAttribLocation(program, "position")
              gl.enableVertexAttribArray(positionAttrib) // Enable it i guess
              // Tell the vertex shader how to process this attribute buffer
              gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0)
              // Fetch an expo asset which can passed in as the source for the
              // texImage2D

              // Create some space in memory for a texture
              const texture = gl.createTexture()
              // Set the active texture to the texture 0 binding (0-30)
              gl.activeTexture(gl.TEXTURE0)
              // Bind the texture to WebGL stating what type of texture it is
              gl.bindTexture(gl.TEXTURE_2D, texture)
              // Set some parameters for the texture
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
              // Then set the data of this texture using texImage2D
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, asset as any)
              // Set a bunch of uniforms we want to pass into our fragment shader
              gl.uniform1i(gl.getUniformLocation(program, "texture"), 0)
              gl.uniform1f(gl.getUniformLocation(program, "width"), asset.width)
              gl.uniform1f(gl.getUniformLocation(program, "height"), asset.height)

              const pixelFrequency = Math.max(
                Math.round(imageData.width / imageBounds.width / 2),
                1,
              )
              gl.uniform1f(gl.getUniformLocation(program, "pixelFrequency"), pixelFrequency)
              setGLProgram(program)
            }
          }
        }
      }
      setupGL().catch((e) => console.error(e))
    }
  }, [glContext, imageData])

  React.useEffect(() => {
    const gl = glContext
    const program = glProgram
    if (gl !== null && program !== null) {
      gl.uniform1i(gl.getUniformLocation(program, "texture"), 0)
      gl.uniform1i(gl.getUniformLocation(program, "filterType"), filter)
      // gl.uniform1i(gl.getUniformLocation(program, "pass"), 0)
      // Setup so first pass renders to a texture rather than to canvas
      // Create and bind the framebuffer
      const firstPassTexture = gl.createTexture()
      // Set the active texture to the texture 0 binding (0-30)
      gl.activeTexture(gl.TEXTURE1)
      // Bind the texture to WebGL stating what type of texture it is
      gl.bindTexture(gl.TEXTURE_2D, firstPassTexture)
      // Set some parameters for the texture
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      // Then set the data of this texture using texImage2D
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null,
      )
      const fb = gl.createFramebuffer()
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
      // attach the texture as the first color attachment
      const attachmentPoint = gl.COLOR_ATTACHMENT0
      gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, firstPassTexture, 0)
      // Actually draw using the shader program we setup!
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.uniform1i(gl.getUniformLocation(program, "texture"), 1)
      gl.uniform1i(gl.getUniformLocation(program, "pass"), 1)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      gl.endFrameEXP()
    }
  }, [filter, glContext, glProgram])

  const throttleSliderBlur = React.useRef<(value: number) => void>(
    throttle((value) => setFilter(value), 50, { leading: true }),
  ).current

  React.useEffect(() => {
    return () => {}
  })

  if (glContext === null) {
    return null
  }

  return (
    <View style={styles.container}>
      <View style={[styles.row, { justifyContent: "center" }]}>
        <Slider
          value={sliderValue}
          onValueChange={(value) => {
            setSliderValue(value[0])
            if (throttleBlur) {
              throttleSliderBlur(Math.round(value[0]))
            } else {
              setFilter(Math.round(value[0]))
            }
          }}
          minimumValue={1}
          maximumValue={4}
          minimumTrackTintColor="#00A3FF"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#c4c4c4"
          containerStyle={styles.slider}
          trackStyle={styles.sliderTrack}
        />
      </View>
      <View style={styles.row}>
        <IconButton iconID="close" text="Cancel" onPress={() => onClose()} />
        <Text style={styles.prompt}>Filter Type {Math.round(sliderValue)}</Text>
        <IconButton iconID="check" text="Done" onPress={() => onSaveWithBlur()} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  prompt: {
    color: "white",
    fontSize: 21,
    textAlign: "center",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    height: 80,
    justifyContent: "space-between",
    paddingHorizontal: "2%",
    width: "100%",
  },
  slider: {
    height: 20,
    maxWidth: 600,
    width: "90%",
  },
  sliderTrack: {
    borderRadius: 10,
  },
})
