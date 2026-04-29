# DoneToday App 📱

Mobile app for workout tracking and progression. Built with React Native and Expo.

## Tech Stack

- **Framework:** React Native + Expo
- **Language:** TypeScript
- **Navigation:** Expo Router
- **Auth storage:** expo-secure-store
- **HTTP client:** Axios
- **Back-end:** [donetoday-api](https://github.com/devfabiomorais/donetoday-api)

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Expo Go app on your phone

### Installation

```bash
git clone https://github.com/devfabiomorais/donetoday-app.git
cd donetoday-app
npm install
```

### Running the project

```bash
npx expo start
```

Scan the QR code with Expo Go (Android) or Camera (iOS).

## Project Structure

```
src/
├── app/                  # Screens and navigation (Expo Router)
│   ├── (auth)/           # Auth screens (login, signup, forgot password)
│   ├── (tabs)/           # Main tabs (home, workout, profile)
│   ├── routine/          # Routine screens (create, add-exercise)
│   └── workout/          # Workout screens (active)
├── components/           # Reusable components
│   ├── ui/               # Base UI components (button, input)
│   └── WorkoutSummaryModal.tsx
├── constants/            # Colors and constants
├── context/              # React contexts (AuthContext, ThemeContext)
├── services/             # API services (auth, exercises, routines, workouts)
└── store/                # Global store (routineStore)
```

## Environment

The app connects to the production API at:
```
https://donetoday-api-production.up.railway.app
```

## Features

- ✅ Authentication (login, signup, forgot password)
- ✅ Create routines with exercises, sets, kg, reps and rest time
- ✅ Execute workouts with rest timer
- ✅ Workout history feed
- ✅ Post-workout summary (calendar, volume, stats)
- 🔄 Profile page (in progress)
- 🔄 Custom exercises (in progress)
- 🔄 Exercise filters (in progress)