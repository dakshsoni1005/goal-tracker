# GoalFlow – Smart Daily Goal Tracker (Backend)

GoalFlow is a production-ready, highly scalable RESTful API backend engineered for a daily goal and habit tracking SaaS platform. Built on **Node.js**, **Express.js**, and **MongoDB/Mongoose**, the codebase enforces clean architecture, strict input validation, robust database indexes, centralized error handling, and solid security features.

---

## 🚀 Key Features

*   **🔒 Double-Token Authentication**: JWT-based access tokens (sent via payload or HTTP-only secure cookies) combined with refresh tokens. Fully supports password hashing (`bcryptjs`) and secure password reset.
*   **🎯 Goal Module**: CRUD APIs, text-indexing for full-text search, pagination, priority, custom categories, archiving and time-based filters (`today`, `upcoming`, `overdue`).
*   **🔥 Habit & Streak Engine**: Automatic, self-correcting streak algorithms tracking current and best streaks. Prevents timezone shifts by utilizing string-based calendar completions. Generates monthly completions graphs and rates.
*   **📓 Notes Workspace**: Rich memo organizer supporting card tags, background color presets, and content search.
*   **⏰ Background Reminder Daemon**: Integrates `node-cron` to execute recurring alerts (daily/weekly/once) at minute-resolution. Triggers automatic emails (`nodemailer`) and logs corresponding browser notifications.
*   **📊 Multi-tier Analytics & Dashboard**:
    *   Category distribution aggregation pipelines.
    *   Productivity Score calculated via goal completion rates combined with habit streak performance.
    *   Day-of-week analytics calculating the user's most productive day.
    *   Dynamic daily/monthly progress breakdowns.
*   **🛡️ Production Security Standard**:
    *   **Helmet**: Sets custom secure HTTP headers.
    *   **Mongo Sanitize**: Safeguards query structures from Operator Injection.
    *   **Express Rate Limiter**: Throttles brute force requests per IP window.
    *   **CORS**: Secure cross-origin setup supporting credentials.
    *   **Express Validator**: Restricts payload structures at the router boundary.

---

## 📂 Folder Architecture

```text
backend/
├── config/              # Database & external API integrations (MongoDB Mongoose, Cloudinary)
├── constants/           # Global enums, strings, status types
├── controllers/         # MVC Controllers parsing request context & returning responses
├── emails/              # (Reserved for custom HTML template builders)
├── helpers/             # Custom parsing or calculation helper utilities
├── jobs/                # Background daemons (reminder execution schedules, seeders)
├── logs/                # System log outputs
├── middleware/          # Security, Auth checkers, validation hooks, central error boundary
├── models/              # Mongoose DB schemas with indexes and text-search definitions
├── routes/              # Express Router bindings connecting endpoints to controllers
├── services/            # Custom third-party connectors
├── utils/               # Standardised API response layout, Date helpers, Mailers, Loggers
├── validators/          # Input checking definitions using express-validator
├── .env.example         # Environment template file
├── app.js               # Express application initialization
├── server.js            # Main bootstrap entry point
├── package.json         # Project metadata and dependencies
└── postman_collection.json # Ready-to-import Postman REST tests collection
```

---

## 🛠️ Installation & Setup

### Prerequisites
*   Node.js (v18.x or above recommended)
*   MongoDB Instance (Local Community edition or Atlas cloud Cluster)

