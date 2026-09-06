import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Home from './pages/Home';
import BuildingDetails from './pages/BuildingDetails';
import RoomDetails from './pages/RoomDetails';
import Report from './pages/Report';
import Leaderboard from './pages/Leaderboard';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Navbar />
          <main>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              
              {/* Protected routes - require authentication */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/building/:id"
                element={
                  <ProtectedRoute>
                    <BuildingDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/room/:id"
                element={
                  <ProtectedRoute>
                    <RoomDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/report/:room_id"
                element={
                  <ProtectedRoute>
                    <Report />
                  </ProtectedRoute>
                }
              />
              
              {/* Cleaning staff only routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['cleaning_staff']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
