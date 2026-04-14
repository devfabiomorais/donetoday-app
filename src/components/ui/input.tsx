import { BlurView } from "expo-blur";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { darkTheme, lightTheme } from "../../constants/colors";
import { useTheme } from "../../context/ThemeContext";

export function Input(props: TextInputProps) {
  const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;

  return (
    <View style={styles.wrapper}>
      <BlurView
        intensity={60}
        tint={theme === "dark" ? "dark" : "light"}
        style={[
          styles.container,
          {
            borderColor:
              theme === "dark"
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)",
          },
        ]}
      >
        <View style={styles.overlay} />

        <TextInput
          {...props}
          placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
          style={[
            styles.input,
            {
              color: colors.text,
            },
            props.style,
          ]}
        />
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },

  container: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.1)"
  },

  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 16,
  },
});