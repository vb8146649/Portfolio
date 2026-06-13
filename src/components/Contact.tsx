import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SplitText } from './SplitText';
import { Send, CheckCircle, Mail, MapPin } from 'lucide-react';
import { SpaceInvaders } from './SpaceInvaders';
import confetti from 'canvas-confetti';

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
    <section className="section" id="contact">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}
        >

          {/* Section Heading */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <h2 style={{ marginBottom: '1rem' }}>
              <SplitText text="Contact Me" duration={0.5} stagger={0.03} />
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: 'clamp(0.85rem, 2vw, 1rem)', lineHeight: 1.6 }}>
              Feel free to reach out for collaborations, project inquiries, or software discussions.
            </p>
          </motion.div>

          {/* Main Contact Section Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
              alignItems: 'stretch',
              width: '100%',
            }}
          >
            {/* Left Column: Retro Arcade Space Invaders Game */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <div 
                className="premium-card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%', 
                  justifyContent: 'center',
                  padding: '1.5rem',
                }}
              >
                <SpaceInvaders />
              </div>
            </motion.div>

            {/* Right Column: Contact Details (Top) & Transmission Form (Bottom) */}
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.5rem',
                height: '100%',
                justifyContent: 'space-between',
              }}
            >
              {/* Contact Details Card */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="premium-card" style={{ padding: '1.2rem 1.5rem' }}>
                  <div className="card-header" style={{ marginBottom: '0.8rem', paddingBottom: '0.4rem', borderBottom: '1px solid rgba(var(--accent-rgb), 0.1)' }}>
                    <h3 className="card-title" style={{ fontSize: '1.1rem', margin: 0 }}>Contact Details</h3>
                  </div>
                  <div className="card-content" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      If you would like to collaborate, discuss opportunities, or ask questions, feel free to reach out.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '0.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <Mail size={18} style={{ color: 'var(--accent-secondary)', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Email</div>
                          <a href="mailto:vb8146649@gmail.com" className="clickable" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            vb8146649@gmail.com
                          </a>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <MapPin size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Location</div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                            New Delhi, India
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Message/Transmission Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
              >
                <div className="premium-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1.5rem' }}>
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
                          setStatus('idle');
                        }}
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
        </motion.div>

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
