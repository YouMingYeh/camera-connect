import * as React from "react"
import { View, StyleSheet, ActivityIndicator } from "react-native"

function Processing() {
  return /* #__PURE__ */ React.createElement(
    View,
    {
      style: styles.container,
    },
    /* #__PURE__ */ React.createElement(ActivityIndicator, {
      size: "large",
      color: "#ffffff",
    }),
  )
}

export { Processing }
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#33333355",
    height: "100%",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
  },
})
// # sourceMappingURL=Processing.js.map
