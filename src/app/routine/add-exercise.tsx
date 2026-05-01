import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
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
  const [selected, setSelected] = useState<any[]>(routineStore.selectedExercises || [])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null)
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null)
  const [muscleGroupModalVisible, setMuscleGroupModalVisible] = useState(false)
  const [equipmentModalVisible, setEquipmentModalVisible] = useState(false)

  const MUSCLE_GROUPS = ['UPPER_BACK', 'LOWER_BACK', 'LATISSIMUS', 'SIDE_SHOULDERS', 'FRONT_SHOULDERS', 'REAR_SHOULDERS', 'ROTATOR_CUFF', 'SHOULDERS', 'CHEST', 'UPPER_CHEST', 'LOWER_CHEST', 'TRICEPS', 'BICEPS', 'FOREARMS', 'HAND_MUSCLES', 'GRIP_MUSCLES', 'TRAPEZIUS', 'NECK', 'JAW', 'ABDOMINALS', 'OBLIQUES', 'SERRATUS', 'DEEP_CORE', 'GLUTES', 'HAMSTRINGS', 'QUADRICEPS', 'ABDUCTORS', 'ADDUCTORS', 'HIP_FLEXORS', 'HIPS', 'CALVES', 'TIBIALIS_ANTERIOR', 'FEET']

  const EQUIPMENT_LIST = ['TRX', 'GYMNASTIC_RINGS', 'PARALLETTES', 'RESISTANCE_BANDS', 'RESISTANCE_TUBES', 'JUMP_ROPE', 'TIRE', 'AB_WHEEL', 'WEIGHTED_VEST', 'DUMBBELL', 'KETTLEBELL', 'BARBELL', 'WEIGHT_PLATES', 'MEDICINE_BALL', 'BALL', 'SLAM_BALL', 'BULGARIAN_BAG', 'SANDBAG', 'BATTLE_ROPE', 'GRIP_STRENGTHENERS', 'ANKLE_WRIST_WEIGHTS', 'PORTABLE_STEP_PLATFORM', 'AGILITY_LADDER', 'CONES', 'PUNCHING_BAG', 'FREESTANDING_PUNCHING_BAG', 'SPEED_BAG', 'DOUBLE_END_BAG', 'FOCUS_MITTS', 'THAI_PADS', 'BOXING_GLOVES', 'MMA_GLOVES', 'HAND_WRAPS', 'SHIN_GUARDS', 'HEADGEAR', 'MOUTHGUARD', 'OTHER', 'NO_EQUIPMENT']

  const [myExercises, setMyExercises] = useState<any[]>([])
  const [globalExercises, setGlobalExercises] = useState<any[]>([])

  useEffect(() => {
    loadExercises()
  }, [])

  useEffect(() => {
    let result = exercises

    if (search.trim() !== '') {
      result = result.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (selectedMuscleGroup) {
      result = result.filter((e) =>
        e.muscleGroups?.includes(selectedMuscleGroup)
      )
    }

    if (selectedEquipment) {
      result = result.filter((e) =>
        e.equipment?.includes(selectedEquipment)
      )
    }

    setFiltered(result)
  }, [search, exercises, selectedMuscleGroup, selectedEquipment])

  async function loadExercises() {
    try {
      const [global, custom] = await Promise.all([
        getExercises(),
        getMyExercises(),
      ])

      // 👇 separa
      setGlobalExercises(global)
      setMyExercises(custom)

      // ainda mantém tudo junto pro filtro funcionar
      const all = [...custom, ...global]

      setExercises(all)
      setFiltered(all)

      if (routineStore.selectedExercises?.length) {
        setSelected(routineStore.selectedExercises)
      }
    } finally {
      setLoading(false)
    }
  }

  function toggleExercise(exercise: any) {
    setSelected((prev) => {
      let updated

      if (prev.find((e) => e.id === exercise.id)) {
        updated = prev.filter((e) => e.id !== exercise.id)
      } else {
        updated = [...prev, exercise]
      }

      routineStore.setSelectedExercises(updated)
      return updated
    })
  }

  function handleAdd() {
    const current = routineStore.selectedExercises || []

    const merged = [...current]

    selected.forEach((ex) => {
      if (!merged.find((e) => e.id === ex.id)) {
        merged.push(ex)
      }
    })

    routineStore.setSelectedExercises(merged)
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
        <TouchableOpacity onPress={() => router.push('/routine/create-exercise')}>
          <Text style={{ color: '#3366FF', fontSize: 16, fontWeight: '600' }}>
            Create
          </Text>
        </TouchableOpacity>
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
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: selectedMuscleGroup ? '#3366FF' : colors.input }]}
            onPress={() => setMuscleGroupModalVisible(true)}
          >
            <Ionicons name="body-outline" size={16} color={selectedMuscleGroup ? '#fff' : colors.text} />
            <Text style={[styles.filterText, { color: selectedMuscleGroup ? '#fff' : colors.text }]}>
              {selectedMuscleGroup ? selectedMuscleGroup.replace(/_/g, ' ') : 'Muscle Group'}
            </Text>
            {selectedMuscleGroup && (
              <TouchableOpacity onPress={() => setSelectedMuscleGroup(null)}>
                <Ionicons name="close-circle" size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: selectedEquipment ? '#3366FF' : colors.input }]}
            onPress={() => setEquipmentModalVisible(true)}
          >
            <Ionicons name="barbell-outline" size={16} color={selectedEquipment ? '#fff' : colors.text} />
            <Text style={[styles.filterText, { color: selectedEquipment ? '#fff' : colors.text }]}>
              {selectedEquipment ? selectedEquipment.replace(/_/g, ' ') : 'Equipment'}
            </Text>
            {selectedEquipment && (
              <TouchableOpacity onPress={() => setSelectedEquipment(null)}>
                <Ionicons name="close-circle" size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>

        {/* Subtitle */}
        {/* <Text style={[styles.subtitle, { color: theme === 'dark' ? '#aaa' : '#666' }]}>
          All exercises
        </Text> */}

        {/* List */}
        {loading ? (
          <ActivityIndicator color="#3366FF" style={{ marginTop: 40 }} />
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>

            {/* ===================== MY EXERCISES ===================== */}
            {myExercises.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Made by you
                </Text>

                {myExercises.map((item) => {
                  const isSelected = selected.find((e) => e.id === item.id)

                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.exerciseRow,
                        { borderBottomColor: theme === 'dark' ? '#333' : '#eee' },
                      ]}
                    >
                      <View style={[styles.avatar, { backgroundColor: colors.input }]}>
                        {item.imageUrl ? (
                          <Image
                            source={{ uri: item.imageUrl }}
                            style={styles.avatarImage}
                          />
                        ) : (
                          <Ionicons
                            name={item.isCustom ? 'person-outline' : 'body-outline'}
                            size={24}
                            color={theme === 'dark' ? '#aaa' : '#666'}
                          />
                        )}
                      </View>

                      <View style={styles.exerciseInfo}>
                        <Text style={[styles.exerciseName, { color: colors.text }]}>
                          {item.name}
                        </Text>
                        <Text
                          style={[
                            styles.exerciseMuscle,
                            { color: theme === 'dark' ? '#aaa' : '#666' },
                          ]}
                        >
                          {item.muscleGroups?.[0]?.replace(/_/g, ' ')}
                        </Text>
                      </View>

                      <TouchableOpacity onPress={() => toggleExercise(item)}>
                        <Ionicons
                          name={
                            isSelected
                              ? 'checkmark-circle'
                              : 'add-circle-outline'
                          }
                          size={28}
                          color={
                            isSelected
                              ? '#3366FF'
                              : theme === 'dark'
                                ? '#aaa'
                                : '#666'
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  )
                })}
              </>
            )}

            {/* ===================== GLOBAL ===================== */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              All exercises
            </Text>

            {globalExercises.map((item) => {
              const isSelected = selected.find((e) => e.id === item.id)

              return (
                <View
                  key={item.id}
                  style={[
                    styles.exerciseRow,
                    { borderBottomColor: theme === 'dark' ? '#333' : '#eee' },
                  ]}
                >
                  <View style={[styles.avatar, { backgroundColor: colors.input }]}>
                    <Ionicons
                      name="body-outline"
                      size={24}
                      color={theme === 'dark' ? '#aaa' : '#666'}
                    />
                  </View>

                  <View style={styles.exerciseInfo}>
                    <Text style={[styles.exerciseName, { color: colors.text }]}>
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.exerciseMuscle,
                        { color: theme === 'dark' ? '#aaa' : '#666' },
                      ]}
                    >
                      {item.muscleGroups?.[0]?.replace(/_/g, ' ')}
                    </Text>
                  </View>

                  <TouchableOpacity onPress={() => toggleExercise(item)}>
                    <Ionicons
                      name={
                        isSelected
                          ? 'checkmark-circle'
                          : 'add-circle-outline'
                      }
                      size={28}
                      color={
                        isSelected
                          ? '#3366FF'
                          : theme === 'dark'
                            ? '#aaa'
                            : '#666'
                      }
                    />
                  </TouchableOpacity>
                </View>
              )
            })}
          </ScrollView>
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

      {/* Muscle Group Modal */}
      <Modal visible={muscleGroupModalVisible} transparent animationType="slide">
        <View style={styles.filterModalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setMuscleGroupModalVisible(false)} />
          <View style={[styles.filterModalContent, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
            <Text style={[styles.filterModalTitle, { color: colors.text }]}>Muscle Group</Text>
            <ScrollView>
              {MUSCLE_GROUPS.map((mg) => (
                <TouchableOpacity
                  key={mg}
                  style={[styles.filterModalOption, selectedMuscleGroup === mg && { backgroundColor: '#3366FF22' }]}
                  onPress={() => {
                    setSelectedMuscleGroup(mg === selectedMuscleGroup ? null : mg)
                    setMuscleGroupModalVisible(false)
                  }}
                >
                  <Text style={[styles.filterModalOptionText, { color: selectedMuscleGroup === mg ? '#3366FF' : colors.text, fontWeight: selectedMuscleGroup === mg ? '700' : '400' }]}>
                    {mg.replace(/_/g, ' ')}
                  </Text>
                  {selectedMuscleGroup === mg && (
                    <Ionicons name="checkmark" size={18} color="#3366FF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Equipment Modal */}
      <Modal visible={equipmentModalVisible} transparent animationType="slide">
        <View style={styles.filterModalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setEquipmentModalVisible(false)} />
          <View style={[styles.filterModalContent, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
            <Text style={[styles.filterModalTitle, { color: colors.text }]}>Equipment</Text>
            <ScrollView>
              {EQUIPMENT_LIST.map((eq) => (
                <TouchableOpacity
                  key={eq}
                  style={[styles.filterModalOption, selectedEquipment === eq && { backgroundColor: '#3366FF22' }]}
                  onPress={() => {
                    setSelectedEquipment(eq === selectedEquipment ? null : eq)
                    setEquipmentModalVisible(false)
                  }}
                >
                  <Text style={[styles.filterModalOptionText, { color: selectedEquipment === eq ? '#3366FF' : colors.text, fontWeight: selectedEquipment === eq ? '700' : '400' }]}>
                    {eq.replace(/_/g, ' ')}
                  </Text>
                  {selectedEquipment === eq && (
                    <Ionicons name="checkmark" size={18} color="#3366FF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
  filterModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  filterModalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '70%' },
  filterModalTitle: { fontSize: 17, fontWeight: '700', marginBottom: 16 },
  filterModalOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 8 },
  filterModalOptionText: { fontSize: 15 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
})