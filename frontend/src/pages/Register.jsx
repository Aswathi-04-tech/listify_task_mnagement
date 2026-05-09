/**
 * Register Page
 * Matches the Listify register design with wave background
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import AuthNavbar from '../components/AuthNavbar';
import WaveBackground from '../components/WaveBackground';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Name validation
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(form.name)) {
      newErrors.name = 'Name can only contain alphabets';
    } else if (form.name.length > 50) {
      newErrors.name = 'Name cannot exceed 50 characters';
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (form.password.length > 32) {
      newErrors.password = 'Password cannot exceed 32 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await register(form.name, form.email, form.password);
    if (result.success) {
      toast.success('Account created! Welcome to Listify 🎉');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="auth-page">
      <AuthNavbar />

      {/* Wave decorative background */}
      <WaveBackground />

      <div className="auth-content">
        <div className="auth-card glass">
          {/* Title */}
          <h2 style={{ color: '#2563eb', fontWeight: 800, fontSize: '28px', textAlign: 'center', marginBottom: '8px' }}>
            Register
          </h2>
          <p style={{ color: '#666', fontSize: '14px', textAlign: 'center', marginBottom: '32px', lineHeight: 1.6, fontWeight: 500 }}>
            Welcome ! Sign in using your social<br />account or email to continue us
          </p>

          {/* Social login buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
            <button className="social-btn" title="Facebook" aria-label="Register with Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877f2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button className="social-btn" title="Google" aria-label="Register with Google">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            <button className="social-btn" title="Apple" aria-label="Register with Apple">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#000">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <input
                className={`form-input ${errors.name ? 'error' : ''}`}
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
              {errors.name && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', textAlign: 'left', paddingLeft: '4px' }}>{errors.name}</p>}
            </div>
            <div style={{ marginBottom: '18px' }}>
              <input
                className={`form-input ${errors.email ? 'error' : ''}`}
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', textAlign: 'left', paddingLeft: '4px' }}>{errors.email}</p>}
            </div>
            <div style={{ marginBottom: '28px' }}>
              <input
                className={`form-input ${errors.password ? 'error' : ''}`}
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.password && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', textAlign: 'left', paddingLeft: '4px' }}>{errors.password}</p>}
            </div>

            <div style={{ textAlign: 'center' }}>
              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Register'}
              </button>
            </div>
          </form>

          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#999' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
