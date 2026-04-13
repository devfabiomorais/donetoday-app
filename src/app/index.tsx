import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Link } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { darkTheme, lightTheme } from "../theme/colors";

export default function Index() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignIn() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    Alert.alert("Sign In", "Signing in...");
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.select({ ios: "padding", android: "height" })}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <Image
            source={require("@/assets/images/DONE.png")}
            style={styles.illustration}
          />

          <Text style={[styles.title, { color: colors.text }]}>Login</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            Please login to your account to continue.
          </Text>
          <View style={styles.form}>
            <Input
              placeholder="Email"
              keyboardType="email-address"
              onChangeText={setEmail}
            />
            <Input
              placeholder="Password"
              secureTextEntry
              onChangeText={setPassword}
            />
            <Text style={[styles.forgotText, { color: colors.text }]}>
              Forgot your password?
              <Link href="/forgot-password" style={styles.footerLink}>
                {" "}
                Tap here.
              </Link>
            </Text>
            <Button label="Login" onPress={handleSignIn} />
          </View>

          <Text style={[styles.footerText, { color: colors.text }]}>
            Don't have an account?
            <Link href="/signup" style={styles.footerLink}>
              {" "}
              Sign up.
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },
  illustration: {
    width: "100%",
    height: 240,
    resizeMode: "contain",
    marginTop: 62,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    marginTop: 24,
    gap: 12,
  },
  footerText: {
    textAlign: "center",
    marginTop: 24,
    color: "#585860",
    fontSize: 16,
  },
  forgotText: {
    textAlign: "left",
    color: "#777777",
    fontSize: 12,
  },
  footerLink: {
    color: "#3366FF",
    fontWeight: "700",
  },
});
