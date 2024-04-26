import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Feather } from "@expo/vector-icons"

interface ExpandableSectionProps {
  title: string
  children: React.ReactNode
}

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false)

  const handlePress = () => {
    setExpanded(!expanded)
  }

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <View style={styles.innerContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.buttonText}>{title}</Text>
          </View>
          <Feather name={expanded ? "chevron-up" : "chevron-down"} size={24} color="white" />
        </View>
      </TouchableOpacity>
      {expanded && children}
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: "black",
    marginTop: 16,
    borderRadius: 4,
    width: 300,
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 18,
  },
})
