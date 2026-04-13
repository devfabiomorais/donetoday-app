import { Stack } from "expo-router";
import { Image } from "react-native";
import ThemeSwitcherButton from "../components/ThemeSwitcherButton";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { darkTheme, lightTheme } from "../theme/colors";

function StackLayout() {
  const { theme } = useTheme();
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
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerRight: () => <ThemeSwitcherButton />,
      }}
    >
      {/* Exceções: nessas telas o logo não aparece */}
      <Stack.Screen name="index" options={{ headerTitle: "" }} />
      <Stack.Screen name="signup" options={{ headerTitle: "" }} />
      <Stack.Screen name="forgot-password" options={{ headerTitle: "" }} />
    </Stack>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <StackLayout />
    </ThemeProvider>
  );
}
