# GoalFlow – Smart Daily Goal Tracker (Frontend)

GoalFlow is a premium, Notion-like React frontend engineered for managing daily goals, routines, habit heatmaps, and workspace notes. Powered by **React 19**, **Vite**, and **Tailwind CSS**, the interface prioritizes visual excellence using curated HSL color schemes, dark mode layouts, soft card shadows, and micro-interactions powered by **Framer Motion**.

---

## 🎨 Core Tech Stack

*   **⚡ React 19 + Vite**: High-performance React environment with hot module replacement (HMR).
*   **🛣️ React Router DOM**: Protected client-side routing, automatically redirecting guest sessions.
*   **🌀 Context API states**: Universal auth, custom timezone preferences, and language controls.
*   **📊 Recharts Visualizations**: Area lines, pie distributions, and bar graphs representing user productivity rates.
*   **🔥 Custom Completions Heatmaps**: Local timezone-safe daily grid maps displaying completions visually in real-time.
*   **📦 React Hook Form + Zod**: Validates input properties on user registration, login, settings, goals, and habits.
*   **🔔 In-App Alerts**: Global notification panel matching Morgan logs.

---

## 📂 Directories Map

```text
frontend/
├── src/
│   ├── assets/       # Media graphics, icons, and static assets
│   ├── components/
│   │   ├── common/   # Global shared layouts
│   │   └── ui/       # Button, Card, Badge, Modal, ProgressRing UI elements
│   ├── context/      # Global states (AuthContext, ThemeContext)
│   ├── layouts/      # Dashboard layouts with collapsible sidebar drawer
│   ├── pages/        # Landing, Login, Register, Goals, Habits, Analytics, Notes, Profile, Settings
│   ├── routes/       # Router configurations (AppRoutes.jsx)
│   ├── services/     # Axios client connectors (goalService, habitService, authService)
│   ├── styles/       # Tailwind CSS overrides & glassmorphic properties (index.css)
│   ├── utils/        # Timezone-safe date formatting helpers
│   ├── App.jsx       # App shell mounting Providers
│   └── main.jsx      # Rendering bootstrap point
├── index.html        # App landing frame
├── vite.config.js    # Local development server proxy rules
└── tailwind.config.js# Curated shadows, rounded borders, and color extensions
```

---

## 🛠️ Run & Launch Instructions

### 1. Install dependencies
Navigate to the frontend folder and install:
```bash
cd frontend
npm install
```

### 2. Configure Local Proxy
Vite is preconfigured in `vite.config.js` to proxy `/api` calls to the Express backend running on port 5000:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
    secure: false,
  }
}
```

### 3. Launch Development Server
Boot local client server:
```bash
npm run dev
```
Open `http://localhost:3000` to interact with the application.

### 4. Build Production Bundle
To build the optimized static asset package, run:
```bash
npm run build
```
The compiled files will write to the `dist/` directory.
