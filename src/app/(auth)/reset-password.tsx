import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, Image, StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { darkTheme, lightTheme } from '../../constants/colors'
import { useTheme } from '../../context/ThemeContext'

export default function ResetPassword() {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkTheme : lightTheme
  const { token } = useLocalSearchParams<{ token: string }>()
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [confirmPasswordError, setConfirmPasswordError] = useState(false)
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false)
  const [loading, setLoading] = useState(false)

  function validatePassword(value: string) {
    const valid = value.trim().length >= 6
    setPasswordError(!valid)
    setIsPasswordValid(valid)
  }

  function validateConfirmPassword(value: string) {
    const valid = value === password && value.trim().length >= 6
    setConfirmPasswordError(!valid)
    setIsConfirmPasswordValid(valid)
  }

  async function handleResetPassword() {
    if (!isPasswordValid || !isConfirmPasswordValid) {
      Alert.alert('Error', 'Please fix the highlighted fields.')
      return
    }

    try {
      setLoading(true)
      await fetch('https://donetoday-api-production.up.railway.app/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      Alert.alert('Success', 'Password reset successfully!', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') }
      ])
    } catch (error: any) {
      Alert.alert('Error', 'Invalid or expired token.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
      enableOnAndroid
      extraScrollHeight={120}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Image
          source={require('@/assets/images/DONE.png')}
          style={styles.illustration}
        />

        <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Enter your new password below.
        </Text>

        <View style={styles.form}>
          <Input
            placeholder="New Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onBlur={() => validatePassword(password)}
            onFocus={() => setPasswordError(false)}
            style={passwordError ? { borderColor: 'red', borderWidth: 1 } : {}}
          />
          <Input
            placeholder="Confirm New Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onBlur={() => validateConfirmPassword(confirmPassword)}
            onFocus={() => setConfirmPasswordError(false)}
            style={confirmPasswordError ? { borderColor: 'red', borderWidth: 1 } : {}}
          />
          <Button
            label={loading ? 'Loading...' : 'Reset Password'}
            onPress={handleResetPassword}
            disabled={!isPasswordValid || !isConfirmPasswordValid || loading}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 32 },
  illustration: { width: '100%', height: 240, resizeMode: 'contain' },
  title: { fontSize: 24, fontWeight: '900' },
  subtitle: { fontSize: 16 },
  form: { marginTop: 24, gap: 12 },
})