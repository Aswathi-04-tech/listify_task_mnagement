import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthNavbar from '../components/AuthNavbar';
import WaveBackground from '../components/WaveBackground';
import { toast } from 'react-toastify';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Message sent! We will get back to you soon 🚀');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="auth-page">
      <AuthNavbar />
      <WaveBackground />

      <div className="auth-content" style={{ padding: '40px 20px', width: '100%' }}>
        <div className="auth-card glass" style={{ 
          maxWidth: '1000px', 
          padding: '0', 
          overflow: 'hidden', 
          display: 'flex', 
          flexDirection: 'row', 
          flexWrap: 'wrap',
          minHeight: '600px',
          margin: '0 auto'
        }}>
          
          {/* Contact Info Sidebar */}
          <div style={{ 
            flex: '1 1 350px',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)', 
            padding: '50px 40px', 
            color: 'white',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Link to="/login" style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              color: 'white', textDecoration: 'none', fontSize: '14px', 
              fontWeight: 600, marginBottom: '40px', opacity: 0.8
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back to Login
            </Link>

            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '20px' }}>Contact Us</h2>
              <p style={{ fontSize: '15px', opacity: 0.9, lineHeight: 1.6, marginBottom: '40px' }}>
                Have questions or feedback? We'd love to hear from you. Reach out and our team will get back to you within 24 hours.
              </p>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>Location</p>
                  <p style={{ fontSize: '13px', opacity: 0.8 }}>123 Productivity Way, Tech City</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>Call Us</p>
                  <p style={{ fontSize: '13px', opacity: 0.8 }}>+1 (555) LISTIFY</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>Email</p>
                  <p style={{ fontSize: '13px', opacity: 0.8 }}>support@listify.app</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '40px' }}>
               {/* Social Icons Placeholder */}
               {[1,2,3].map(i => (
                 <div key={i} style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}>
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
                 </div>
               ))}
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ flex: '1 1 450px', padding: 'clamp(20px, 5vw, 60px)', background: 'white' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#333', marginBottom: '10px' }}>Send us a Message</h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '32px' }}>We'll respond to your inquiry as soon as possible.</p>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#444', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="John Doe" 
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  style={{ border: '1.5px solid #f0f0f0', borderRadius: '12px', padding: '12px 16px' }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#444', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="john@example.com" 
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  style={{ border: '1.5px solid #f0f0f0', borderRadius: '12px', padding: '12px 16px' }}
                />
              </div>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#444', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Message</label>
                <textarea 
                  rows="5" 
                  className="form-input" 
                  placeholder="How can we help you?" 
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                  style={{ border: '1.5px solid #f0f0f0', borderRadius: '12px', resize: 'none', padding: '12px 16px' }}
                />
              </div>
              <button className="btn-primary" type="submit" style={{ width: '100%', borderRadius: '14px', padding: '14px', fontSize: '15px' }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
