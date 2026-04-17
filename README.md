# 🛡️ AI Guardian Angel — Privacy-First AI Safety System

<div align="center">

![AI Guardian Angel](https://img.shields.io/badge/AI%20Guardian%20Angel-v0.0.1-blue?style=for-the-badge&logo=shield)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Privacy First](https://img.shields.io/badge/Privacy-First-orange?style=for-the-badge)

**A real-time, voice-activated personal safety system with on-device AI processing.**  
Built for women's safety — no data ever leaves your device.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [How It Works](#-how-it-works)
- [Screens & Components](#-screens--components)
- [Privacy Philosophy](#-privacy-philosophy)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)

---

## 🌟 Overview

**AI Guardian Angel** is a privacy-first personal safety web application designed to protect individuals — particularly women — in potentially dangerous situations. The system continuously monitors contextual risk factor signals (movement, location anomalies, time of day), listens for custom voice trigger phrases, and automatically escalates through a multi-stage emergency protocol when a threat is detected.

> All processing happens **100% on-device**. No audio is ever recorded, stored, or transmitted to external servers.

---

## ✨ Key Features

### 🎙️ Real-Time Voice Trigger Detection
- Uses the browser's native **Web Speech API** for on-device, continuous speech recognition.
- Listens for fully **customizable trigger phrases** (e.g., `"Help"`, `"I forgot my charger"`, `"Call my sister"`).
- Provides **voice feedback** via the Speech Synthesis API to confirm detection.

### 🔴 Multi-Stage Emergency Protocol
1. **Detection** — A trigger phrase is recognized or risk score crosses a threshold.
2. **Confirmation Window** — A configurable countdown (5–60 seconds) allows the user to cancel a false alarm.
3. **Activation** — Emergency contacts are notified with the user's location; authorities can be alerted.

### 📊 Contextual Risk Scoring
- A live **risk score (0–100)** aggregates simulated sensor inputs (accelerometer, GPS, time-of-day).
- Risk decays passively when no threats are present.
- Auto-triggers the emergency protocol at score ≥ 70.

### 🗺️ Safety Route Visualization
- A dynamic **safety map** appears when risk is elevated.
- Visually distinguishes safe, suspicious, and danger zones.
- User position updates in real-time based on risk level.

### 📱 Scenario-Based Configuration
- Create multiple named **emergency scenarios** with unique:
  - Trigger phrases
  - Confirmation windows
  - Contact notification lists
  - Custom SOS messages (sent via SMS/WhatsApp)
  - Per-scenario toggles for video/audio recording, GPS sharing, and police notification.

### 👥 Emergency Contact Management
- Add and manage emergency contacts (name + phone number).
- Contacts are shown with **SOS Sent / Standby** status during active emergencies.

### 🌗 Dark / Light Theme
- Full **dark and light mode** support with persistent toggle in the header.

---

## 🛠️ Tech Stack

| Category        | Technology                                        |
|-----------------|---------------------------------------------------|
| Framework       | React 19                                          |
| Build Tool      | Vite 7                                            |
| Language        | JavaScript (ES Modules / JSX)                     |
| State Management| React Context API (`SafetyContext`)               |
| Icons           | Lucide React                                      |
| Voice Input     | Web Speech API (`SpeechRecognition`)              |
| Voice Output    | Web Speech API (`SpeechSynthesis`)                |
| Styling         | Vanilla CSS with CSS Custom Properties (Theming)  |
| Linting         | ESLint 9 + eslint-plugin-react-hooks              |

---

## 📁 Project Structure

```
ai-guardian-angel/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images, icons
│   ├── components/
│   │   ├── Dashboard.jsx        # Main monitor screen with risk score & simulator
│   │   ├── Configuration.jsx    # Scenario & contact management UI
│   │   ├── EmergencyActive.jsx  # Full-screen emergency active overlay
│   │   └── LockScreenAlert.jsx  # Confirmation countdown overlay
│   ├── context/
│   │   └── SafetyContext.jsx    # Global state: risk, scenarios, contacts, voice
│   ├── App.jsx              # Root layout, navigation, theme toggle
│   ├── App.css              # Component-scoped styles
│   ├── index.css            # Global design tokens, theming (dark/light)
│   └── main.jsx             # React entry point
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A modern **Chromium-based browser** (Chrome, Edge) for full Web Speech API support.

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/WebVerse-Cohort-1/AI-Guardian-Angel-Privacy-First-AI-Safety-System.git

# 2. Navigate into the project directory
cd AI-Guardian-Angel-Privacy-First-AI-Safety-System

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Start the Vite development server    |
| `npm run build`   | Build the production bundle          |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint across all source files   |

---

## ⚙️ How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Guardian Angel                        │
│                                                             │
│  ┌─────────────┐    ┌──────────────────┐                   │
│  │ Risk Scoring │    │  Voice Detection │                   │
│  │  (Sensors)   │    │ (SpeechRecog API)│                   │
│  └──────┬──────┘    └────────┬─────────┘                   │
│         │                    │                              │
│         └────────┬───────────┘                              │
│                  ▼                                          │
│         ┌─────────────────┐                                 │
│         │  SafetyContext  │  ← Central State (React)        │
│         │  (Global State) │                                 │
│         └────────┬────────┘                                 │
│                  │                                          │
│        ┌─────────┼─────────┐                               │
│        ▼         ▼         ▼                               │
│  [Risk < 40] [Confirming] [ACTIVE]                         │
│   Protected   Countdown   Emergency                         │
│   Status      Overlay     Protocol                         │
│                           + Notify Contacts                 │
│                           + Send Location                   │
│                           + Alert Authorities               │
└─────────────────────────────────────────────────────────────┘
```

### Alert State Machine

| State         | Trigger                                    | UI Display              |
|---------------|--------------------------------------------|-------------------------|
| `inactive`    | Default / after reset                      | Green "Protected" card  |
| `confirming`  | Voice phrase detected or risk score ≥ 70   | `LockScreenAlert` overlay with countdown |
| `active`      | Countdown expires or user manually confirms | `EmergencyActive` overlay; contacts marked as notified |

---

## 🖥️ Screens & Components

### Monitor Tab (Dashboard)
- Live **risk score gauge** with color-coded status (Safe / Suspicious / Emergency).
- **Safety Route Map** that appears when risk is elevated.
- **Sensor event simulator** (Night, Unsafe Location, Movement, Scream buttons).
- **Voice trigger simulator** buttons for each configured phrase.
- **Emergency Contacts** panel with real-time notification status.

### Scenarios Tab (Configuration)
- Create, edit, and delete named emergency scenarios.
- Per-scenario controls for trigger phrase, confirmation window, SOS message, GPS sharing, recording, and police notification.

### Settings Tab
- Global confirmation window duration.
- Privacy mode toggle (always "Never Store" — on-device only).
- Real-time voice assistant toggle (enables microphone access).
- Emergency contacts and voice trigger phrases management.

---

## 🔒 Privacy Philosophy

AI Guardian Angel was built with a **privacy-first** foundation:

- ✅ **No backend / No server** — Fully client-side application.
- ✅ **No data storage** — Trigger history is never saved. State resets on page refresh.
- ✅ **On-device speech processing** — The Web Speech API processes audio locally; no audio bytes are transmitted externally.
- ✅ **No analytics, no tracking** — Zero third-party data collection.
- ✅ **Open source** — Full transparency into how your data is handled (it isn't).

---

## 🗺️ Future Roadmap

- [ ] **Real GPS Integration** — Live location sharing via Google Maps / native Geolocation API.
- [ ] **SMS/WhatsApp Gateway** — Actual message dispatch via Twilio/WhatsApp Business API.
- [ ] **On-device ML Model** — TensorFlow.js model for environmental sound classification (scream, gunshot detection).
- [ ] **Smart Band Integration** — Bluetooth LE connection to a paired wearable for biometric triggers.
- [ ] **Offline Mode / PWA** — Service Worker and offline-first architecture.
- [ ] **Blockchain Evidence Chain** — Immutable, timestamped evidence log for legal use.
- [ ] **Face Recognition** — On-device face recognition using face-api.js.
- [ ] **Auto FIR Generation** — Pre-filled police report generation on emergency activation.
- [ ] **Multi-language Support** — Voice triggers and UI in regional Indian languages.

---

## 🤝 Contributing

Contributions are welcome! If you have ideas to improve personal safety features, voice detection accuracy, or UI/UX, please:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add: your feature description'`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request.

Please ensure your code follows the ESLint configuration and React best practices.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ for women's safety by **WebVerse Cohort 1**  
*Empowering safety through privacy-respecting technology.*

[![GitHub](https://img.shields.io/badge/GitHub-WebVerse--Cohort--1-181717?style=flat-square&logo=github)](https://github.com/WebVerse-Cohort-1/AI-Guardian-Angel-Privacy-First-AI-Safety-System)

</div>
