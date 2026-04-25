import { Input } from '@/components/ui/input'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { darkTheme, lightTheme } from '../../constants/colors'
import { useTheme } from '../../context/ThemeContext'
import { createRoutine } from '../../services/routines'
import { routineStore } from '../../store/routineStore'

const SET_TYPES = [
  { code: 'W', label: 'Warm Up', color: '#F5A623' },
  { code: 'N', label: 'Normal', color: '#FFFFFF' },
  { code: 'F', label: 'Failure', color: '#FF3B30' },
  { code: 'D', label: 'Dropset', color: '#007AFF' },
  { code: '0', label: 'Point Zero', color: '#FF9500' },
  { code: 'FD', label: 'Feeder', color: '#34C759' },
  { code: 'C', label: 'Cluster Set', color: '#AF52DE' },
]

const REST_OPTIONS = [
  { label: 'Disabled', value: 0 },
  ...Array.from({ length: 120 }, (_, i) => {
    const seconds = (i + 1) * 5
    const label =
      seconds < 60
        ? `${seconds}s`
        : seconds % 60 === 0
          ? `${seconds / 60}min`
          : `${Math.floor(seconds / 60)}min ${seconds % 60}s`
    return { label, value: seconds }
  }),
]

type Serie = {
  serieId: string
  type: string
  kg: string
  reps: string
}

type RoutineExercise = {
  instanceId: string
  id: string
  name: string
  muscleGroups: string[]
  metricType: string
  notes: string
  restSeconds: number
  series: Serie[]
}

