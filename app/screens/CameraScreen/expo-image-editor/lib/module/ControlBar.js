import * as React from "react"
import { View, StyleSheet } from "react-native"
import { useRecoilState } from "recoil"
import { editingModeState, imageDataState, processingState } from "./Store"
import { IconButton } from "./components/IconButton"
import { useContext , useEffect } from "react"
import { EditorContext } from "./index"
import { usePerformCrop } from "./customHooks/usePerformCrop"

function ControlBar() {
  //
  const [editingMode, setEditingMode] = useRecoilState(editingModeState)
  const [imageData] = useRecoilState(imageDataState)
  const [processing, setProcessing] = useRecoilState(processingState)
  const { mode, onCloseEditor, onEditingComplete } = useContext(EditorContext)
  const performCrop = usePerformCrop()
  const shouldDisableDoneButton = editingMode !== "operation-select" && mode !== "crop-only"

  const onFinishEditing = async () => {
    if (mode === "full") {
      setProcessing(false)
      onEditingComplete(imageData)
      onCloseEditor()
    } else if (mode === "crop-only") {
      await performCrop()
    }
  }

  const onPressBack = () => {
    if (mode === "full") {
      if (editingMode === "operation-select") {
        onCloseEditor()
      } else {
        setEditingMode("operation-select")
      }
    } else if (mode === "crop-only") {
      onCloseEditor()
    }
  } // Complete the editing process if we are in crop only mode after the editingMode gets set
  // back to operation select (happens internally in usePerformCrop) - can't do it in onFinishEditing
  // else it gets stale state - may need to refactor the hook as this feels hacky

  useEffect(() => {
    if (mode === "crop-only" && imageData.uri && editingMode === "operation-select") {
      onEditingComplete(imageData)
      onCloseEditor()
    }
  }, [imageData, editingMode])
  return /* #__PURE__ */ React.createElement(
    View,
    {
      style: styles.container,
    },
    /* #__PURE__ */ React.createElement(IconButton, {
      iconID: "arrow-back",
      text: "Back",
      onPress: onPressBack,
    }),
    /* #__PURE__ */ React.createElement(IconButton, {
      iconID: "done",
      text: "Done",
      onPress: onFinishEditing,
      disabled: shouldDisableDoneButton,
    }),
  )
}

export { ControlBar }
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#333",
    flexDirection: "row",
    height: 80,
    justifyContent: "space-between",
    paddingHorizontal: 4,
    width: "100%",
  },
})
// # sourceMappingURL=ControlBar.js.map
