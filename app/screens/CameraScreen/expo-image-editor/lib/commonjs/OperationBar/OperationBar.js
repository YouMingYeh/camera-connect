"use strict"

Object.defineProperty(exports, "__esModule", {
  value: true,
})
exports.OperationBar = OperationBar

const React = _interopRequireWildcard(require("react"))

const _reactNative = require("react-native")

const _Store = require("../Store")

const _recoil = require("recoil")

const _OperationSelection = require("./OperationSelection")

const _Crop = require("./Crop")

const _Rotate = require("./Rotate")

const _Blur = require("./Blur")

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

function OperationBar() {
  //
  const [editingMode] = (0, _recoil.useRecoilState)(_Store.editingModeState)

  const getOperationWindow = () => {
    switch (editingMode) {
      case "crop":
        return /* #__PURE__ */ React.createElement(_Crop.Crop, null)

      case "rotate":
        return /* #__PURE__ */ React.createElement(_Rotate.Rotate, null)

      case "blur":
        return /* #__PURE__ */ React.createElement(_Blur.Blur, null)

      default:
        return null
    }
  }

  return /* #__PURE__ */ React.createElement(
    _reactNative.View,
    {
      style: styles.container,
    },
    /* #__PURE__ */ React.createElement(_OperationSelection.OperationSelection, null),
    editingMode !== "operation-select" &&
      /* #__PURE__ */ React.createElement(
        _reactNative.View,
        {
          style: [
            styles.container,
            {
              position: "absolute",
            },
          ],
        },
        getOperationWindow(),
      ),
  )
}

const styles = _reactNative.StyleSheet.create({
  container: {
    height: 160,
    width: "100%",
    backgroundColor: "#333",
    justifyContent: "center",
  },
})
// # sourceMappingURL=OperationBar.js.map
