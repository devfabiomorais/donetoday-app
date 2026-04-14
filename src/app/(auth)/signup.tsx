import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { darkTheme, lightTheme } from "../../constants/colors";
import { useTheme } from "../../context/ThemeContext";

export default function SignUp() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [confirmEmailError, setConfirmEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const [isNameValid, setIsNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isConfirmEmailValid, setIsConfirmEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] =
    useState(false);

  // ===== VALIDATIONS =====

  function validateName(value: string) {
    const valid = value.trim().length >= 2;
    setNameError(!valid);
    setIsNameValid(valid);
  }

  function validateEmail(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(value.trim());
    setEmailError(!valid);
    setIsEmailValid(valid);
  }

  function validateConfirmEmail(value: string) {
    const valid = value.trim() === email.trim() && value.trim() !== "";
    setConfirmEmailError(!valid);
    setIsConfirmEmailValid(valid);
  }

  function validatePassword(value: string) {
    const valid = value.trim().length >= 6;
    setPasswordError(!valid);
    setIsPasswordValid(valid);
  }

  function validateConfirmPassword(value: string) {
    const valid = value === password && value.trim().length >= 6;
    setConfirmPasswordError(!valid);
    setIsConfirmPasswordValid(valid);
  }

  // ===== AUTO REVALIDATION =====

  useEffect(() => {
    if (confirmEmail) {
      validateConfirmEmail(confirmEmail);
    }
  }, [email]);

  useEffect(() => {
    if (confirmPassword) {
      validateConfirmPassword(confirmPassword);
    }
  }, [password]);

  // ===== SUBMIT =====

  function handleSignUp() {
    if (
      !isNameValid ||
      !isEmailValid ||
      !isConfirmEmailValid ||
      !isPasswordValid ||
      !isConfirmPasswordValid
    ) {
      Alert.alert("Error", "Please fix the highlighted fields.");
      return;
    }

    Alert.alert("Sign Up", "Signing up...");
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: colors.background }} // 👈 resolve o filete branco
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }} // 👈 espaço real pra subir acima do teclado
      enableOnAndroid
      extraScrollHeight={120} // 👈 aumenta isso
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Image
          source={require("@/assets/images/DONE.png")}
          style={styles.illustration}
        />

        <Text style={[styles.title, { color: colors.text }]}>
          Sign Up
        </Text>

        <Text style={[styles.subtitle, { color: colors.text }]}>
          Please create an account to continue.
        </Text>

        <View style={styles.form}>
          <Input
            placeholder="Name"
            value={name}
            onChangeText={setName}
            onBlur={() => validateName(name)}
            onFocus={() => setNameError(false)}
            style={
              nameError ? { borderColor: "red", borderWidth: 1 } : {}
            }
          />

          <Input
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            onBlur={() => validateEmail(email)}
            onFocus={() => setEmailError(false)}
            style={
              emailError ? { borderColor: "red", borderWidth: 1 } : {}
            }
          />

          <Input
            placeholder="Confirm Email"
            keyboardType="email-address"
            value={confirmEmail}
            onChangeText={setConfirmEmail}
            onBlur={() => validateConfirmEmail(confirmEmail)}
            onFocus={() => setConfirmEmailError(false)}
            style={
              confirmEmailError
                ? { borderColor: "red", borderWidth: 1 }
                : {}
            }
          />

          <Input
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onBlur={() => validatePassword(password)}
            onFocus={() => setPasswordError(false)}
            style={
              passwordError
                ? { borderColor: "red", borderWidth: 1 }
                : {}
            }
          />

          <Input
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onBlur={() => validateConfirmPassword(confirmPassword)}
            onFocus={() => setConfirmPasswordError(false)}
            style={
              confirmPasswordError
                ? { borderColor: "red", borderWidth: 1 }
                : {}
            }
          />

          <Button
            label="Sign Up"
            onPress={handleSignUp}
            disabled={
              !isNameValid ||
              !isEmailValid ||
              !isConfirmEmailValid ||
              !isPasswordValid ||
              !isConfirmPasswordValid
            }
          />

          <Text style={[styles.disclaimerText, { color: colors.text }]}>
            By clicking "Sign Up", I acknowledge that this app is not age-restricted and that minors should use it under parental or guardian supervision.
          </Text>

        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  disclaimerText: {
    fontSize: 10,
    opacity: 0.7,
    textAlign: "center",
  },
});