import { BlurView } from "expo-blur";
import { useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

type ButtonProps = TouchableOpacityProps & {
  label: string;
};

export function Button({ label, disabled, ...props }: ButtonProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 3,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 1.5,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY }, { translateX }],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
        style={styles.wrapper}
      >
        <BlurView
          intensity={80}
          tint="default"
          style={[
            styles.container,
            disabled ? styles.disabled : styles.enabled,
          ]}
        >
          <View
            style={[
              styles.overlay,
              disabled ? styles.overlayDisabled : styles.overlayEnabled,
            ]}
          />

          <Text
            style={[
              styles.label,
              disabled ? styles.labelDisabled : styles.labelEnabled,
            ]}
          >
            {label}
          </Text>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },

  container: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1.2,
  },

  enabled: {
    borderColor: "rgba(120,180,255,0.5)",
  },

  disabled: {
    borderColor: "rgba(200,200,200,0.3)",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  overlayEnabled: {
    backgroundColor: "rgba(56, 145, 255, 0.51)", // azul glass
  },

  overlayDisabled: {
    backgroundColor: "rgba(200,200,200,0.25)", // cinza glass
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
  },

  labelEnabled: {
    color: "#fff",
  },

  labelDisabled: {
    color: "#999",
  },
});