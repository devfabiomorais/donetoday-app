import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { darkTheme, lightTheme } from '../../constants/colors'
import { useTheme } from '../../context/ThemeContext'

export default function Workout() {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkTheme : lightTheme
  const router = useRouter()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Routines</Text>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.input }]}
          onPress={() => router.push('/routine/create')}
        >
          <Ionicons name="clipboard-outline" size={20} color={colors.text} />
          <Text style={[styles.buttonText, { color: colors.text }]}>New Routine</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.input }]}
          onPress={() => { }}
        >
          <Ionicons name="search-outline" size={20} color={colors.text} />
          <Text style={[styles.buttonText, { color: colors.text }]}>Explore</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
})