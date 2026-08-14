# ✈️ TripVault — Full Stack Travel Journal & Memory Vault

> **Virtual Internship Program • Full Stack (MERN)** | Powered by CodGen (codgen.in)  
> **Final Week 🎓 — Polish, Responsive Design & Deployment**

---

## 🌐 Live Demo & Deployment

- 🚀 **Frontend Live App (Vercel):** [https://tripvault-poojapm.vercel.app](https://tripvault-poojapm.vercel.app)
- ⚡ **Backend API Service (Render):** [https://tripvault-backend.onrender.com](https://tripvault-backend.onrender.com)

---

## 📌 Project Overview

**TripVault** is a modern, full-stack travel memory journaling web application built using the MERN stack (MongoDB, Express.js, React, Node.js). It allows travelers to log their trips, record ratings and dates, write travel notes, upload high-resolution photos via Cloudinary, and showcase a personalized **Public Travel Profile** shareable with friends and family anywhere in the world.

---

## ✨ Features Checklist

### 🔐 Authentication & User Profiles
- **JWT Authentication:** Secure user registration and login with encrypted password storage.
- **Password Strength Indicator:** Real-time password complexity feedback during registration.
- **User Bio Management:** Editable "About Me" bio section synced with user profile.
- **Public Profile Pages:** Shareable public profiles accessible via `/profile/:username` without login requirement.

### 🗺️ Full Trip Memory CRUD
- **Create Trips:** Record trip title, destination location, start/end dates, 5-star ratings, and notes.
- **Location Verification:** Real-time destination lookup using OpenStreetMap geocoding API.
- **Read & Organize:** Visual grid of trip cards with date badges, star ratings, and cover photos.
- **Update Trips:** Instant modal dialog to update travel details.
- **Delete Trips:** Safe deletion with confirmation prompt.

### 📸 Cloud Photo Uploads
- **Cloudinary Integration:** High-speed cloud photo storage for cover images and trip photo galleries.
- **Multi-Photo Support:** Display mini gallery grids per trip memory.

### 🎨 UI Polish & UX Excellence
- **Toast Notifications:** Instant feedback toasts (via `react-toastify`) for login, registration, trip creation, trip edit, trip delete, bio update, and photo upload actions.
- **Loading States:** Animated spinners (`LoadingSpinner`) displayed during asynchronous data fetching.
- **Empty States:** Friendly empty state messages encouraging users to add their first trip.
- **Consistent Styling:** Premium Royal Navy dark mode aesthetic (`#0b1329`, `#152238`, `#00f2fe`, `#10b981`) across all pages.

### 📱 Responsive Design
- **Mobile First & Flexible:** Works seamlessly across mobile devices (375px+ width), tablets, and desktop screens.
- **Hamburger Menu:** Collapsible mobile navigation drawer built into the Navbar.
- **Fluid Layouts:** Adaptive CSS Grid & Flexbox layouts with zero horizontal scrolling.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, React Router v7, Axios, React-Toastify, Vite
- **Backend:** Node.js, Express.js, CORS, Dotenv
- **Database:** MongoDB Atlas & Mongoose ORM
- **Cloud Media Storage:** Cloudinary & Multer
- **Deployment Targets:** Vercel (Client) & Render (Server)

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user account | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | ❌ |
| `GET` | `/api/auth/me` | Fetch logged-in user profile details | ✅ |
| `GET` | `/api/trips` | Fetch all trips belonging to authenticated user | ✅ |
| `POST` | `/api/trips` | Create a new trip memory | ✅ |
| `PUT` | `/api/trips/:id` | Update an existing trip memory | ✅ |
| `DELETE` | `/api/trips/:id` | Delete a trip memory | ✅ |
| `POST` | `/api/trips/:id/upload` | Upload cover/gallery photo to Cloudinary | ✅ |
| `GET` | `/api/users/:username/profile` | Public endpoint to view user bio & public trips | ❌ |
| `PUT` | `/api/users/profile` | Update logged-in user bio | ✅ |

---

## 💻 How to Run Locally

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster account (or local MongoDB)
- Cloudinary account for photo uploads

### 1. Clone the Repository
```bash
git clone https://github.com/poojapm2704-hash/tripvault.git
cd tripvault
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory (see `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/tripvault?retryWrites=true&w=majority
JWT_SECRET=your_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:
```bash
npm run dev # or node index.js
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` directory (see `.env.example`):
```env
VITE_API_URL=http://localhost:5000
```

Start the Vite frontend development server:
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

---

## 🚀 Deployment Guide

### Backend (Render)
1. Push code to GitHub.
2. Log into [Render](https://render.com) and create a **Web Service**.
3. Connect your GitHub repository and set Root Directory to `server`.
4. Set Build Command to `npm install` and Start Command to `node index.js`.
5. Add all Environment Variables (`MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*`).
6. Deploy! Copy your live Render service URL.

### Frontend (Vercel)
1. Log into [Vercel](https://vercel.com) and import your GitHub repository.
2. Set Root Directory to `client`.
3. Add Environment Variable `VITE_API_URL` with your live Render backend URL (e.g. `https://tripvault-backend.onrender.com`).
4. Click **Deploy**.

---

## 👤 Author

- **Pooja P M** — Full Stack Web Developer Intern