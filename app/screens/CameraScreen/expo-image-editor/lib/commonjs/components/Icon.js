"use strict"

Object.defineProperty(exports, "__esModule", {
  value: true,
})
exports.Icon = Icon

const React = _interopRequireWildcard(require("react"))

const _reactNative = require("react-native")

const _vectorIcons = require("@expo/vector-icons")

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

function Icon(props) {
  return /* #__PURE__ */ React.createElement(
    _reactNative.View,
    {
      style: styles.container,
    },
    /* #__PURE__ */ React.createElement(_vectorIcons.MaterialIcons, {
      name: props.iconID,
      size: 26,
      color: props.disabled ? "grey" : "white",
    }),
    /* #__PURE__ */ React.createElement(
      _reactNative.Text,
      {
        style: [
          styles.text,
          props.disabled && {
            color: "grey",
          },
        ],
      },
      props.text,
    ),
  )
}

const styles = _reactNative.StyleSheet.create({
  container: {
    height: 64,
    width: 80,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  text: {
    color: "#fff",
    textAlign: "center",
  },
})
// # sourceMappingURL=Icon.js.map
