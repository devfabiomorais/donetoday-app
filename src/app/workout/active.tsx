import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { darkTheme, lightTheme } from '../../constants/colors'
import { useTheme } from '../../context/ThemeContext'
import { getLastSets, saveWorkout } from '../../services/workouts'

const SET_TYPES = [
  { code: 'W', label: 'Warm Up', color: '#F5A623' },
  { code: 'N', label: 'Normal', color: '#888888' },
  { code: 'F', label: 'Failure', color: '#FF3B30' },
  { code: 'D', label: 'Dropset', color: '#007AFF' },
  { code: '0', label: 'Point Zero', color: '#FF9500' },
  { code: 'FD', label: 'Feeder', color: '#34C759' },
  { code: 'C', label: 'Cluster Set', color: '#AF52DE' },
]

type ActiveSet = {
  setId: string
  type: string
  kg: string
  reps: string
  completed: boolean
  previousKg?: string
  previousReps?: string
}

type ActiveExercise = {
  instanceId: string
  exerciseId: string
  name: string
  muscleGroups: string[]
  metricType: string
  restSeconds: number
  sets: ActiveSet[]
}

function RestTimer({ seconds, onDone }: { seconds: number; onDone: () => void }) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    if (remaining <= 0) { onDone(); return }
    const timer = setTimeout(() => setRemaining((p) => p - 1), 1000)
    return () => clearTimeout(timer)
  }, [remaining])

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>
        {mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`}
      </Text>
      <TouchableOpacity onPress={onDone} style={styles.timerSkip}>
        <Text style={styles.timerSkipText}>Skip</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function ActiveWorkout() {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkTheme : lightTheme
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams<{
    workoutId: string
    routineId: string
    routineName: string
    exercises: string
  }>()

  const [exercises, setExercises] = useState<ActiveExercise[]>([])
  const [timer, setTimer] = useState<{ exerciseId: string; seconds: number } | null>(null)
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  const [saving, setSaving] = useState(false)
  const [setTypeModal, setSetTypeModal] = useState<{ exerciseId: string; setId: string } | null>(null)
  const elapsedRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => { elapsedRef.current += 1 }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!params.exercises) return
    const rawExercises = JSON.parse(params.exercises)
    initExercises(rawExercises)
  }, [])

  async function initExercises(raw: any[]) {
    const initialized: ActiveExercise[] = await Promise.all(
      raw.map(async (item) => {
        const exercise = item.exercise ?? item
        const history = await getLastSets(exercise.id, params.routineId).catch(() => [])
        const sets = Array.from({ length: item.sets ?? 3 }, (_, i) => {
          const prev = history[i]
          return {
            setId: Math.random().toString(36).slice(2),
            type: 'N',
            kg: '',
            reps: '',
            completed: false,
            previousKg: prev?.weight?.toString() ?? '',
            previousReps: prev?.reps?.toString() ?? '',
          }
        })
        return {
          instanceId: Math.random().toString(36).slice(2),
          exerciseId: exercise.id,
          name: exercise.name,
          muscleGroups: exercise.muscleGroups ?? [],
          metricType: exercise.metricType ?? 'WEIGHT_REPS',
          restSeconds: item.restSeconds ?? 60,
          sets,
        }
      })
    )
    setExercises(initialized)
  }

  function updateSet(instanceId: string, setId: string, field: keyof ActiveSet, value: any) {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.instanceId === instanceId
          ? { ...ex, sets: ex.sets.map((s) => s.setId === setId ? { ...s, [field]: value } : s) }
          : ex
      )
    )
  }

  function toggleComplete(instanceId: string, setId: string, restSeconds: number) {
    const exercise = exercises.find((e) => e.instanceId === instanceId)
    const set = exercise?.sets.find((s) => s.setId === setId)
    if (!set) return

    const nowCompleted = !set.completed
    updateSet(instanceId, setId, 'completed', nowCompleted)

    if (nowCompleted && restSeconds > 0) {
      setTimer({ exerciseId: instanceId, seconds: restSeconds })
    }
  }

  function addSet(instanceId: string) {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.instanceId !== instanceId) return ex
        const last = ex.sets[ex.sets.length - 1]
        return {
          ...ex,
          sets: [...ex.sets, {
            setId: Math.random().toString(36).slice(2),
            type: last.type,
            kg: '',
            reps: '',
            completed: false,
            previousKg: last.kg,
            previousReps: last.reps,
          }],
        }
      })
    )
  }

  function removeSet(instanceId: string, setId: string) {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.instanceId === instanceId
          ? { ...ex, sets: ex.sets.filter((s) => s.setId !== setId) }
          : ex
      )
    )
  }

  async function handleSave() {
    setSaving(true)
    try {
      const allSets = exercises.flatMap((ex) =>
        ex.sets.map((s, i) => ({
          exerciseId: ex.exerciseId,
          setNumber: i + 1,
          weight: s.kg ? parseFloat(s.kg) : undefined,
          reps: s.reps ? parseInt(s.reps) : undefined,
          setType: s.type,
          completed: s.completed,
        }))
      )

      await saveWorkout(params.workoutId, { sets: allSets })
      router.replace('/(tabs)/workout' as any)
    } catch (error: any) {
      Alert.alert('Error', 'Failed to save workout. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {/* Cancel modal */}
      <Modal visible={cancelModalVisible} transparent animationType="fade">
        <View style={styles.cancelModalOverlay}>
          <View style={[styles.cancelModalContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.cancelModalTitle, { color: colors.text }]}>Discard Workout?</Text>
            <Text style={[styles.cancelModalText, { color: theme === 'dark' ? '#aaa' : '#666' }]}>
              Are you sure? Your workout progress will be lost.
            </Text>
            <View style={styles.cancelModalButtons}>
              <TouchableOpacity
                style={[styles.cancelModalButton, { backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f0f0f0' }]}
                onPress={() => setCancelModalVisible(false)}
              >
                <Text style={[styles.cancelModalButtonText, { color: colors.text }]}>Keep Going</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelModalButton, { backgroundColor: '#FF3B30' }]}
                onPress={() => router.replace('/(tabs)/workout' as any)}
              >
                <Text style={[styles.cancelModalButtonText, { color: '#fff' }]}>Discard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Set type modal */}
      <Modal visible={!!setTypeModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setSetTypeModal(null)} />
          <View style={{ backgroundColor: colors.background, paddingBottom: insets.bottom }}>
            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Set Type</Text>
              {SET_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.code}
                  style={styles.modalOption}
                  onPress={() => {
                    if (setTypeModal) {
                      updateSet(setTypeModal.exerciseId, setTypeModal.setId, 'type', type.code)
                      setSetTypeModal(null)
                    }
                  }}
                >
                  <View style={[styles.typeTag, { backgroundColor: type.color + '33', borderColor: type.color }]}>
                    <Text style={[styles.typeTagText, { color: type.color }]}>{type.code}</Text>
                  </View>
                  <Text style={[styles.modalOptionText, { color: colors.text }]}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Rest timer */}
      {timer && (
        <View style={styles.timerOverlay}>
          <RestTimer
            seconds={timer.seconds}
            onDone={() => setTimer(null)}
          />
        </View>
      )}

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: theme === 'dark' ? '#333' : '#eee', paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => setCancelModalVisible(true)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{params.routineName}</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        {exercises.map((exercise) => (
          <View key={exercise.instanceId} style={[styles.exerciseCard, { backgroundColor: colors.input }]}>

            {/* Exercise header */}
            <View style={styles.exerciseHeader}>
              <View style={[styles.exerciseAvatar, { backgroundColor: theme === 'dark' ? '#333' : '#eee' }]}>
                <Ionicons name="body-outline" size={24} color={theme === 'dark' ? '#aaa' : '#666'} />
              </View>
              <View>
                <Text style={[styles.exerciseName, { color: colors.text }]}>{exercise.name}</Text>
                <Text style={[styles.exerciseMuscle, { color: theme === 'dark' ? '#aaa' : '#666' }]}>
                  {exercise.muscleGroups?.[0]?.replace(/_/g, ' ')}
                </Text>
              </View>
            </View>

            {/* Sets header */}
            <View style={styles.setsHeader}>
              <Text style={[styles.setsHeaderText, { color: theme === 'dark' ? '#aaa' : '#666', width: 40 }]}>SET</Text>
              <Text style={[styles.setsHeaderText, { color: theme === 'dark' ? '#aaa' : '#666', flex: 1, textAlign: 'center' }]}>PREVIOUS</Text>
              <Text style={[styles.setsHeaderText, { color: theme === 'dark' ? '#aaa' : '#666', flex: 1, textAlign: 'center' }]}>KG</Text>
              <Text style={[styles.setsHeaderText, { color: theme === 'dark' ? '#aaa' : '#666', flex: 1, textAlign: 'center' }]}>REPS</Text>
              <View style={{ width: 32 }} />
            </View>

            {/* Sets */}
            {exercise.sets.map((set, index) => {
              const currentType = SET_TYPES.find((t) => t.code === set.type) ?? SET_TYPES[1]
              return (
                <View key={set.setId} style={[styles.setRow, set.completed && { opacity: 0.5 }]}>
                  {/* Type button */}
                  <TouchableOpacity
                    style={[styles.typeButton, { backgroundColor: currentType.color + '33', borderColor: currentType.color }]}
                    onPress={() => setSetTypeModal({ exerciseId: exercise.instanceId, setId: set.setId })}
                  >
                    <Text style={[styles.typeButtonText, { color: currentType.color }]}>{currentType.code}</Text>
                  </TouchableOpacity>

                  {/* Previous */}
                  <Text style={[styles.previousText, { color: theme === 'dark' ? '#555' : '#bbb' }]}>
                    {set.previousKg && set.previousReps
                      ? `${set.previousKg}kg x${set.previousReps}`
                      : set.previousReps
                        ? `x${set.previousReps}`
                        : '-'}
                  </Text>

                  {/* KG input */}
                  <TextInput
                    placeholder={set.previousKg || '0'}
                    placeholderTextColor={theme === 'dark' ? '#555' : '#bbb'}
                    keyboardType="numeric"
                    value={set.kg}
                    onChangeText={(v) => updateSet(exercise.instanceId, set.setId, 'kg', v)}
                    style={[styles.setInput, { color: colors.text, backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f0f0f0' }]}
                    editable={!set.completed}
                  />

                  {/* Reps input */}
                  <TextInput
                    placeholder={set.previousReps || '0'}
                    placeholderTextColor={theme === 'dark' ? '#555' : '#bbb'}
                    keyboardType="numeric"
                    value={set.reps}
                    onChangeText={(v) => updateSet(exercise.instanceId, set.setId, 'reps', v)}
                    style={[styles.setInput, { color: colors.text, backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f0f0f0' }]}
                    editable={!set.completed}
                  />

                  {/* Complete checkbox */}
                  <TouchableOpacity
                    style={[styles.checkbox, set.completed && { backgroundColor: '#34C759' }]}
                    onPress={() => toggleComplete(exercise.instanceId, set.setId, exercise.restSeconds)}
                  >
                    {set.completed && <Ionicons name="checkmark" size={16} color="#fff" />}
                  </TouchableOpacity>
                </View>
              )
            })}

            {/* Add set */}
            <TouchableOpacity style={styles.addSetButton} onPress={() => addSet(exercise.instanceId)}>
              <Text style={styles.addSetText}>+ Add Set</Text>
            </TouchableOpacity>

          </View>
        ))}
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  cancelText: { color: '#888', fontSize: 16 },
  saveText: { color: '#3366FF', fontSize: 16, fontWeight: '700' },
  container: { flex: 1, padding: 16 },
  exerciseCard: { padding: 16, borderRadius: 12, marginBottom: 12 },
  exerciseHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  exerciseAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  exerciseName: { fontSize: 16, fontWeight: '600' },
  exerciseMuscle: { fontSize: 12, marginTop: 2 },
  setsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  setsHeaderText: { fontSize: 11, fontWeight: '700' },
  setRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  typeButton: { width: 40, height: 36, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  typeButtonText: { fontSize: 11, fontWeight: '700' },
  previousText: { flex: 1, fontSize: 12, textAlign: 'center' },
  setInput: { flex: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 8, fontSize: 14, textAlign: 'center' },
  checkbox: { width: 32, height: 32, borderRadius: 8, borderWidth: 1, borderColor: '#555', alignItems: 'center', justifyContent: 'center' },
  addSetButton: { marginTop: 8, alignSelf: 'flex-start' },
  addSetText: { color: '#3366FF', fontSize: 14, fontWeight: '600' },
  timerOverlay: { position: 'absolute', bottom: 100, left: 0, right: 0, zIndex: 999, alignItems: 'center' },
  timerContainer: { backgroundColor: '#1a1a2e', borderRadius: 16, paddingHorizontal: 32, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', gap: 20 },
  timerText: { color: '#fff', fontSize: 32, fontWeight: '700' },
  timerSkip: { backgroundColor: '#333', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  timerSkipText: { color: '#fff', fontSize: 14 },
  cancelModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  cancelModalContent: { width: '85%', borderRadius: 16, padding: 24 },
  cancelModalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  cancelModalText: { fontSize: 14, marginBottom: 24, lineHeight: 20 },
  cancelModalButtons: { flexDirection: 'row', gap: 12 },
  cancelModalButton: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  cancelModalButtonText: { fontSize: 15, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  modalTitle: { fontSize: 17, fontWeight: '700', marginBottom: 16 },
  modalOption: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  modalOptionText: { fontSize: 15 },
  typeTag: { width: 36, height: 32, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  typeTagText: { fontSize: 11, fontWeight: '700' },
})