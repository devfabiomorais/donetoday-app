import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#fff" }, // estilo da barra
        tabBarActiveTintColor: "blue",            // cor do ícone/texto ativo
        tabBarInactiveTintColor: "gray",          // cor do ícone/texto inativo
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Login",
          tabBarIcon: () => <Ionicons name="log-in" size={24} />, // aqui você pode usar ícones do @expo/vector-icons
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          title: "Sign Up",
          tabBarIcon: () => <Ionicons name="person-add" size={24} />,
        }}
      />
      <Tabs.Screen
        name="forgot-password"
        options={{
          href: null, // impede que apareça na barra
        }}
      />

    </Tabs>
  );
}
