import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { darkTheme, lightTheme } from '../../constants/colors'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { deleteWorkout, getWorkouts } from '../../services/workouts'

function formatDuration(startedAt: string, finishedAt: string) {
  const diff = new Date(finishedAt).getTime() - new Date(startedAt).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}min`
  return `${Math.floor(mins / 60)}h ${mins % 60}min`
}

function formatVolume(sets: any[]) {
  const total = sets.reduce((acc, s) => {
    if (s.weight && s.reps) return acc + s.weight * s.reps
    return acc
  }, 0)
  return total > 0 ? `${total.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}kg` : null
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function WorkoutCard({ workout, colors, theme, onDelete }: { workout: any; colors: any; theme: string; onDelete: (id: string) => void }) {
  const [menuVisible, setMenuVisible] = useState(false)
  const volume = formatVolume(workout.sets ?? [])
  const uniqueExercises = [...new Map((workout.sets ?? []).map((s: any) => [s.exerciseId, s])).values()].slice(0, 3)

  const MENU_ITEMS = [
    { label: 'Share workout', icon: 'share-social-outline', color: null },
    { label: 'Save as routine', icon: 'save-outline', color: null },
    { label: 'Copy workout', icon: 'copy-outline', color: null },
    { label: 'Edit workout', icon: 'create-outline', color: null },
    { label: 'Delete workout', icon: 'trash-outline', color: '#FF3B30' },
  ]

  return (
    <View style={[styles.card, { backgroundColor: colors.input }]}>

      {/* Row 1 — avatar + name + date + menu */}
      <View style={styles.cardRow1}>
        <View style={[styles.avatar, { backgroundColor: theme === 'dark' ? '#333' : '#ddd' }]}>
          <Ionicons name="person-outline" size={20} color={theme === 'dark' ? '#aaa' : '#666'} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {workout.user?.name ?? 'You'}
          </Text>
          <Text style={[styles.dateText, { color: theme === 'dark' ? '#aaa' : '#888' }]}>
            {formatDate(workout.startedAt)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setMenuVisible(!menuVisible)}
          style={[
            styles.menuTrigger,
            menuVisible && { backgroundColor: theme === 'dark' ? '#333' : '#e0e0e0' }
          ]}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={theme === 'dark' ? '#aaa' : '#888'} />
        </TouchableOpacity>
      </View>

      {/* Menu */}
      {menuVisible && (
        <View style={[styles.menu, { backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f5f5f5' }]}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false)
                if (item.label === 'Delete workout') {
                  Alert.alert(
                    'Delete Workout',
                    'Are you sure you want to delete this workout? This action cannot be undone.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', style: 'destructive', onPress: () => onDelete(workout.id) },
                    ]
                  )
                }
              }}
            >
              <Ionicons
                name={item.icon as any}
                size={22}
                color={item.color ?? colors.text}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Row 2 — routine name */}
      <Text style={[styles.routineName, { color: colors.text }]}>{workout.name}</Text>

      {/* Row 3 — duration + volume */}
      <View style={styles.cardRow3}>
        {workout.finishedAt && (
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={14} color={theme === 'dark' ? '#aaa' : '#888'} />
            <Text style={[styles.statText, { color: theme === 'dark' ? '#aaa' : '#888' }]}>
              {formatDuration(workout.startedAt, workout.finishedAt)}
            </Text>
          </View>
        )}
        {volume && (
          <View style={styles.statItem}>
            <Ionicons name="barbell-outline" size={14} color={theme === 'dark' ? '#aaa' : '#888'} />
            <Text style={[styles.statText, { color: theme === 'dark' ? '#aaa' : '#888' }]}>
              {volume}
            </Text>
          </View>
        )}
      </View>

      {/* Row 4 — top 3 exercises */}
      {uniqueExercises.length > 0 && (
        <View style={styles.exercisesList}>
          {uniqueExercises.map((s: any) => (
            <View key={s.exerciseId} style={styles.exerciseItem}>
              <View style={[styles.exerciseAvatar, { backgroundColor: theme === 'dark' ? '#333' : '#ddd' }]}>
                <Ionicons name="body-outline" size={16} color={theme === 'dark' ? '#aaa' : '#666'} />
              </View>
              <Text style={[styles.exerciseName, { color: colors.text }]}>
                {s.exercise?.name ?? 'Exercise'}
              </Text>
              <Text style={[styles.exerciseSets, { color: theme === 'dark' ? '#aaa' : '#888' }]}>
                {workout.sets?.filter((ws: any) => ws.exerciseId === s.exerciseId).length ?? 0} sets
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Row 5 — like, comment, share */}
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={22} color={theme === 'dark' ? '#aaa' : '#888'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={22} color={theme === 'dark' ? '#aaa' : '#888'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={22} color={theme === 'dark' ? '#aaa' : '#888'} />
        </TouchableOpacity>
      </View>

    </View>
  )
}

export default function Home() {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkTheme : lightTheme
  const { user } = useAuth()

  const [workouts, setWorkouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      if (!user) return

      loadWorkouts()
    }, [user])
  )

  async function loadWorkouts() {
    try {
      setLoading(true)
      const data = await getWorkouts()
      setWorkouts(data)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteWorkout(id)
      setWorkouts((prev) => prev.filter((w) => w.id !== id))
    } catch {
      Alert.alert('Error', 'Failed to delete workout.')
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {loading ? (
        <ActivityIndicator color="#3366FF" style={{ marginTop: 40 }} />
      ) : workouts.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="barbell-outline" size={48} color={theme === 'dark' ? '#555' : '#ccc'} />
          <Text style={[styles.emptyText, { color: theme === 'dark' ? '#555' : '#ccc' }]}>
            No workouts yet. Start your first one!
          </Text>
        </View>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <WorkoutCard workout={item} colors={colors} theme={theme} onDelete={handleDelete} />
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyText: { fontSize: 14, textAlign: 'center', maxWidth: 240 },
  card: { borderRadius: 16, padding: 16, marginBottom: 16 },
  cardRow1: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  userName: { fontSize: 15, fontWeight: '700' },
  dateText: { fontSize: 12, marginTop: 1 },
  menuTrigger: {
    padding: 6,
    borderRadius: 8,
  },
  menu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItem: {
    padding: 4,
  },
  menuText: { fontSize: 14 },
  routineName: { fontSize: 17, fontWeight: '700', marginBottom: 8 },
  cardRow3: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 13 },
  exercisesList: { gap: 8, marginBottom: 12 },
  exerciseItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  exerciseAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  exerciseName: { flex: 1, fontSize: 14 },
  exerciseSets: { fontSize: 12 },
  cardActions: { flexDirection: 'row', gap: 16, marginTop: 4, borderTopWidth: 1, borderTopColor: 'rgba(128,128,128,0.2)', paddingTop: 12 },
  actionButton: { flex: 1, alignItems: 'center' },
})