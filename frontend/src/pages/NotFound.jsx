/**
 * NotFound Page
 * 404 error page with premium design and animations
 */

import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top left, #f8fafc, #eff6ff)',
      fontFamily: "'DM Sans', sans-serif",
      textAlign: 'center',
      padding: '20px'
    }}>
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 0.2; }
            100% { transform: scale(1); opacity: 0.5; }
          }
          .floating-404 {
            animation: float 4s ease-in-out infinite;
          }
          .pulse-ring {
            animation: pulse 3s ease-in-out infinite;
          }
        `}
      </style>

      <div style={{ position: 'relative', marginBottom: '40px' }}>
        <div className="pulse-ring" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '180px',
          height: '180px',
          background: '#2563eb',
          borderRadius: '50%',
          zIndex: 0
        }} />

        <div className="floating-404" style={{
          fontSize: '120px',
          fontWeight: 900,
          color: '#1e40af',
          letterSpacing: '-5px',
          position: 'relative',
          zIndex: 1,
          textShadow: '0 20px 40px rgba(30, 64, 175, 0.2)'
        }}>
          404
        </div>
      </div>

      <div style={{ maxWidth: '400px', zIndex: 2 }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
          Page Not Found?
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '16px', lineHeight: 1.6 }}>
          The page you're looking for has drifted off course. Let's get you back to your tasks.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link
            to="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#2563eb',
              color: 'white',
              padding: '14px 28px',
              borderRadius: '16px',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 700,
              boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Home size={18} />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div style={{
        position: 'fixed',
        bottom: '40px',
        color: '#94a3b8',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <AlertCircle size={14} />
        Error Code: 404_PAGE_NOT_FOUND
      </div>
    </div>
  );
}
