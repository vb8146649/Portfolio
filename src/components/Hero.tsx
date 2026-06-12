import React from 'react';
import { motion } from 'framer-motion';
import { SplitText } from './SplitText';
import { ScrambledText } from './ScrambledText';
import { TiltCard } from './TiltCard';
import { ArrowRight, Cpu } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { playHoverSound, playClickSound } from '../utils/audio';

export const Hero: React.FC = () => {
  return (
    <section 
      className="section hero-section" 
      id="home" 
      style={{ 
        display: 'flex', 
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'url(/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay for readability and theme depth */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(11, 15, 25, 0.75) 0%, rgba(12, 18, 35, 0.8) 50%, rgba(11, 15, 25, 0.75) 100%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Ambient glow accents */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(100px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0, 243, 255, 0.08) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(80px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div 
          className="hero-grid"
          style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1.2fr', 
          gap: 'clamp(2rem, 4vw, 3rem)', 
          alignItems: 'center',
        }}>
          
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Cpu size={16} style={{ color: 'var(--accent-primary)' }} className="floating" />
              <span
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-secondary)',
                }}
              >
                SOFTWARE ENGINEERING PORTFOLIO
              </span>
            </div>

            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1 }}>
              <SplitText
                text="Building Scalable"
                className="gradient-text"
                duration={0.6}
                stagger={0.03}
              />
              <br />
              <span style={{ fontWeight: 900, letterSpacing: '0.02em' }}>APPLICATIONS</span>
            </h1>

            <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 500, fontFamily: 'JetBrains Mono, monospace' }}>
              I am a <ScrambledText text="Software Engineer" speed={40} className="gradient-text" /> student at Delhi Technological University.
            </div>

            <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', fontSize: '0.85rem', lineHeight: '1.7' }}>
              Specializing in full-stack development, computer vision automation, and graphics programming. Active competitive programmer and winner of Smart India Hackathon 2024.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <a href="#projects" className="btn btn-primary clickable" onMouseEnter={playHoverSound} onClick={playClickSound} style={{ borderRadius: '8px' }}>
                View Projects <ArrowRight size={16} />
              </a>
              <a href="#contact" className="btn btn-secondary clickable" onMouseEnter={playHoverSound} onClick={playClickSound} style={{ borderRadius: '8px' }}>
                Get In Touch
              </a>
            </div>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
              <a href="https://github.com/vb8146649" target="_blank" rel="noopener noreferrer" className="clickable" onMouseEnter={playHoverSound} onClick={playClickSound} style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>
                <GithubIcon size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="clickable" onMouseEnter={playHoverSound} onClick={playClickSound} style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>
                <LinkedinIcon size={20} />
              </a>
            </div>
          </motion.div>

          {/* Right Column - Flashy HUD Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <TiltCard maxTilt={12}>
              <div
                className="glass"
                style={{
                  width: '320px',
                  height: '420px',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '2rem',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                  border: '1px solid var(--card-border)',
                }}
              >
                {/* Background glowing gradients inside card */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-20%',
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle, var(--accent-primary) 0%, rgba(0,0,0,0) 70%)',
                    opacity: 0.35,
                    filter: 'blur(30px)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-20%',
                    left: '-20%',
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle, var(--accent-secondary) 0%, rgba(0,0,0,0) 70%)',
                    opacity: 0.35,
                    filter: 'blur(30px)',
                  }}
                />

                {/* Card Content */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                  <div style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Orbitron, sans-serif' }}>
                    DEVELOPER STATUS
                  </div>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-secondary)', boxShadow: '0 0 8px var(--accent-secondary)' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 2 }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--accent-primary)' }}>const developer = &#123;</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', paddingLeft: '1rem', color: 'var(--text-primary)' }}>status: "Active",</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', paddingLeft: '1rem', color: 'var(--text-primary)' }}>gpa: "8.86/10.0",</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', paddingLeft: '1rem', color: 'var(--text-primary)' }}>specialty: "SoftwareEng"</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--accent-primary)' }}>&#125;;</span>
                </div>

                <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', zIndex: 2 }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '1.2rem',
                      fontWeight: 800,
                    }}
                  >
                    V
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', fontFamily: 'Orbitron, sans-serif' }}>VISHAL</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>Software Engineer @ DTU</div>
                  </div>
                </div>

              </div>
            </TiltCard>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};
