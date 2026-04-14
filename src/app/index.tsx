import { Link } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { darkTheme, lightTheme } from "../constants/colors";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  // valida email
  function validateEmail(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(value.trim());
    setEmailError(!valid);
    setIsEmailValid(valid);
  }

  function handleResetPassword() {
    if (!isEmailValid) {
      Alert.alert("Error", "Please enter a valid email.");
      return;
    }

    Alert.alert("Reset Password", "Sending reset link...");
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
      extraScrollHeight={20}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >

          <Text style={[styles.title, { color: colors.text }]}>
            HOME
          </Text>

          <Link href="/signup" style={styles.footerLink}>
            {" "}
            Sign up.
          </Link>
          <Link href="/(auth)/login" style={styles.footerLink}>
            {" "}
            Login.
          </Link>
          <Link href="/(auth)/forgot-password" style={styles.footerLink}>
            {" "}
            Forgot Password
          </Link>

        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
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
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    alignContent: "center",
    textAlign: "center",
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
  footerLink: {
    color: "#3366FF",
    fontWeight: "700",
    alignContent: "center",
    textAlign: "center",
    marginTop: 26,
  },
});