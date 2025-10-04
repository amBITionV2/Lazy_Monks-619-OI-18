# 🌊 Samudra Prahari: The Ultimate Disaster Intelligence & Response Platform  

**Tagline:** Saving Lives with Offline Connectivity, AI-Powered Detection, and Real-time Crisis Response  

---

## 🚨 Why Samudra Prahari?
  

When disaster strikes, communication networks collapse, information gaps widen, and lives are at risk. **Samudra Prahari ("Guardians of the Ocean")** is designed to be the **ultimate disaster app**, built to **save lives during crises** by fusing:  

- **⚡ Offline-first communication** via **Bluetooth relays** (no internet required)  
- **🛰️ Real-time AI-powered detection** from social media signals + citizen reports  
- **📡 Instant analyst coordination** with geospatial alerts and dashboards  

Originally designed for **maritime and ocean hazards** (cyclones, floods, tsunamis), the platform is **extensible to any disaster scenario** — from earthquakes to wildfires.  

---

## 🌍 Key Advantages  

- **🆘 Works Without Internet**  
  - Citizens can send hazard reports even when offline  
  - Reports hop between nearby devices via **Bluetooth P2P relay** until they reach someone online  

- **🤖 AI + Social Scraper**  
  - Autonomous service scans social media for early signals of disasters  
  - Learns over time to reduce false alarms and improve detection speed  

- **🔔 Hyper-local Alerts**  
  - Authorities can draw danger zones on the map  
  - Push notifications instantly reach all affected citizens in that zone  

- **🛠️ Extensible & Future-ready**  
  - Built on modular microservices (backend + AI + dashboards)  
  - Easily adaptable to new hazards, new geographies, and new data sources  

## ⚙️ Technology Stack

| Component              | Technologies Used                                    |
| ---------------------- | ---------------------------------------------------- |
| **Citizen Mobile App** | Expo (React Native), WatermelonDB, expo-task-manager |
| **Analyst Dashboard**  | Next.js, React, Mapbox GL JS, Tailwind CSS           |
| **Backend API**        | Python, FastAPI, Pydantic                            |
| **Scraper Service**    | Python, Playwright                                   |
| **AI Analysis**        | Python, PyTorch / Hugging Face, OpenCV               |
| **Database & BaaS**    | Supabase, PostgreSQL, PostGIS, PL/pgSQL              |

---

## 📂 Folder Structure

```bash
samudra-prahari/
│
├── 📂 mobile-app/         # Expo (React Native) application
│   ├── src/
│   └── app.json
│
├── 📂 dashboard/          # Next.js web application
│   ├── pages/
│   ├── components/
│   └── next.config.js
│
├── 📂 backend/            # FastAPI backend
│   ├── app/
│   └── requirements.txt
|
├── 📂 scraper/            # FastAPI backend
│   ├── scraper.py
│   └── requirements.txt
│
└── 📜 README.md
```

---

## 📖 Getting Started

### 🔹 Prerequisites

* Node.js (v18+)
* Python (3.10+)
* Docker (optional, for backend services)
* Supabase CLI

### 🔹 Setup

```bash
# Clone repository
git clone https://github.com/your-org/samudra-prahari.git
cd samudra-prahari

# Install dependencies for mobile app
cd mobile-app && npm install

# Install dependencies for dashboard
cd ../dashboard && npm install

# Setup backend
cd ../backend && pip install -r requirements.txt
```

### 🔹 Running Services

```bash
# Mobile App
cd mobile-app && npx expo start

# Dashboard
cd dashboard && npm run dev

# Backend
cd backend && uvicorn app.main:app --reload
```

---

## 🌍 Roadmap

* [ ] Multi-hop P2P Relay
* [ ] ML-based report prioritization
* [ ] Cross-platform offline maps in citizen app
* [ ] API integrations with INCOIS forecasting systems

---
## 📜 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---
