import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { Image, Pressable } from "react-native";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { darkTheme, lightTheme } from "../theme/colors";

function StackLayout() {
  const { theme, toggleTheme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;

  const logoIcon = () => (
    <Image
      source={require("@/assets/images/DONEicon.png")}
      style={{ width: 120, height: 40, resizeMode: "contain" }}
    />
  );

  return (
    <Stack
      screenOptions={{
        headerShown: true,

        headerTitle: logoIcon,
        headerTitleAlign: "center",

        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,

        headerRight: () => (
          <Pressable onPress={toggleTheme} style={{ marginRight: 15 }}>
            <Ionicons
              name={theme === "dark" ? "sunny" : "moon"}
              size={24}
              color={colors.text}
            />
          </Pressable>
        ),
      }}
    />
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <StackLayout />
    </ThemeProvider>
  );
}
