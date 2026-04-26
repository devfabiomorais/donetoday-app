import { BlurView } from "expo-blur"
import React from "react"
import {
  Platform,
  StyleProp,
  View,
  ViewStyle,
} from "react-native"

type Props = {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  intensity?: number
  tint?: "light" | "dark"
  androidOpacity?: number
}

export default function GlassModal({
  children,
  style,
  intensity = 90,
  tint = "light",
  androidOpacity = 0.08,
}: Props) {
  if (Platform.OS === "ios") {
    return (
      <BlurView intensity={intensity} tint={tint} style={style}>
        {children}
      </BlurView>
    )
  }

  // Android fallback (glass fake consistente)
  return (
    <View
      style={[
        style,
        {
          backgroundColor: `rgba(255,255,255,${androidOpacity})`,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.15)",
        },
      ]}
    >
      {children}
    </View>
  )
}