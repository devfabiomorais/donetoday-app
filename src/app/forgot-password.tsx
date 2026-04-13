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

export default function ForgotPassword() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;

  const [email, setEmail] = useState("");

  function handleResetPassword() {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }
    Alert.alert("Reset Password", "Sending reset link...");
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

          <Text style={[styles.title, { color: colors.text }]}>
            Forgot Password
          </Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            Please enter your email to reset your password.
          </Text>
          <View style={styles.form}>
            <Input
              placeholder="Your Email"
              keyboardType="email-address"
              onChangeText={setEmail}
            />

            <Button label="Reset Password" onPress={handleResetPassword} />
          </View>
          <Text style={[styles.footerText, { color: colors.text }]}>
            Having trouble?
            <Link href="/forgot-password" style={styles.footerLink}>
              {" "}
              Tap here.
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
  footerLink: {
    color: "#3366FF",
    fontWeight: "700",
  },
});
