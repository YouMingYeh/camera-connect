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
      <Icon icon="caretLeft" size={24} />
      {children || <Text tx="common.back" style={$text}/>}
    </TouchableOpacity>
  )
})

const $container: ViewStyle = {
  padding: 10,
  flexDirection: "row",
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 24,
  padding: 5,
}
