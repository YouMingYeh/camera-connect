"use strict"

Object.defineProperty(exports, "__esModule", {
  value: true,
})
exports.Crop = Crop

const React = _interopRequireWildcard(require("react"))

const _reactNative = require("react-native")

const _recoil = require("recoil")

const _IconButton = require("../components/IconButton")

const _Store = require("../Store")

const _usePerformCrop = require("../customHooks/usePerformCrop")

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null
  const cacheBabelInterop = new WeakMap()
  const cacheNodeInterop = new WeakMap()
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop
  })(nodeInterop)
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj
  }
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return { default: obj }
  }
  const cache = _getRequireWildcardCache(nodeInterop)
  if (cache && cache.has(obj)) {
    return cache.get(obj)
  }
  const newObj = {}
  const hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor
  for (const key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      const desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc)
      } else {
        newObj[key] = obj[key]
      }
    }
  }
  newObj.default = obj
  if (cache) {
    cache.set(obj, newObj)
  }
  return newObj
}

function Crop() {
  const [, setEditingMode] = (0, _recoil.useRecoilState)(_Store.editingModeState)
  const onPerformCrop = (0, _usePerformCrop.usePerformCrop)()
  return /* #__PURE__ */ React.createElement(
    _reactNative.View,
    {
      style: styles.container,
    },
    /* #__PURE__ */ React.createElement(_IconButton.IconButton, {
      iconID: "close",
      text: "Cancel",
      onPress: () => setEditingMode("operation-select"),
    }),
    /* #__PURE__ */ React.createElement(
      _reactNative.Text,
      {
        style: styles.prompt,
      },
      "Adjust window to crop",
    ),
    /* #__PURE__ */ React.createElement(_IconButton.IconButton, {
      iconID: "check",
      text: "Done",
      onPress: onPerformCrop,
    }),
  )
}

const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "2%",
  },
  prompt: {
    color: "#fff",
    fontSize: 21,
    textAlign: "center",
  },
})
// # sourceMappingURL=Crop.js.map
