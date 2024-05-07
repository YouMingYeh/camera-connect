"use strict"

Object.defineProperty(exports, "__esModule", {
  value: true,
})
exports.UniversalModal = void 0

const _react = _interopRequireDefault(require("react"))

const _reactNative = require("react-native")

const _modalEnhancedReactNativeWeb = _interopRequireDefault(
  require("modal-enhanced-react-native-web"),
)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

// @ts-ignore
const UniversalModal = (props) => {
  if (_reactNative.Platform.OS === "web") {
    return /* #__PURE__ */ _react.default.createElement(
      _modalEnhancedReactNativeWeb.default,
      {
        isVisible: props.visible,
        style: {
          margin: 0,
        },
      },
      props.children,
    )
  }

  return /* #__PURE__ */ _react.default.createElement(_reactNative.Modal, props)
}

exports.UniversalModal = UniversalModal
// # sourceMappingURL=UniversalModal.js.map
