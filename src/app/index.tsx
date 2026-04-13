import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Link } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
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

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [loading, setLoading] = useState(false);

  // valida email
  function validateEmail(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(value.trim());
    setEmailError(!valid);
    setIsEmailValid(valid);
  }

  // valida senha
  function validatePassword(value: string) {
    const valid = value.trim().length >= 6;
    setPasswordError(!valid);
    setIsPasswordValid(valid);
  }

  function handleSignIn() {
    Keyboard.dismiss();

    if (!isEmailValid || !isPasswordValid) {
      Alert.alert("Error", "Please fix the highlighted fields.");
      return;
    }

    setLoading(true);

    Alert.alert("Sign In", "Signing in...");
    setLoading(false);
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
        <View style={[styles.container, { backgroundColor: colors.background }]}>
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
              value={email}
              onChangeText={setEmail}
              onBlur={() => validateEmail(email)}
              onFocus={() => setEmailError(false)}
              style={emailError ? { borderColor: "red", borderWidth: 1 } : {}}
            />

            <Input
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onBlur={() => validatePassword(password)}
              onFocus={() => setPasswordError(false)}
              style={passwordError ? { borderColor: "red", borderWidth: 1 } : {}}
            />

            <Text style={[styles.forgotText, { color: colors.text }]}>
              Forgot your password?
              <Link href="/forgot-password" style={styles.footerLink}>
                {" "}
                Tap here.
              </Link>
            </Text>

            <Button
              label={loading ? "Loading..." : "Login"}
              onPress={handleSignIn}
              disabled={!isEmailValid || !isPasswordValid || loading}
            />
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