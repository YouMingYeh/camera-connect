import * as React from "react"
import { View, StyleSheet, ActivityIndicator } from "react-native"

function Processing() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
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
