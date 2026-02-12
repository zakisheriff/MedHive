<div align="center">
  <img src="assets/images/logode.png" width="100" height="100" alt="MedHive Logo" />
  <h1>MedHive Patient App</h1>
  <p><strong>Your Personal Health Hub & Unified Medical Record.</strong></p>

  [![Expo](https://img.shields.io/badge/Platforms-Android%20%7C%20iOS%20%7C%20Web-4630EB?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
  [![React Native](https://img.shields.io/badge/React--Native-v0.81-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-v5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

  <br />

  **[Main Website: medhive.lk](https://medhive.lk)**<br />
  **[Patient Portal: patient.medhive.lk](https://patient.medhive.lk)**
</div>

---

## 📱 About the App

The **MedHive Patient App** is a cornerstone of the MedHive ecosystem. It empowers patients to take full control of their medical data. Built with **React Native and Expo**, it provides a seamless, secure, and intuitive experience across mobile platforms.

- **Live Access**: [patient.medhive.lk](https://patient.medhive.lk)

### ✨ Key Features
- **Unified Health Record**: Access all your medical history from any MedHive-connected clinic using your unique **Med-ID**.
- **AI Prescription Analyzer**: Scan and interpret prescriptions instantly to understand your medication.
- **Digital Lab Reports**: View lab results with AI-powered simplified explanations for complex medical terms.
- **Smart Check-in**: Generate a secure QR code to temporarily share your records with authorized doctors.
- **Medicine Manager**: Automated reminders and schedule tracking for your prescribed medications.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Expo](https://expo.dev) (SDK 54)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based)
- **State Management**: React Context / Hooks
- **Styling**: Pure React Native StyleSheet with custom theme constants
- **Internationalization**: [i18next](https://www.i18next.com/) (Supports English, Sinhala, Tamil)
- **Icons**: [@expo/vector-icons](https://icons.expo.fyi/)

---

## 🚀 Getting Started

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the repo
```bash
git clone https://github.com/zakisheriff/MedHive.git
cd MedHive/Patient/Frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npx expo start
```

### 4. Running on Devices
- **Mobile**: Download the [Expo Go](https://expo.dev/go) app and scan the QR code.
- **iOS**: Press `i` to open in the simulator.
- **Android**: Press `a` to open in the emulator or connected device.
- **Web**: Press `w` to open in your browser.

---

## 📁 Project Structure

```text
├── app/               # Expo Router pages & layouts
│   ├── (tabs)/        # Main tab navigation
│   └── auth/          # Authentication screens
├── assets/            # Images, fonts, and translations
├── components/        # Reusable UI components
├── constants/         # Theme, Colors, and API configs
├── context/           # Global context providers
├── utils/             # Helper functions and stores
└── hooks/             # Custom React hooks
```

---

## 🧪 Development Workflow

- **Branching**: All frontend work should be done in branches prefixed with `patient/`.
- **Styling**: Adhere to the established design system in `constants/theme.ts`.
- **I18n**: Add all new strings to the translation files in `assets/translations/`.

---

<div align="center">
  <p><em>Part of the MedHive Healthcare Ecosystem.</em></p>
  <img src="assets/images/logode.png" width="30" height="30" alt="MedHive Mini Logo" />
</div>
