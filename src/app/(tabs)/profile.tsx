import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { darkTheme, lightTheme } from '../../constants/colors'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

export default function Profile() {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkTheme : lightTheme
  const { signOut, user } = useAuth()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>{user?.name}</Text>
      <TouchableOpacity onPress={signOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 24, fontWeight: '900', marginBottom: 24 },
  button: { backgroundColor: '#ff4444', padding: 16, borderRadius: 12 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
})