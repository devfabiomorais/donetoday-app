import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { darkTheme, lightTheme } from "../theme/colors";

export function Input(props: TextInputProps) {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;

  return (
    <TextInput
      {...props}
      placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
      style={[
        styles.input,
        {
          backgroundColor: colors.input,
          color: colors.text,
          borderColor: theme === "dark" ? "#333" : "#dcdcdc",
        },
        props.style, // mantém customizações externas
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    paddingLeft: 16,
  },
});
