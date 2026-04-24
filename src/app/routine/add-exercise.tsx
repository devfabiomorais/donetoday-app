import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { darkTheme, lightTheme } from '../../constants/colors'
import { useTheme } from '../../context/ThemeContext'
import { getExercises, getMyExercises } from '../../services/exercises'
import { routineStore } from '../../store/routineStore'

export default function AddExercise() {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkTheme : lightTheme
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [exercises, setExercises] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [selected, setSelected] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExercises()
  }, [])

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(exercises)
    } else {
      setFiltered(
        exercises.filter((e) =>
          e.name.toLowerCase().includes(search.toLowerCase())
        )
      )
    }
  }, [search, exercises])

  async function loadExercises() {
    try {
      const [global, custom] = await Promise.all([getExercises(), getMyExercises()])
      const all = [...global, ...custom]
      setExercises(all)
      setFiltered(all)
    } finally {
      setLoading(false)
    }
  }

  function toggleExercise(exercise: any) {
    setSelected((prev) =>
      prev.find((e) => e.id === exercise.id)
        ? prev.filter((e) => e.id !== exercise.id)
        : [...prev, exercise]
    )
  }

  function handleAdd() {
    routineStore.setSelectedExercises(selected)
    router.back()
  }

  return (
    <>
      {/* Header */}
      <View style={[styles.header, {
        backgroundColor: colors.background,
        borderBottomColor: theme === 'dark' ? '#333' : '#eee',
        paddingTop: insets.top + 12,
      }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Add Exercise</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={[styles.container, { backgroundColor: colors.background }]}>

        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: colors.input }]}>
          <Ionicons name="search-outline" size={18} color={theme === 'dark' ? '#aaa' : '#666'} />
          <TextInput
            placeholder="Search exercises..."
            placeholderTextColor={theme === 'dark' ? '#aaa' : '#666'}
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: colors.text }]}
          />
        </View>

        {/* Filter buttons - placeholder */}
        <View style={styles.filtersRow}>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.input }]}>
            <Ionicons name="barbell-outline" size={16} color={colors.text} />
            <Text style={[styles.filterText, { color: colors.text }]}>Equipment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.input }]}>
            <Ionicons name="body-outline" size={16} color={colors.text} />
            <Text style={[styles.filterText, { color: colors.text }]}>Muscle Group</Text>
          </TouchableOpacity>
        </View>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: theme === 'dark' ? '#aaa' : '#666' }]}>
          All exercises
        </Text>

        {/* List */}
        {loading ? (
          <ActivityIndicator color="#3366FF" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => {
              const isSelected = selected.find((e) => e.id === item.id)
              return (
                <View style={[styles.exerciseRow, { borderBottomColor: theme === 'dark' ? '#333' : '#eee' }]}>
                  {/* Avatar placeholder */}
                  <View style={[styles.avatar, { backgroundColor: colors.input }]}>
                    <Ionicons name="body-outline" size={24} color={theme === 'dark' ? '#aaa' : '#666'} />
                  </View>

                  {/* Info */}
                  <View style={styles.exerciseInfo}>
                    <Text style={[styles.exerciseName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.exerciseMuscle, { color: theme === 'dark' ? '#aaa' : '#666' }]}>
                      {item.muscleGroups?.[0]?.replace(/_/g, ' ')}
                    </Text>
                  </View>

                  {/* Add button */}
                  <TouchableOpacity onPress={() => toggleExercise(item)}>
                    <Ionicons
                      name={isSelected ? 'checkmark-circle' : 'add-circle-outline'}
                      size={28}
                      color={isSelected ? '#3366FF' : theme === 'dark' ? '#aaa' : '#666'}
                    />
                  </TouchableOpacity>
                </View>
              )
            }}
          />
        )}
      </View>

      {/* Bottom button */}
      {selected.length > 0 && (
        <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: theme === 'dark' ? '#333' : '#eee' }]}>
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addButtonText}>Add {selected.length} exercise{selected.length > 1 ? 's' : ''}</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  cancelText: { color: '#888', fontSize: 16, width: 60 },
  container: { flex: 1, paddingHorizontal: 16 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 12,
    height: 44,
  },
  searchInput: { flex: 1, fontSize: 16 },
  filtersRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: { fontSize: 13, fontWeight: '600' },
  subtitle: { fontSize: 13, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: 15, fontWeight: '600' },
  exerciseMuscle: { fontSize: 12, marginTop: 2 },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    paddingBottom: 32,
  },
  addButton: {
    backgroundColor: '#3366FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
})