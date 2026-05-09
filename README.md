# 📋 Listify – Task Management App

A full-stack task management application with JWT authentication, built with React + Node.js + MongoDB.

![Listify](https://img.shields.io/badge/React-18-blue) ![Node](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen)

---

## 🚀 Features

- **Authentication**: Register/Login with JWT tokens, bcrypt password hashing
- **Task CRUD**: Create, Read, Update, Delete tasks
- **Task Properties**: Title, Description, Color, Tags, List, Status, Repeat schedule
- **Search & Filter**: Search by title/description, filter by status or list
- **Dashboard**: Mini calendar, task lists in sidebar, today's tasks view
- **Toast Notifications**: react-toastify for all user actions
- **Responsive**: Mobile-friendly layout
- **Protected Routes**: JWT middleware guards all task endpoints

---

## 🗂️ Project Structure

```
listify/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register, Login, Profile
│   │   └── taskController.js  # CRUD + search/filter
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT protect middleware
│   ├── models/
│   │   ├── User.js            # User schema + bcrypt hooks
│   │   └── Task.js            # Task schema
│   ├── routes/
│   │   ├── authRoutes.js      # /api/auth/*
│   │   └── taskRoutes.js      # /api/tasks/*
│   ├── server.js              # Express app entry
│   ├── .env.example           # Environment variables template
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AuthNavbar.jsx      # Navbar for auth pages
    │   │   ├── MiniCalendar.jsx    # Sidebar calendar
    │   │   ├── TaskModal.jsx       # New/Edit task panel
    │   │   └── WaveBackground.jsx  # Decorative waves
    │   ├── context/
    │   │   └── AuthContext.jsx     # Global auth state
    │   ├── pages/
    │   │   ├── Register.jsx
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── NotFound.jsx
    │   ├── utils/
    │   │   └── api.js              # Axios instance + interceptors
    │   ├── App.jsx                 # Routes + providers
    │   ├── main.jsx
    │   └── index.css               # Global styles
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/listify.git
cd listify
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

**`.env` file:**
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/listify
JWT_SECRET=your_strong_secret_key_here
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev   # Development with nodemon
npm start     # Production
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev   # http://localhost:5173
```

---

## 🔌 API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint    | Auth | Description        |
|--------|-------------|------|--------------------|
| POST   | /register   | No   | Register new user  |
| POST   | /login      | No   | Login, get token   |
| GET    | /profile    | JWT  | Get current user   |

### Task Routes (`/api/tasks`)
| Method | Endpoint    | Auth | Description               |
|--------|-------------|------|---------------------------|
| GET    | /           | JWT  | Get all tasks (+ search)  |
| GET    | /:id        | JWT  | Get single task           |
| POST   | /           | JWT  | Create task               |
| PUT    | /:id        | JWT  | Update task               |
| DELETE | /:id        | JWT  | Delete task               |

**Query params for GET /api/tasks:**
- `search` – search title/description
- `status` – filter by `todo | in-progress | completed`
- `list` – filter by list name

---

## 🌐 Deployment

### Backend – Render.com (Free)
1. Push code to GitHub
2. Create new **Web Service** on [render.com](https://render.com)
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables (MONGO_URI, JWT_SECRET, CLIENT_URL)

### Frontend – Vercel (Free)
1. Create account at [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Set root directory to `frontend`
4. Add env variable: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy!

---

## 🔒 Security Features

- Passwords hashed with **bcryptjs** (12 salt rounds)
- **JWT tokens** expire after 7 days
- Routes protected with auth middleware
- Input validation with **express-validator**
- Tasks scoped per user (users can only access their own tasks)
- CORS configured for specific origins

---

## 🎨 Design

Matches the **Listify** Figma design:
- Clean white cards on light background
- Blue (#2563eb) primary accent
- Wave decorations on auth pages
- DM Sans typography
- Mini calendar in sidebar
- Color-coded task cards
- Slide-in task creation modal

---

## 📦 Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React 18, React Router, Tailwind CSS, Axios, react-toastify |
| Backend   | Node.js, Express, JWT, bcryptjs, express-validator |
| Database  | MongoDB, Mongoose       |
| Dev Tools | Vite, Nodemon           |
