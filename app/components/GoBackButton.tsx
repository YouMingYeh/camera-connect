import * as React from "react"
import { TextStyle, TouchableOpacity, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { typography } from "app/theme"
import { Text } from "app/components/Text"

export interface GoBackButtonProps {

  /**
   * An optional text to display.
   */
  children?: React.ReactNode

  goBack: () => void
}

/**
 * Describe your component here
 */
export const GoBackButton = observer(function GoBackButton(props: GoBackButtonProps) {
  const { children, goBack} = props

  return (
    <TouchableOpacity onPress={goBack} style={$container}>
      {children || <Text text={"< Go Back"} style={$text}/>}
    </TouchableOpacity>
  )
})

const $container: ViewStyle = {
  justifyContent: "flex-start",
  padding: 10
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 24,
  padding: 5,
}
