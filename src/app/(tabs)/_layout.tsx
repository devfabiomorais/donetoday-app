import ThemeSwitcherButton from '@/components/ui/ThemeSwitcherButton'
import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { Text, View } from 'react-native'
import { darkTheme, lightTheme } from '../../constants/colors'
import { useTheme } from '../../context/ThemeContext'

function TabHeader({
  title,
  showThemeButton = false,
}: {
  title: string
  showThemeButton?: boolean
}) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkTheme : lightTheme

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        width: '100%',
      }}
    >
      <Text style={{ color: colors.text, fontSize: 20, fontWeight: '900' }}>
        {title}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
        {showThemeButton && <ThemeSwitcherButton />}

        <Ionicons name="search-outline" size={22} color={colors.text} />
        <Ionicons name="notifications-outline" size={22} color={colors.text} />
      </View>
    </View>
  )
}

export default function TabsLayout() {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkTheme : lightTheme

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        tabBarStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: '#3366FF',
        tabBarInactiveTintColor: theme === 'dark' ? '#888' : '#999',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerTitle: () => <TabHeader title="Home" />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout',
          headerTitle: () => <TabHeader title="Workout" />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: () => <TabHeader title="Profile" showThemeButton />,

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}