### 1. Clone & Install Dependencies
Navigate to the project root and install npm modules:
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` into a new `.env` file and edit credentials:
```bash
cp .env.example .env
```
Ensure `MONGODB_URI` points to your active database and complete the `SMTP` credentials if you wish to verify email mailers.

### 3. Seed Sandbox Data
Populate default system categories and a ready-to-test sandbox user with mock goals, active habit streaks, notes, and notifications:
```bash
npm run seed
```
*   **Default login**: `sandbox@goalflow.com`
*   **Password**: `Password123`

### 4. Boot Server (Development Mode)
Launch the API server with nodemon reload support:
```bash
npm run dev
```
The server will bind to `http://localhost:5000` by default.

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Route | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/register` | POST | Sign up a new user, sends email verify | Public |
| `/login` | POST | Login, signs access/refresh tokens in cookies | Public |
| `/logout` | POST | Clear HTTP-only auth cookies | Private |
| `/verify-email` | GET | Parse verify token and confirm user email | Public |
| `/forgot-password` | POST | Generate reset token and email URL | Public |
| `/reset-password` | POST | Reset password using secret URL token | Public |
| `/profile` | GET | Retrieve authenticated profile details | Private |
| `/profile` | PATCH | Update name, avatar, or local timezone | Private |
| `/change-password` | PATCH | Reset password while authenticated | Private |

### 🎯 Goals (`/api/goals`)
| Route | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/` | GET | Get paginated goals, supports sorting, status filtering, category, tags | Private |
| `/` | POST | Create a goal linked to category and due date | Private |
| `/:id` | GET | Retrieve a single goal | Private |
| `/:id` | PATCH | Update goal parameters | Private |
| `/:id` | DELETE | Delete goal | Private |
| `/today` | GET | Retrieve goals due today | Private |
| `/upcoming` | GET | Retrieve future pending goals | Private |
| `/overdue` | GET | Retrieve overdue pending goals | Private |
| `/search` | GET | Full-text query on title, desc, and tags | Private |
| `/:id/complete` | PATCH | Fast status toggle to completed | Private |
| `/:id/archive` | PATCH | Archive goal | Private |
| `/:id/unarchive` | PATCH | Unarchive goal | Private |

### 🔥 Habits (`/api/habits`)
| Route | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/` | GET | Get user habits list | Private |
| `/` | POST | Create daily/weekly habit routine | Private |
| `/:id` | GET | Get single habit details | Private |
| `/:id` | PATCH | Update metadata (title, color, icon) | Private |
| `/:id` | DELETE | Remove habit record | Private |
| `/:id/complete` | PATCH | Register completion on a date. Calculates streaks | Private |
| `/:id/reset` | PATCH | Reset streak metric | Private |
| `/:id/streak` | GET | Get current and best streaks | Private |
| `/:id/stats` | GET | Completion calendar rates for current month | Private |

### 📓 Notes (`/api/notes`)
| Route | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/` | GET | Get all notes (pinned first) | Private |
| `/` | POST | Create note with cards color and tag | Private |
| `/pinned` | GET | Get only pinned notes | Private |
| `/search` | GET | Search notes content or tags | Private |
| `/:id` | GET | Get single note | Private |
| `/:id` | PATCH | Update content or pin status | Private |
| `/:id` | DELETE | Delete note | Private |

### 📂 Categories (`/api/categories`)
| Route | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/` | GET | List default categories and user custom categories | Private |
| `/` | POST | Create a custom category | Private |
| `/:id` | GET | Retrieve category details | Private |
| `/:id` | PATCH | Update custom category | Private |
| `/:id` | DELETE | Delete custom category | Private |

### ⏰ Reminders (`/api/reminders`)
| Route | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/` | GET | Get reminders list | Private |
| `/` | POST | Setup reminder linked to Goal/Habit | Private |
| `/active` | GET | Fetch pending reminders due within 5 minutes | Private |
| `/:id` | GET | Get reminder details | Private |
| `/:id` | PATCH | Reschedule or toggle state | Private |
| `/:id` | DELETE | Delete reminder | Private |

### 🔔 Notifications (`/api/notifications`)
| Route | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/` | GET | Fetch in-app notifications | Private |
| `/unread-count` | GET | Get total number of unread alerts | Private |
| `/:id/read` | PATCH | Toggle notification state to read | Private |
| `/:id` | DELETE | Remove notification | Private |

### 📊 Analytics & Consolidation (`/api/analytics`, `/api/dashboard`)
| Route | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/api/dashboard` | GET | Unified home dashboard view: Today's progress, habits checklist, overdue tasks, active score, and 7-day completion graph | Private |
| `/api/analytics/dashboard` | GET | High-level metrics: Productivity scores, goals rate, streaks, productive day, category counts | Private |
| `/api/analytics/monthly` | GET | Calendared monthly completion lists | Private |
| `/api/analytics/yearly` | GET | Month-by-month progress lists for current year | Private |

---

## 🧪 Verification & Testing
1. Ensure the app has seeded data via `npm run seed`.
2. Import `postman_collection.json` into your Postman client app.
3. First execute the **Login User** request to retrieve credentials. The Postman tests runner script will automatically grab the signed token from the response and update the `{{authToken}}` environment variable for all subsequent protected requests.
4. Hit `/api/health` to confirm system connection availability.
