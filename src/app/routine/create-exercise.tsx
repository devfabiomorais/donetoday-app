import GlassModal from '@/components/ui/GlassModal'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { darkTheme, lightTheme } from '../../constants/colors'
import { EQUIPMENT, EXERCISE_TYPES, MUSCLES } from '../../constants/enums'
import { useTheme } from '../../context/ThemeContext'
import { createExercise } from '../../services/exercises'

const Glass = Platform.OS === 'ios' ? BlurView : View
const METRICS = [
  'REPS',
  'WEIGHT_REPS',
  'TIME',
  'WEIGHT_TIME',
  'WEIGHT_REPS_TIME'
] as const

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/(^|\s)\S/g, (l) => l.toUpperCase())
}

/* ======================= MODAL ======================= */
function MultiSelectModal({
  title,
  options,
  selected,
  onChange,
  visible,
  onClose,
  colors,
}: any) {
  const insets = useSafeAreaInsets()

  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v: string) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={{ paddingBottom: insets.bottom }}>
          <GlassModal style={styles.modalBox}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {title}
            </Text>

            <ScrollView style={{ maxHeight: 350 }}>
              {options.map((item: string) => {
                const isSelected = selected.includes(item)

                return (
                  <TouchableOpacity
                    key={item}
                    style={styles.modalItem}
                    onPress={() => toggle(item)}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        {
                          color: isSelected ? '#3366FF' : colors.text,
                          fontWeight: isSelected ? '700' : '400',
                        },
                      ]}
                    >
                      {formatLabel(item)}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
          </GlassModal>
        </View>
      </View>
    </Modal>
  )
}

/* ======================= MAIN ======================= */
export default function CreateExercise() {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkTheme : lightTheme
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [name, setName] = useState('')
  const [equipment, setEquipment] = useState<string[]>([])
  const [muscles, setMuscles] = useState<string[]>([])
  const [types, setTypes] = useState<string[]>([])
  const [metric, setMetric] = useState<typeof METRICS[number]>('REPS')

  const [image, setImage] = useState<string | null>(null)

  const [equipmentModal, setEquipmentModal] = useState(false)
  const [muscleModal, setMuscleModal] = useState(false)
  const [typeModal, setTypeModal] = useState(false)

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permission.granted) {
      Alert.alert('Permissão necessária')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Error', 'Enter exercise name')
      return
    }

    if (muscles.length === 0) {
      Alert.alert('Error', 'Select at least one muscle')
      return
    }

    if (types.length === 0) {
      Alert.alert('Error', 'Select at least one type')
      return
    }

    try {
      await createExercise({
        name,
        muscleGroups: muscles,
        equipment,
        exerciseTypes: types,
        metricType: metric,
        imageUrl: image ?? undefined,
        videoUrl: undefined,
      })

      router.replace('/routine/add-exercise')
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Error')
    }
  }

  return (
    <>
      <MultiSelectModal
        title="Equipment"
        options={EQUIPMENT}
        selected={equipment}
        onChange={setEquipment}
        visible={equipmentModal}
        onClose={() => setEquipmentModal(false)}
        colors={colors}
      />

      <MultiSelectModal
        title="Muscle Group"
        options={MUSCLES}
        selected={muscles}
        onChange={setMuscles}
        visible={muscleModal}
        onClose={() => setMuscleModal(false)}
        colors={colors}
      />

      <MultiSelectModal
        title="Exercise Type"
        options={EXERCISE_TYPES}
        selected={types}
        onChange={setTypes}
        visible={typeModal}
        onClose={() => setTypeModal(false)}
        colors={colors}
      />

      {/* HEADER */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 12,
            backgroundColor: colors.background,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#888' }}>Cancel</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Create Exercise
        </Text>

        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
      >
        {/* IMAGE */}
        <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{ width: 120, height: 120, borderRadius: 60 }}
            />
          ) : (
            <>
              <Ionicons name="camera-outline" size={26} color="#888" />
              <Text style={{ color: '#888', marginTop: 6 }}>
                Add image
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* NAME */}
        <TextInput
          placeholder="Exercise Name"
          placeholderTextColor="#555"
          value={name}
          onChangeText={setName}
          style={[styles.input, { color: colors.text }]}
        />

        {/* EQUIPMENT */}
        <TouchableOpacity onPress={() => setEquipmentModal(true)}>
          <Text style={styles.selectLabel}>Equipment</Text>
          <Text style={styles.selectValue}>
            {equipment.length > 0
              ? `${equipment.length} selected`
              : 'Select'}
          </Text>
        </TouchableOpacity>

        {/* MUSCLE */}
        <TouchableOpacity onPress={() => setMuscleModal(true)}>
          <Text style={styles.selectLabel}>Muscle Group</Text>
          <Text style={styles.selectValue}>
            {muscles.length > 0
              ? `${muscles.length} selected`
              : 'Select'}
          </Text>
        </TouchableOpacity>

        {/* TYPE */}
        <TouchableOpacity onPress={() => setTypeModal(true)}>
          <Text style={styles.selectLabel}>Exercise Type</Text>
          <Text style={styles.selectValue}>
            {types.length > 0
              ? `${types.length} selected`
              : 'Select'}
          </Text>
        </TouchableOpacity>

        {/* METRIC */}
        <Text style={[styles.selectLabel, { marginTop: 20 }]}>
          Metric
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: 'row', gap: 10 }}
        >
          {METRICS.map((item) => {
            const label = item.replace(/_/g, ' + ')

            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.metricBtn,
                  metric === item && { backgroundColor: '#3366FF' },
                ]}
                onPress={() => setMetric(item)}
              >
                <Text style={{ color: '#fff' }}>{label}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </ScrollView>
    </>
  )
}

/* ======================= STYLES ======================= */
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  saveText: {
    color: '#3366FF',
    fontWeight: '700',
  },
  imageBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#333',
    paddingVertical: 8,
    marginBottom: 20,
  },
  selectLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 16,
  },
  selectValue: {
    fontSize: 16,
    color: '#3366FF',
    marginTop: 4,
  },
  metricBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 10,
  },
  modalItemText: {
    fontSize: 15,
  },
})