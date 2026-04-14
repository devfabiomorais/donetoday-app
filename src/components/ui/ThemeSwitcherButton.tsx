// components/ThemeSwitcherButton.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable } from "react-native";
import { darkTheme, lightTheme } from "../../constants/colors";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeSwitcherButton() {
  const { theme, toggleTheme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;

  return (
    <Pressable onPress={toggleTheme} style={{ marginRight: 15 }}>
      <Ionicons
        name={theme === "dark" ? "sunny" : "moon"}
        size={24}
        color={colors.text}
      />
    </Pressable>
  );
}
