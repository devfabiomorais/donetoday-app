import { Ionicons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { darkTheme, lightTheme } from '../constants/colors'
import { useTheme } from '../context/ThemeContext'
import { getWorkouts } from '../services/workouts'

const { width } = Dimensions.get('window')

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function CalendarSlide({ workoutDates, colors, theme }: { workoutDates: Set<string>; colors: any; theme: string }) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  return (
    <View style={styles.slide}>
      <Image source={require('@/assets/images/DONEicon.png')} style={styles.slideLogo} resizeMode="contain" />
      <Text style={[styles.slideTitle, { color: colors.text }]}>Your Training Month</Text>

      <View style={styles.calendarHeader}>
        {DAY_NAMES.map((d) => (
          <Text key={d} style={[styles.dayName, { color: theme === 'dark' ? '#aaa' : '#888' }]}>{d}</Text>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {cells.map((day, i) => {
          if (!day) return <View key={`empty-${i}`} style={styles.calendarCell} />
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isToday = day === today.getDate()
          const hasWorkout = workoutDates.has(dateStr)

          return (
            <View key={day} style={styles.calendarCell}>
              <View style={[
                styles.calendarDay,
                isToday && { backgroundColor: '#3366FF' },
                hasWorkout && !isToday && { backgroundColor: '#3366FF33' },
              ]}>
                <Text style={[
                  styles.calendarDayText,
                  { color: isToday ? '#fff' : colors.text },
                  hasWorkout && !isToday && { color: '#3366FF', fontWeight: '700' },
                ]}>
                  {day}
                </Text>
                {hasWorkout && (
                  <View style={[styles.workoutDot, { backgroundColor: isToday ? '#fff' : '#3366FF' }]} />
                )}
              </View>
            </View>
          )
        })}
      </View>

      <Text style={[styles.slideSubtitle, { color: theme === 'dark' ? '#aaa' : '#888' }]}>
        {workoutDates.size} workout{workoutDates.size !== 1 ? 's' : ''} this month 💪
      </Text>
    </View>
  )
}

function VolumeSlide({ volume, colors, theme }: { volume: number; colors: any; theme: string }) {
  const comparisons = [
    { weight: 8000, label: 'an African elephant' },
    { weight: 7000, label: 'a T-Rex' },
    { weight: 1000, label: 'a polar bear' },
    { weight: 500, label: 'a grand piano' },
    { weight: 200, label: 'a giant panda' },
    { weight: 80, label: 'an average person' },
    { weight: 10, label: 'a large dog' },
  ]

  const comparison = comparisons.find((c) => volume >= c.weight) ?? comparisons[comparisons.length - 1]
  const times = (volume / comparison.weight).toFixed(1)

  return (
    <View style={styles.slide}>
      <Image source={require('@/assets/images/DONEicon.png')} style={styles.slideLogo} resizeMode="contain" />
      <Text style={[styles.slideTitle, { color: colors.text }]}>Total Volume</Text>

      <Text style={styles.volumeNumber}>
        {volume.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
        <Text style={styles.volumeUnit}> kg</Text>
      </Text>

      <Text style={[styles.slideSubtitle, { color: theme === 'dark' ? '#aaa' : '#888' }]}>
        That's like lifting {times}x {comparison.label}! 🏋️
      </Text>
    </View>
  )
}

function SummarySlide({ duration, volume, totalSets, colors, theme }: {
  duration: string
  volume: number
  totalSets: number
  colors: any
  theme: string
}) {
  return (
    <View style={styles.slide}>
      <Image source={require('@/assets/images/DONEicon.png')} style={styles.slideLogo} resizeMode="contain" />
      <Text style={[styles.slideTitle, { color: colors.text }]}>Workout Summary</Text>

      <View style={styles.summaryGrid}>
        <View style={[styles.summaryItem, { backgroundColor: theme === 'dark' ? '#1a1a2e' : '#f0f4ff' }]}>
          <Ionicons name="time-outline" size={28} color="#3366FF" />
          <Text style={[styles.summaryValue, { color: colors.text }]}>{duration}</Text>
          <Text style={[styles.summaryLabel, { color: theme === 'dark' ? '#aaa' : '#888' }]}>Duration</Text>
        </View>

        <View style={[styles.summaryItem, { backgroundColor: theme === 'dark' ? '#1a1a2e' : '#f0f4ff' }]}>
          <Ionicons name="barbell-outline" size={28} color="#3366FF" />
          <Text style={[styles.summaryValue, { color: colors.text }]}>
            {volume.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}kg
          </Text>
          <Text style={[styles.summaryLabel, { color: theme === 'dark' ? '#aaa' : '#888' }]}>Volume</Text>
        </View>

        <View style={[styles.summaryItem, { backgroundColor: theme === 'dark' ? '#1a1a2e' : '#f0f4ff' }]}>
          <Ionicons name="layers-outline" size={28} color="#3366FF" />
          <Text style={[styles.summaryValue, { color: colors.text }]}>{totalSets}</Text>
          <Text style={[styles.summaryLabel, { color: theme === 'dark' ? '#aaa' : '#888' }]}>Sets</Text>
        </View>
      </View>
    </View>
  )
}

interface WorkoutSummaryModalProps {
  visible: boolean
  onClose: () => void
  workout: {
    startedAt: string
    finishedAt: string
    sets: any[]
  } | null
}

export function WorkoutSummaryModal({ visible, onClose, workout }: WorkoutSummaryModalProps) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkTheme : lightTheme
  const [currentPage, setCurrentPage] = useState(0)
  const [workoutDates, setWorkoutDates] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (visible) loadWorkoutDates()
  }, [visible])

  async function loadWorkoutDates() {
    try {
      const workouts = await getWorkouts()
      const dates = new Set<string>(
        workouts
          .filter((w: any) => w.finishedAt)
          .map((w: any) => {
            const date = new Date(w.finishedAt)
            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            return localDate.toISOString().split('T')[0]
          })
      )
      setWorkoutDates(dates)
    } catch { }
  }

  if (!workout) return null

  const volume = workout.sets.reduce((acc, s) => {
    if (s.weight && s.reps) return acc + s.weight * s.reps
    return acc
  }, 0)

  const diff = new Date(workout.finishedAt).getTime() - new Date(workout.startedAt).getTime()
  const mins = Math.floor(diff / 60000)
  const duration = mins < 60 ? `${mins}min` : `${Math.floor(mins / 60)}h ${mins % 60}min`
  const totalSets = workout.sets.filter((s) => s.completed).length

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>

          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={theme === 'dark' ? '#aaa' : '#888'} />
          </TouchableOpacity>

          {/* Pager */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.pager}
            onMomentumScrollEnd={(e) => {
              const page = Math.round(e.nativeEvent.contentOffset.x / (width * 0.9))
              setCurrentPage(page)
            }}
          >
            <View style={{ width: width * 0.9 }}>
              <CalendarSlide workoutDates={workoutDates} colors={colors} theme={theme} />
            </View>
            <View style={{ width: width * 0.9 }}>
              <VolumeSlide volume={volume} colors={colors} theme={theme} />
            </View>
            <View style={{ width: width * 0.9 }}>
              <SummarySlide duration={duration} volume={volume} totalSets={totalSets} colors={colors} theme={theme} />
            </View>
          </ScrollView>

          {/* Dots */}
          <View style={styles.dots}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.dot, currentPage === i && styles.dotActive]} />
            ))}
          </View>

          {/* Done button */}
          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' },
  container: { width: width * 0.9, borderRadius: 24, overflow: 'hidden', paddingBottom: 24 },
  closeButton: { position: 'absolute', top: 16, right: 16, zIndex: 10 },
  pager: { height: 420 },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  slideLogo: { width: 80, height: 28, position: 'absolute', bottom: 16 },
  slideTitle: { fontSize: 20, fontWeight: '800', textAlign: 'center' },
  slideSubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  calendarHeader: { flexDirection: 'row', width: '100%', marginBottom: 4 },
  dayName: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '600' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', width: '100%' },
  calendarCell: { width: `${100 / 7}%`, alignItems: 'center', marginBottom: 4 },
  calendarDay: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  calendarDayText: { fontSize: 13 },
  workoutDot: { width: 4, height: 4, borderRadius: 2, position: 'absolute', bottom: 2 },
  volumeNumber: { fontSize: 48, fontWeight: '900', color: '#3366FF' },
  volumeUnit: { fontSize: 24, fontWeight: '400', color: '#3366FF' },
  summaryGrid: { flexDirection: 'row', gap: 10, width: '100%' },
  summaryItem: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', gap: 6 },
  summaryValue: { fontSize: 18, fontWeight: '800' },
  summaryLabel: { fontSize: 11, fontWeight: '600' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ccc' },
  dotActive: { width: 18, backgroundColor: '#3366FF' },
  doneButton: { marginHorizontal: 24, marginTop: 12, backgroundColor: '#3366FF', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  doneButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
})