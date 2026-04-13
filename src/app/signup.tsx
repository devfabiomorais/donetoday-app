
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSignUp() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    Alert.alert("Sign Up", "Signing up...")

  }


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: "height" })}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>

          <Image
            source={require("@/assets/images/DONE.png")}
            style={styles.illustration}
          />

          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>Please create an account to continue.</Text>
          <View style={styles.form}>
            <Input placeholder="Name"
              onChangeText={setName} />
            <Input placeholder="Email" keyboardType="email-address"
              onChangeText={setEmail} />
            <Input placeholder="Confirm Email" keyboardType="email-address"
              onChangeText={setConfirmEmail} />
            <Input placeholder="Password" secureTextEntry
              onChangeText={setPassword} />
            <Input placeholder="Confirm Password" secureTextEntry
              onChangeText={setConfirmPassword} />
            <Button label="Sign Up" onPress={handleSignUp} />
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfdfd",
    padding: 32,
  },
  illustration: {
    width: "100%",
    height: 330,
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
    color: "#032ad7",
    fontWeight: "700",
  },
});