import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { Image } from "react-native";
import ThemeSwitcherButton from "../components/ui/ThemeSwitcherButton";
import { darkTheme, lightTheme } from "../constants/colors";
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ThemeProvider, useTheme } from "../context/ThemeContext";

function AuthGuard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login')
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)/home' as any)
    }
  }, [user, isLoading, segments])

  return null
}

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
    <>
      <AuthGuard />
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
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)/login" options={{ headerTitle: "" }} />
        <Stack.Screen name="(auth)/signup" options={{ headerTitle: "" }} />
        <Stack.Screen name="(auth)/forgot-password" options={{ headerTitle: "" }} />
        <Stack.Screen name="(auth)/reset-password" options={{ headerTitle: "" }} />
        <Stack.Screen name="routine/create" options={{ headerShown: false }} />
        <Stack.Screen name="routine/add-exercise" options={{ headerShown: false }} />
        <Stack.Screen name="workout/active" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StackLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}
