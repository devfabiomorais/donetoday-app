import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { darkTheme, lightTheme } from '../../constants/colors'
import { useTheme } from '../../context/ThemeContext'
import { getRoutines } from '../../services/routines'
import { startWorkout } from '../../services/workouts'

export default function Workout() {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkTheme : lightTheme
  const router = useRouter()

  const [routines, setRoutines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      loadRoutines()
    }, [])
  )

  async function loadRoutines() {
    try {
      setLoading(true)
      const data = await getRoutines()
      setRoutines(data)
    } finally {
      setLoading(false)
    }
  }

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

      {loading ? (
        <ActivityIndicator color="#3366FF" style={{ marginTop: 40 }} />
      ) : routines.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="barbell-outline" size={48} color={theme === 'dark' ? '#555' : '#ccc'} />
          <Text style={[styles.emptyText, { color: theme === 'dark' ? '#555' : '#ccc' }]}>
            No routines yet. Create your first one!
          </Text>
        </View>
      ) : (
        <FlatList
          data={routines}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          style={{ marginTop: 16 }}
          renderItem={({ item }) => (
            <View style={[styles.routineCard, { backgroundColor: colors.input }]}>
              <View style={styles.routineInfo}>
                <Text style={[styles.routineName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.routineExercises, { color: theme === 'dark' ? '#aaa' : '#666' }]}>
                  {item.exercises?.length ?? 0} exercises
                </Text>
              </View>
              <TouchableOpacity
                style={styles.startButton}
                onPress={async () => {
                  const workout = await startWorkout({
                    name: item.name,
                    routineId: item.id,
                  })
                  router.push({
                    pathname: '/workout/active',
                    params: {
                      workoutId: workout.id,
                      routineId: item.id,
                      routineName: item.name,
                      exercises: JSON.stringify(item.exercises),
                    },
                  })
                }}
              >
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  buttonsRow: { flexDirection: 'row', gap: 12 },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
  },
  buttonText: { fontSize: 15, fontWeight: '600' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 16 },
  emptyText: { fontSize: 14, textAlign: 'center', maxWidth: 240 },
  routineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  routineInfo: { flex: 1 },
  routineName: { fontSize: 16, fontWeight: '700' },
  routineExercises: { fontSize: 13, marginTop: 2 },
  startButton: {
    backgroundColor: '#3366FF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  startButtonText: { color: '#fff', fontWeight: '700' },
})