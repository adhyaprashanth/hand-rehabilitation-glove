# 🧤 Hand Rehabilitation Glove — Web Dashboard

A beautiful, modern, interactive web dashboard for demonstrating a **Hand Rehabilitation Glove** prototype to college project mentors, evaluators, and visitors.

This is a **live product showcase website** — not a patient portal or hospital management system. The site demonstrates how the glove monitors finger movements in real time, detects predefined hand patterns, and counts exercise repetitions.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🖐 **Live Finger Monitoring** | Animated hand visualization with 5 independently tracked fingers |
| 📊 **Flex Sensor Readings** | Live cards for each finger showing bending %, ADC value, and status |
| ✨ **Movement Detection** | Detects and names predefined movements (Flexion, Extension, Pinch, etc.) |
| 🔢 **Rep Counter** | Automatically counts repetitions with bounce animation and +1 celebration |
| 📈 **Live Sensor Graph** | Recharts line chart updating in real time per selected finger |
| 🎥 **Exercise Guide** | Video demonstration cards with modal player (YouTube embeds) |
| ⚙️ **Calibration Panel** | Simulated per-sensor calibration sequence with progress animation |
| 🖥 **System Status** | Live status of ESP32, sensors, Wi-Fi, and Firebase |
| 🌸 **Demo Mode** | Fully simulated data for live presentations — no hardware needed |
| ☁️ **Firebase Ready** | Clean abstraction layer prepared for real ESP32 → Firebase integration |

---

## 🏗 Project Structure

```
src/
├── config/
│   └── exercises.js      ← ✏️ Edit exercise names, descriptions, and VIDEO URLS here
│
├── constants/
│   └── fingers.js        ← Finger display properties, colors, sensor pin docs
│
├── types/
│   └── index.js          ← JSDoc type definitions (FingerData, MovementData, etc.)
│
├── services/
│   ├── demoData/
│   │   └── simulator.js  ← 🔧 All simulated sensor logic lives here
│   └── firebase/
│       └── index.js      ← ☁️ Add real Firebase code here when ready
│
├── hooks/
│   └── useSensorData.js  ← 🔌 Single data hook — switches demo ↔ Firebase
│
├── components/
│   ├── layout/           ← Navbar, Footer
│   ├── common/           ← SectionTitle
│   ├── hand/             ← HandVisualization (SVG)
│   ├── sensors/          ← FingerCard, SensorGraph
│   ├── dashboard/        ← MovementDetector, RepCounter
│   ├── exercises/        ← ExerciseCard, ExerciseVideoModal
│   ├── status/           ← SystemStatus, CalibrationPanel
│   └── flow/             ← DataFlow (pipeline diagram)
│
└── pages/
    └── Home/             ← One section file per website section
        ├── HeroSection.jsx
        ├── LiveHandSection.jsx
        ├── SensorReadingsSection.jsx
        ├── GraphSection.jsx
        ├── ExercisesSection.jsx
        ├── HowItWorksSection.jsx
        └── CalibrationSection.jsx
```

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (Vercel deploy)
npm run build
```

Open `http://localhost:5173` in your browser.

---

## 🌸 Demo Mode

**Demo Mode is ON by default.** It simulates realistic sensor data without any hardware.

### How it works:
- All simulated data is generated in **`src/services/demoData/simulator.js`** only.
- Each finger has its own sinusoidal oscillator with unique frequency and phase.
- Movement patterns cycle through Flexion → Extension → Pinch → Finger Flexion → Extension.
- Rep count increments automatically at the end of each Hand Flexion cycle.
- The live graph streams per-finger bending history.

### To change simulation behaviour:
Edit **`src/services/demoData/simulator.js`**:
- `MOVEMENT_PATTERNS` — add/modify movement definitions and finger targets.
- `OSCILLATORS` — tune frequency, amplitude, and phase per finger.
- `PATTERN_HOLD_MS` — how long each movement pattern is held.

---

## ☁️ Future Firebase Integration

When your ESP32 is ready to send real data:

### Step 1 — Install Firebase
```bash
npm install firebase
```

### Step 2 — Configure Firebase
In **`src/services/firebase/index.js`**:
- Replace the `firebaseConfig` object with your Firebase project settings.
- Implement `subscribeToSensorData()` using `onValue()` from `firebase/database`.
- Transform the Firebase snapshot into the `FingerData[]` shape.

### Step 3 — Switch data source
In **`src/hooks/useSensorData.js`**:
```js
const USE_FIREBASE = true; // Change this from false to true
```

That's it. No component files need to change.

### Expected Firebase Database Structure
```
/glove/
  sensors/
    thumb:  { value: 2048, percent: 50 }
    index:  { value: 3000, percent: 73 }
    middle: { value: 1500, percent: 37 }
    ring:   { value: 500,  percent: 12 }
    little: { value: 800,  percent: 20 }
  movement/
    name: "Hand Flexion"
    detected: true
    emoji: "✊"
  repCount: 12
  systemStatus/
    esp32Connected: true
    wifiConnected: true
```

---

## ✏️ How to Modify the Website

| What to change | Where to edit |
|---|---|
| 🎨 Colours / design tokens | `tailwind.config.js` and `src/styles/globals.css` |
| 🎥 Exercise videos | `src/config/exercises.js` — change `videoUrl` per exercise |
| ➕ Add a new exercise | Add an entry to the `EXERCISES` array in `src/config/exercises.js` |
| 🖐 Finger names / icons | `src/constants/fingers.js` |
| 🔢 Simulation behaviour | `src/services/demoData/simulator.js` |
| ☁️ Firebase integration | `src/services/firebase/index.js` + `src/hooks/useSensorData.js` |
| 📝 Individual sections | `src/pages/Home/[SectionName].jsx` |
| 🧩 Individual components | `src/components/[category]/[ComponentName].jsx` |

---

## 🛠 Tech Stack

- **React 18 + Vite** — fast dev server and build
- **Tailwind CSS v3** — utility-first styling with custom palette
- **Framer Motion** — smooth spring animations
- **Recharts** — live sensor graph
- **Lucide React** — clean icon library

---

## 📦 Deployment (Vercel)

```bash
npm run build
```

Then drag the `dist/` folder to Vercel, or connect the GitHub repo and Vercel will auto-detect Vite.

No environment variables are needed for Demo Mode.
For Firebase: add your config keys as Vercel environment variables.

---

## 👥 Project Team

College Project — Hand Rehabilitation Glove Prototype  
Built with 🧤 + ☁️ + 💙