function RestSelector({ value, onChange, theme, colors }: {
  value: number
  onChange: (v: number) => void
  theme: string
  colors: any
}) {
  const [visible, setVisible] = useState(false)
  const insets = useSafeAreaInsets()  // ← adicione aqui
  const selected = REST_OPTIONS.find((o) => o.value === value) ?? REST_OPTIONS[0]

  return (
    <>
      <TouchableOpacity
        style={[styles.restButton, { backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f0f0f0' }]}
        onPress={() => setVisible(true)}
      >
        <Ionicons name="timer-outline" size={16} color={theme === 'dark' ? '#aaa' : '#666'} />
        <Text style={[styles.restButtonText, { color: theme === 'dark' ? '#aaa' : '#666' }]}>
          Rest: {selected.label}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <View style={[styles.modalOverlay]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setVisible(false)} />
          <View style={{ backgroundColor: colors.background, paddingBottom: insets.bottom }}>
            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Rest Time</Text>
              <ScrollView style={{ maxHeight: 300 }}>
                {REST_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[styles.modalOption, option.value === value && styles.modalOptionSelected]}
                    onPress={() => { onChange(option.value); setVisible(false) }}
                  >
                    <Text style={[styles.modalOptionText, { color: colors.text }, option.value === value && { color: '#3366FF', fontWeight: '700' }]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

function SerieRow({ serie, isFirst, onUpdateType, onUpdateReps, onRemove, onUpdateKg, theme, colors }: {
  serie: Serie
  index: number
  isFirst: boolean
  exerciseId: string
  onUpdateType: (v: string) => void
  onUpdateReps: (v: string) => void
  onUpdateKg: (v: string) => void
  onRemove: () => void
  theme: string
  colors: any
}) {
  const [visible, setVisible] = useState(false)
  const insets = useSafeAreaInsets()  // ← adicione aqui
  const currentType = SET_TYPES.find((t) => t.code === serie.type) ?? SET_TYPES[1]

  return (
    <>
      <View style={styles.serieRow}>
        <TouchableOpacity
          style={[styles.typeButton, { backgroundColor: currentType.color + '33', borderColor: currentType.color }]}
          onPress={() => setVisible(true)}
        >
          <Text style={[styles.typeButtonText, { color: currentType.color }]}>{currentType.code}</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="0"
          placeholderTextColor={theme === 'dark' ? '#555' : '#aaa'}
          keyboardType="numeric"
          value={serie.kg}
          onChangeText={onUpdateKg}
          style={[styles.repsInput, { color: colors.text, backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f0f0f0' }]}
        />

        <TextInput
          placeholder="0"
          placeholderTextColor={theme === 'dark' ? '#555' : '#aaa'}
          keyboardType="numeric"
          value={serie.reps}
          onChangeText={onUpdateReps}
          style={[styles.repsInput, { color: colors.text, backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f0f0f0' }]}
        />

        {!isFirst && (
          <TouchableOpacity onPress={onRemove}>
            <Ionicons name="trash-outline" size={18} color="#FF3B30" />
          </TouchableOpacity>
        )}

        {isFirst && <View style={{ width: 18 }} />}
      </View>

      <Modal visible={visible} transparent animationType="slide">
        <View style={[styles.modalOverlay]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setVisible(false)} />
          <View style={{ backgroundColor: colors.background, paddingBottom: insets.bottom }}>
            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Set Type</Text>
              {SET_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.code}
                  style={styles.modalOption}
                  onPress={() => { onUpdateType(type.code); setVisible(false) }}
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
    </>
  )
}

export default function CreateRoutine() {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkTheme : lightTheme
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [title, setTitle] = useState('')
  const [exercises, setExercises] = useState<RoutineExercise[]>([])
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  const lastSelectedCount = useRef(0)

  function newSerie(): Serie {
    return { serieId: Math.random().toString(36).slice(2), type: 'N', kg: '', reps: '' }
  }

  useFocusEffect(
    useCallback(() => {
      const newExercises = routineStore.selectedExercises
      if (newExercises.length > lastSelectedCount.current) {
        const added = newExercises.slice(lastSelectedCount.current)
        setExercises((prev) => [
          ...prev,
          ...added.map((ex) => ({
            ...ex,
            instanceId: Math.random().toString(36).slice(2),
            notes: '',
            restSeconds: 60,
            series: [newSerie()],
          })),
        ])
        lastSelectedCount.current = newExercises.length
      }
    }, [])
  )

  function updateNote(instanceId: string, note: string) {
    setExercises((prev) =>
      prev.map((ex) => (ex.instanceId === instanceId ? { ...ex, notes: note } : ex))
    )
  }

  function updateRest(instanceId: string, restSeconds: number) {
    setExercises((prev) =>
      prev.map((ex) => (ex.instanceId === instanceId ? { ...ex, restSeconds } : ex))
    )
  }

  function updateSerie(instanceId: string, serieId: string, field: keyof Omit<Serie, 'serieId'>, value: string) {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.instanceId === instanceId
          ? { ...ex, series: ex.series.map((s) => s.serieId === serieId ? { ...s, [field]: value } : s) }
          : ex
      )
    )
  }

  function addSerie(instanceId: string) {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.instanceId !== instanceId) return ex
        const last = ex.series[ex.series.length - 1]
        return {
          ...ex,
          series: [...ex.series, { ...last, serieId: Math.random().toString(36).slice(2) }],
        }
      })
    )
  }

  function removeSerie(instanceId: string, serieId: string) {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.instanceId === instanceId
          ? { ...ex, series: ex.series.filter((s) => s.serieId !== serieId) }
          : ex
      )
    )
  }

  function removeExercise(instanceId: string) {
    setExercises((prev) => prev.filter((ex) => ex.instanceId !== instanceId))
  }

  function handleCancel() {
    setCancelModalVisible(true)
  }

  function confirmCancel() {
    setCancelModalVisible(false)
    routineStore.setSelectedExercises([])
    lastSelectedCount.current = 0
    router.back()
  }

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a routine title.')
      return
    }
    if (exercises.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise.')
      return
    }

    try {
      await createRoutine({
        name: title,
        isPublic: false,
        exercises: exercises.map((ex, index) => ({
          exerciseId: ex.id,
          order: index + 1,
          sets: ex.series.length,
          restSeconds: ex.restSeconds,
        })),
      })

      routineStore.setSelectedExercises([])
      lastSelectedCount.current = 0
      router.replace('/(tabs)/workout' as any)
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'An error occurred. Please try again.'
      Alert.alert('Error', message)
    }
  }

  return (
    <>
      {/* Cancel confirmation modal */}
      <Modal visible={cancelModalVisible} transparent animationType="fade">
        <View style={styles.cancelModalOverlay}>
          <View style={[styles.cancelModalContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.cancelModalTitle, { color: colors.text }]}>Discard Routine?</Text>
            <Text style={[styles.cancelModalText, { color: theme === 'dark' ? '#aaa' : '#666' }]}>
              Are you sure you want to cancel? Your changes will be lost.
            </Text>
            <View style={styles.cancelModalButtons}>
              <TouchableOpacity
                style={[styles.cancelModalButton, { backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f0f0f0' }]}
                onPress={() => setCancelModalVisible(false)}
              >
                <Text style={[styles.cancelModalButtonText, { color: colors.text }]}>Keep Editing</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelModalButton, { backgroundColor: '#FF3B30' }]}
                onPress={confirmCancel}
              >
                <Text style={[styles.cancelModalButtonText, { color: '#fff' }]}>Discard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: theme === 'dark' ? '#333' : '#eee', paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>New Routine</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        enableOnAndroid
        extraScrollHeight={120}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Input placeholder="Routine Title" value={title} onChangeText={setTitle} />
        </View>

        {exercises.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="barbell-outline" size={48} color={theme === 'dark' ? '#555' : '#ccc'} />
            <Text style={[styles.emptyText, { color: theme === 'dark' ? '#555' : '#ccc' }]}>
              To begin, add an exercise to your routine.
            </Text>
          </View>
        )}

        {exercises.length > 0 && (
          <View style={styles.section}>
            {exercises.map((exercise) => (
              <View key={exercise.instanceId} style={[styles.exerciseCard, { backgroundColor: colors.input }]}>

                <View style={styles.exerciseHeader}>
                  <View style={[styles.exerciseAvatar, { backgroundColor: theme === 'dark' ? '#333' : '#eee' }]}>
                    <Ionicons name="body-outline" size={24} color={theme === 'dark' ? '#aaa' : '#666'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.exerciseName, { color: colors.text }]}>{exercise.name}</Text>
                    <Text style={[styles.exerciseMuscle, { color: theme === 'dark' ? '#aaa' : '#666' }]}>
                      {exercise.muscleGroups?.[0]?.replace(/_/g, ' ')}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => removeExercise(exercise.instanceId)}>
                    <Ionicons name="close-circle-outline" size={22} color={theme === 'dark' ? '#555' : '#aaa'} />
                  </TouchableOpacity>
                </View>

                <TextInput
                  placeholder="Notes (optional)"
                  placeholderTextColor={theme === 'dark' ? '#555' : '#aaa'}
                  value={exercise.notes}
                  onChangeText={(v) => updateNote(exercise.instanceId, v)}
                  style={[styles.notesInput, { color: colors.text, backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f0f0f0' }]}
                />

                <RestSelector
                  value={exercise.restSeconds}
                  onChange={(v) => updateRest(exercise.instanceId, v)}
                  theme={theme}
                  colors={colors}
                />

                <View style={styles.seriesHeader}>
                  <Text style={[styles.seriesHeaderText, { color: theme === 'dark' ? '#aaa' : '#666' }]}>SÉRIE</Text>
                  <Text style={[styles.seriesHeaderText, { color: theme === 'dark' ? '#aaa' : '#666', marginLeft: 80 }]}>KG</Text>
                  <Text style={[styles.seriesHeaderText, { color: theme === 'dark' ? '#aaa' : '#666', marginLeft: 80 }]}>REPS</Text>
                </View>

                {exercise.series.map((serie, index) => (
                  <SerieRow
                    key={serie.serieId}
                    serie={serie}
                    index={index}
                    isFirst={index === 0}
                    exerciseId={exercise.instanceId}
                    onUpdateType={(v) => updateSerie(exercise.instanceId, serie.serieId, 'type', v)}
                    onUpdateReps={(v) => updateSerie(exercise.instanceId, serie.serieId, 'reps', v)}
                    onUpdateKg={(v) => updateSerie(exercise.instanceId, serie.serieId, 'kg', v)}
                    onRemove={() => removeSerie(exercise.instanceId, serie.serieId)}
                    theme={theme}
                    colors={colors}
                  />
                ))}

                <TouchableOpacity style={styles.addSerieButton} onPress={() => addSerie(exercise.instanceId)}>
                  <Text style={styles.addSerieText}>+ Add Set</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/routine/add-exercise')}
        >
          <Text style={styles.addButtonText}>+ Add Exercise</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  cancelText: { color: '#888', fontSize: 16 },
  saveText: { color: '#3366FF', fontSize: 16, fontWeight: '700' },
  container: { flex: 1, padding: 16 },
  section: { marginBottom: 24 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 16 },
  emptyText: { fontSize: 14, textAlign: 'center', maxWidth: 240 },
  addButton: { alignSelf: 'center', backgroundColor: '#3366FF', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12, marginBottom: 24 },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  exerciseCard: { padding: 16, borderRadius: 12, marginBottom: 12 },
  exerciseName: { fontSize: 16, fontWeight: '600' },
  exerciseMuscle: { fontSize: 12, marginTop: 2, marginBottom: 10 },
  exerciseHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  exerciseAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  notesInput: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, marginBottom: 10 },
  restButton: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 12, alignSelf: 'flex-start' },
  restButtonText: { fontSize: 13 },
  seriesHeader: { flexDirection: 'row', marginBottom: 6 },
  seriesHeaderText: { fontSize: 11, fontWeight: '700' },
  serieRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  typeButton: { width: 40, height: 36, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  typeButtonText: { fontSize: 12, fontWeight: '700' },
  repsInput: { flex: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, textAlign: 'center' },
  addSerieButton: { marginTop: 4, alignSelf: 'flex-start' },
  addSerieText: { color: '#3366FF', fontSize: 14, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 60  // era 40, aumenta para cobrir a área dos botões
  },
  modalTitle: { fontSize: 17, fontWeight: '700', marginBottom: 16 },
  modalOption: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  modalOptionSelected: { opacity: 1 },
  modalOptionText: { fontSize: 15 },
  typeTag: { width: 36, height: 32, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  typeTagText: { fontSize: 11, fontWeight: '700' },
  cancelModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  cancelModalContent: { width: '85%', borderRadius: 16, padding: 24 },
  cancelModalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  cancelModalText: { fontSize: 14, marginBottom: 24, lineHeight: 20 },
  cancelModalButtons: { flexDirection: 'row', gap: 12 },
  cancelModalButton: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  cancelModalButtonText: { fontSize: 15, fontWeight: '600' },
})