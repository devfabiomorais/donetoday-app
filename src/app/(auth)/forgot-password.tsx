import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { darkTheme, lightTheme } from "../../constants/colors";
import { useAuth } from '../../context/AuthContext';
import { useTheme } from "../../context/ThemeContext";

export default function ForgotPassword() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const { forgotPassword } = useAuth()
  const [loading, setLoading] = useState(false)

  // valida email
  function validateEmail(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(value.trim());
    setEmailError(!valid);
    setIsEmailValid(valid);
  }

  async function handleResetPassword() {
    if (!isEmailValid) {
      Alert.alert('Error', 'Please enter a valid email.')
      return
    }

    try {
      setLoading(true)
      await forgotPassword(email)
      Alert.alert(
        'Email sent',
        'If this email exists, a reset link has been sent to your inbox.'
      )
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'An error occurred. Please try again.'
      Alert.alert('Error', message)
    } finally {
      setLoading(false)
    }
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
              value={email}
              onChangeText={setEmail}
              onBlur={() => validateEmail(email)}
              onFocus={() => setEmailError(false)}
              style={
                emailError ? { borderColor: "red", borderWidth: 1 } : {}
              }
            />

            <Button
              label={loading ? 'Loading...' : 'Reset Password'}
              onPress={handleResetPassword}
              disabled={!isEmailValid || loading}
            />

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