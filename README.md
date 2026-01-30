# <div align="center">MedHive</div>

<div align="center">
<strong>Your Health, Unified.</strong>
</div>

<br />

<div align="center">

![React](https://img.shields.io/badge/Frontend-React%20%7C%20Native-61dafb?style=for-the-badge&logo=react&logoColor=white)
![Node](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Postgres](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Azure](https://img.shields.io/badge/Cloud-Azure-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)

<br />

**[Visit Live Site: https://medhive.lk](https://medhive.lk)**

</div>

---

## 🚀 The Vision
MedHive isn't just a website defined by a single landing page. It is a comprehensive **Healthcare Ecosystem** designed to unify the fragmented medical landscape of Sri Lanka. 

We connect **Patients**, **Doctors via Clinics**, and **Pharmaceutical Companies** into one seamless, AI-powered network.

---

## 🏛️ Project Architecture (Monorepo)

This repository hosts the entire ecosystem, divided into specialized components:

### 1. � The Clinic (Doctor's Hub)
**Folder**: `Clinic/`
*   **Purpose**: Connectivity for Doctors and Pharmacies.
*   **Key Features**:
    *   **Patient Lookup**: Instant access to complete unified medical history (Med ID).
    *   **AI Prescription Writer**: Eliminates illegible handwriting.
    *   **In-House Pharmacy Link**: Instant digital order transmission to the clinic's pharmacy.
    *   **Analytics**: Daily patient throughput and diagnosis trends.

### 2. 📱 The Patient App
**Folder**: `Patient/`
*   **Purpose**: A unified personal health record for every citizen.
*   **Key Features**:
    *   **Record Unifying**: Aggregates history from visiting different MedHive clinics.
    *   **AI Interpretation**: Explains complex lab reports in simple English.
    *   **QR Check-in**: Scan to grant temporary record access to doctors.
    *   **Medicine Reminders**: Automated scheduling based on prescriptions.

### 3. � Pharma Company (Enterprise)
**Folder**: `PharmaCompany/`
*   **Purpose**: Nationwide insights and supply chain optimization.
*   **Key Features**:
    *   **Insights Dashboard**: Real-time visualization of disease outbreaks and medication demand.
    *   **Stock Management**: Automated supply chain alerts.
    *   **ML Model Prediction**: Predicts future demand for specific drugs (e.g., Insulin spikes) to prevent shortages.

### 4. 🌐 Landing Page & Identity
**Folder**: `Landing/`
*   **Purpose**: The public face of MedHive.
*   **Tech**: React, Vite, Glassmorphism aesthetic.
*   **Role**: Onboards new users and explains the ecosystem value proposition.

---

## 🛠️ Technology Stack

| Component | Frontend | Backend | Database | Key Tech |
| :--- | :--- | :--- | :--- | :--- |
| **Patient App** | **React Native** (Expo) | **Express.js** (Node) | **PostgreSQL** | Native Modules, Push Notifications |
| **Clinic Portal** | **React.js** (Vite) | **Express.js** (Node) | **PostgreSQL** | Socket.io (Real-time), Glassmorphism |
| **Pharma Dashboard**| **React.js** | **Express.js** | **PostgreSQL** | Data Visualization, Predictive Models |
| **Landing Page** | **React.js** | - | - | Vercel Deployment, CSS Animations |

### ☁️ Infrastructure & Cloud
*   **Cloud Provider**: **Microsoft Azure** (Hosting & Services)
*   **Database**: **PostgreSQL** (Relational Data for Patients/Medical Records)
*   **Authentication**: JWT / Azure AD (Potential)
*   **AI/ML**: Served via Azure Functions or Python Microservices

---

## 🤝 Contributing

We follow a strict **Team-Based Workflow**. 

> **See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full "Cheatsheet".**

### Quick Rules:
1.  **Never push to `main`**.
2.  **Work in your Team Branch**:
    *   Patient Team -> `patient`
    *   Clinic Team -> `clinic`
    *   Pharma Team -> `pharma`
3.  **Sync Daily**: Run `git pull origin <your-team-branch>`.

---

## � MedHive Team

*   **Zaki Sheriff** (Lead & Patient Team)
*   **Rahman** (Patient Team)
*   **Raheem** (Clinic Team)
*   **Hanaa** (Clinic Team)
*   **Afker** (Pharma Team)
*   **Kausian** (Pharma Team)

---

<p align="center">
<em>"Your Health, Unified."</em>
</p>
