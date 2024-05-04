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
        <Text style={styles.expandButtonText}>{title}</Text>
        <Feather
          style={styles.expandButtonIcon}
          name={expanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="white"
        />
      </TouchableOpacity>
      {expanded && children}
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: "black",
    marginTop: 16,
    borderRadius: 4,
    width: 300,
  },
  expandButton: {
    position: "relative",
    alignItems: "center",
    height: 60,
    backgroundColor: "black",
    marginTop: 16,
    borderRadius: 4,
    width: 300,
  },
  expandButtonIcon: {
    position: "absolute",
    right: 16,
  },
  expandButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 18,
  },
})
