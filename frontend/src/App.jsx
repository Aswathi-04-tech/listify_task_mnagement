/**
 * App.jsx
 * Root component with routing setup
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/contact';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// ─── Protected Route Wrapper ────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// ─── Public Route: Redirect to dashboard if already logged in ───────────────
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
    <Route path="/about" element={<PublicRoute><About /></PublicRoute>} />
    <Route path="/contact" element={<PublicRoute><Contact /></PublicRoute>} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          theme="light"
          toastStyle={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
