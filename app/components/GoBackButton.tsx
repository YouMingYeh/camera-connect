import * as React from "react"
import { TextStyle, TouchableOpacity, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { typography } from "app/theme"
import { Text } from "app/components/Text"
import { Icon } from "./Icon"

export interface GoBackButtonProps {
  /**
   * An optional text to display.
   */
  label?: string

  goBack: () => void
}

/**
 * Describe your component here
 */
export const GoBackButton = observer(function GoBackButton(props: GoBackButtonProps) {
<<<<<<< HEAD
  const { label, goBack } = props
=======
  const { children, goBack } = props
>>>>>>> f93e431 (feat: Implement favorite and suggestion carousel)

  return (
    <TouchableOpacity onPress={goBack} style={$container}>
      <Icon icon="caretLeft" size={24} />
<<<<<<< HEAD
      {label ? <Text style={$text}>{label}</Text> : <Text tx="common.back" style={$text} />}
=======
      {children || <Text tx="common.back" style={$text} />}
>>>>>>> f93e431 (feat: Implement favorite and suggestion carousel)
    </TouchableOpacity>
  )
})

const $container: ViewStyle = {
  padding: 10,
  flexDirection: "row",
  width: "30%",
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 24,
  padding: 5,
}
