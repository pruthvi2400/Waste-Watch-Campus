# Waste Watch Campus - MERN Production Deployment Guide

This guide describes how to configure, run, and deploy the migrated **MERN Stack** (MongoDB, Express, React, Node.js) version of the Waste Watch Campus application.

---

## 1. Project Structure

The project has been refactored into a modern, production-ready MERN directory structure:
```
Waste-Watch-Campus/
├── backend/                  # Node.js + Express API
│   ├── config/               # DB & Cloudinary Configuration
│   ├── controllers/          # Business logic controllers (Auth, Campus, Reports, Leaderboard)
│   ├── middleware/           # JWT Verification & Multer File uploads
│   ├── models/               # Mongoose MongoDB schemas
│   ├── routes/               # Express API endpoints
│   ├── utils/                # Automatic DB Seeder & Google Gemini AI vision integration
│   ├── server.js             # Main server entrypoint
│   └── package.json          # Node dependencies
├── frontend/                 # Vite + React Frontend
│   ├── public/               # Public assets
│   ├── src/
│   │   ├── components/       # Reusable React components (Navbar)
│   │   ├── context/          # React Context (AuthContext)
│   │   ├── pages/            # View Pages (Home, Login, Register, Profile, Building, Room, Report, Leaderboard, Dashboard)
│   │   ├── App.jsx           # Main routing configuration
│   │   ├── index.css         # Custom styled imports & Tailwind v4
│   │   └── main.jsx          # Application entry mount point
│   ├── vite.config.js        # Vite compiler settings
│   └── package.json          # UI package lock list
└── DEPLOYMENT.md             # This deployment manual
```

---

## 2. Environment Configuration

### Backend Setup (`backend/.env`)
Create a `.env` file in the `backend/` folder and populate it with your API keys and credentials:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/waste-watch-campus?retryWrites=true&w=majority
JWT_SECRET=your_jwt_super_secret_key_change_in_production
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_google_gemini_api_key
```

### Frontend Setup (`frontend/.env`)
Vite environment variables require a `VITE_` prefix:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 3. Local Development Run Instructions

### Step 1: Start MongoDB
Ensure MongoDB is running locally on your computer, or configure a MongoDB Atlas Cluster connection URI in `backend/.env`.

### Step 2: Run Express Backend
```bash
cd backend
npm install
npm run dev
```
*Note: On first startup, the database seeder will automatically initialize all campus departments, buildings, floors, and rooms in MongoDB, as well as create test credentials (`testuser` and `cleaning` with password `password123`).*

### Step 3: Run React UI
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` to explore the interactive application.

---

## 4. Production Deployment

### Option A: Deploying Backend to Render
1. Sign up on [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Link your GitHub repository.
4. Set the following options:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Go to the **Environment** tab and add all the environment variables from your `backend/.env` file.
6. Click **Deploy Web Service**.

### Option B: Deploying Frontend to Vercel
1. Sign up on [Vercel](https://vercel.com/).
2. Select **Add New** -> **Project**.
3. Import your GitHub repository.
4. Set the following options:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add the environment variable `VITE_API_URL` pointing to your deployed backend url (e.g., `https://waste-watch-backend.onrender.com/api`).
6. Click **Deploy**.

---

## 5. Summary of Migrated Features
All Python/Flask business logic and functionalities have been preserved character-for-character into the MERN environment:
- **Authentication**: JWT token verification mapped securely into `localStorage`.
- **Campus Wings**: Seeder auto-populates campus architecture; users can explore rooms, wings, and floor listings.
- **AI Classification**: Uploaded image buffers are streamed to Cloudinary, then processed using `gemini-1.5-flash` model from the Google Generative AI SDK, parsing response schemas automatically.
- **Leaderboard**: Real-time aggregation scores sorted descending to list active clean-up initiatives.
- **Dispatch Task Center**: Beautiful, custom control dashboard exclusive to `cleaning_staff` profiles to priority-resolve unresolved reports instantly.
