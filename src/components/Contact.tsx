import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SplitText } from './SplitText';
import { Send, CheckCircle, Mail, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playHoverSound, playClickSound, playSuccessSound } from '../utils/audio';

export const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setStatus('sending');

    // Mock API Call
    setTimeout(() => {
      setStatus('success');
      playSuccessSound();
      setFormState({ name: '', email: '', message: '' });
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f3ff', '#ff007f', '#b026ff']
      });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  return (
    <section className="section" id="contact" style={{ padding: '6rem 0' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Section Heading */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '0.05em' }}>
            <SplitText text="Contact Me" duration={0.5} stagger={0.03} />
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '0.9rem' }}>
            Feel free to reach out for collaborations, project inquiries, or software discussions.
          </p>
        </div>

        {/* Organized Equal-Height Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'stretch', // Stretches columns to match heights!
            width: '100%',
          }}
        >
          {/* Left Column: Contact Details (Balanced Height) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <div
              className="glass"
              style={{
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%', // Match height of parent flex/grid
                minHeight: '420px',
                border: '1px solid var(--card-border)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                  Contact Details
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                  If you would like to collaborate on a project, discuss new opportunities, or ask questions, feel free to drop a message or reach out directly.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '8px',
                      background: 'rgba(0, 243, 255, 0.08)',
                      border: '1px solid rgba(0, 243, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-secondary)',
                    }}
                  >
                    <Mail size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>EMAIL ADDRESS</div>
                    <a href="mailto:vb8146649@gmail.com" className="clickable" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      vb8146649@gmail.com
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '8px',
                      background: 'rgba(255, 0, 127, 0.08)',
                      border: '1px solid rgba(255, 0, 127, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>LOCATION</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                      New Delhi, India (Delhi Technological University)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Transmission Form (Balanced Height) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <div
              className="glass"
              style={{
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
                minHeight: '420px',
                border: '1px solid var(--card-border)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              }}
            >
              {status === 'success' ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    textAlign: 'center',
                    padding: '2rem 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.2rem',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <CheckCircle size={52} style={{ color: '#10b981' }} />
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
                    Message Sent!
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '280px', margin: '0 auto', fontSize: '0.8rem', lineHeight: '1.6' }}>
                    Thank you! Your message has been sent successfully. I will get back to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      playClickSound();
                      setStatus('idle');
                    }}
                    onMouseEnter={playHoverSound}
                    className="btn btn-secondary clickable"
                    style={{ marginTop: '1rem', fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', height: '100%', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {/* Name */}
                    <div className="form-group">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        onFocus={playClickSound}
                        onMouseEnter={playHoverSound}
                        className="form-input"
                        placeholder=" "
                        required
                        disabled={status === 'sending'}
                      />
                      <label htmlFor="name" className="form-label" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.75rem' }}>Your Name</label>
                    </div>

                    {/* Email */}
                    <div className="form-group">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        onFocus={playClickSound}
                        onMouseEnter={playHoverSound}
                        className="form-input"
                        placeholder=" "
                        required
                        disabled={status === 'sending'}
                      />
                      <label htmlFor="email" className="form-label" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.75rem' }}>Your Email</label>
                    </div>

                    {/* Message */}
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        onFocus={playClickSound}
                        onMouseEnter={playHoverSound}
                        className="form-input"
                        placeholder=" "
                        rows={4}
                        required
                        disabled={status === 'sending'}
                        style={{ resize: 'none', fontFamily: 'inherit' }}
                      />
                      <label htmlFor="message" className="form-label" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.75rem' }}>Your Message</label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary clickable"
                    onMouseEnter={playHoverSound}
                    onClick={playClickSound}
                    disabled={status === 'sending'}
                    style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', borderRadius: '8px' }}
                  >
                    {status === 'sending' ? (
                      <span className="spinner" />
                    ) : (
                      <>
                        Send Message <Send size={14} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

      </div>
      
      <style>{`
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};
