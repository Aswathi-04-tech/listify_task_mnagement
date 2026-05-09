import React from 'react';
import { Link } from 'react-router-dom';
import AuthNavbar from '../components/AuthNavbar';
import WaveBackground from '../components/WaveBackground';

const About = () => {
  return (
    <div className="auth-page">
      <AuthNavbar />
      <WaveBackground />

      <div className="auth-content" style={{ padding: '40px 20px', width: '100%' }}>
        <div className="auth-card glass" style={{ 
          maxWidth: '1000px', 
          padding: 'clamp(20px, 5vw, 60px)',
          margin: '0 auto'
        }}>
          {/* Header with Back Link */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
            <Link to="/login" style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              color: '#2563eb', textDecoration: 'none', fontSize: '14px', fontWeight: 600 
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back to Login
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, color: '#2563eb', marginBottom: '16px' }}>
              Elevate Your Productivity
            </h1>
            <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#666', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
              Listify is more than just a task manager. It's your companion in achieving goals and mastering your time with a state-of-the-art interface.
            </p>
          </div>

          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '30px', 
            marginTop: '40px' 
          }}>
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: '#dbeafe', padding: '10px', borderRadius: '12px', color: '#2563eb' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#333' }}>Our Mission</h2>
              </div>
              <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.8 }}>
                At Listify, we believe that clarity leads to action. Our mission is to provide the most intuitive and powerful platform for organizing your life, so you can focus on what truly matters.
              </p>
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: '#dcfce7', padding: '10px', borderRadius: '12px', color: '#16a34a' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#333' }}>Why Listify?</h2>
              </div>
              <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.8 }}>
                Designed with a focus on aesthetics and simplicity, Listify combines modern web technology with a seamless user experience to help you stay ahead of your schedule.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '60px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#333', marginBottom: '30px' }}>Key Features</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
              {[
                { title: 'Smart Lists', color: '#3b82f6', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
                { title: 'Daily Routine', color: '#f59e0b', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> },
                { title: 'Goal Tracking', color: '#10b981', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> },
                { title: 'Cloud Sync', color: '#8b5cf6', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> }
              ].map((feature, index) => (
                <div key={index} style={{ 
                  background: 'rgba(255,255,255,0.5)', 
                  padding: '24px', 
                  borderRadius: '24px', 
                  width: '180px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'transform 0.2s'
                }}>
                  <div style={{ 
                    color: feature.color, 
                    marginBottom: '12px',
                    background: `${feature.color}15`,
                    padding: '12px',
                    borderRadius: '16px'
                  }}>{feature.icon}</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#333' }}>{feature.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
