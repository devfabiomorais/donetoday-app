import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type ButtonProps = TouchableOpacityProps & {
  label: string;
};

export function Button({ label, disabled, ...props }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        disabled ? styles.containerDisabled : styles.containerEnabled,
      ]}
      activeOpacity={0.7}
      disabled={disabled}
      {...props}
    >
      <Text
        style={[
          styles.label,
          disabled ? styles.labelDisabled : styles.labelEnabled,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  containerEnabled: {
    backgroundColor: "#3366FF", // azul normal
  },
  containerDisabled: {
    backgroundColor: "#CCCCCC", // cinza quando desabilitado
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  labelEnabled: {
    color: "#fff",
  },
  labelDisabled: {
    color: "#666666", // cinza escuro no texto
  },
});
