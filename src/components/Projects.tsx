import React from 'react';
import { motion } from 'framer-motion';
import { SplitText } from './SplitText';
import { TiltCard } from './TiltCard';
import { ExternalLink, Folder, Activity, ShieldCheck } from 'lucide-react';
import { GithubIcon } from './Icons';
import { playHoverSound, playClickSound, playSuccessSound } from '../utils/audio';

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  telemetryType: 'compliance' | 'waveform' | 'cache' | 'matrix';
}

export const Projects: React.FC = () => {
  // Predefined list of real projects from Vishal's resume
  const projectList: ProjectItem[] = [
    {
      id: 'yt-playlist',
      title: 'YouTube Playlist Finder Extension',
      category: 'REACT & FLASK',
      description: 'A Chrome extension built with React and Vite backed by a Flask API that retrieves and displays public playlists containing the currently viewed video, eliminating manual search effort.',
      tags: ['React', 'Vite', 'Flask', 'Python', 'YouTube API'],
      githubUrl: 'https://github.com/vb8146649',
      liveUrl: 'https://github.com/vb8146649',
      telemetryType: 'compliance',
    },
    {
      id: 'yt-bot',
      title: 'AI-Powered YouTube Bot',
      category: 'PYTHON & SELENIUM',
      description: 'An automated video creation and publishing pipeline orchestrating Selenium, FFmpeg, and AI-driven visuals and text-to-speech. Slashes content creation time by 98% (saving 8 hours weekly).',
      tags: ['Python', 'Selenium', 'FFmpeg', 'AI Generation', 'YouTube API'],
      githubUrl: 'https://github.com/vb8146649',
      liveUrl: 'https://github.com/vb8146649',
      telemetryType: 'waveform',
    },
    {
      id: 'vr-game',
      title: 'FPS Shooter VR Game',
      category: 'C++ & OPENGL',
      description: 'A first-person virtual reality shooter game developed in C++ using Raylib and OpenGL, featuring real-time rendering, procedurally generated terrains and enemies, and custom 3D controls.',
      tags: ['C++', 'Raylib', 'OpenGL', 'Procedural Animation'],
      githubUrl: 'https://github.com/vb8146649',
      liveUrl: 'https://github.com/vb8146649',
      telemetryType: 'cache',
    },
    {
      id: 'cv-track',
      title: 'Robotics Computer Vision Track',
      category: 'OPENCV & PYTHON',
      description: 'Led a sub-team of 5 at the Society of Robotics, DTU, developing computer vision systems for the annual tech fest. Boosted robot detection accuracy by 20% using OpenCV and Python.',
      tags: ['OpenCV', 'Python', 'Computer Vision', 'Robotics Track'],
      githubUrl: 'https://github.com/vb8146649',
      liveUrl: 'https://github.com/vb8146649',
      telemetryType: 'matrix',
    }
  ];

  return (
    <section 
      className="section" 
      id="projects" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        boxSizing: 'border-box',
      }}
    >
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'center' }}>
        
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center' }}
        >
          <h2 style={{ marginBottom: '1rem' }}>
            <SplitText text="Featured Projects" duration={0.5} stagger={0.03} />
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: 'clamp(0.85rem, 2vw, 1rem)', lineHeight: 1.6 }}>
            A selection of software engineering projects covering web extensions, automation pipelines, VR graphics, and computer vision.
          </p>
        </motion.div>



        {/* Scalable Project Card Flex Row (Horizontal Scroll) */}
        <div
          className="projects-scrollbar"
          style={{
            display: 'flex',
            gap: '1rem',
            width: '100%',
            overflowX: 'auto',
            padding: '0.5rem 0.25rem',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            flex: 1,
            overflow: 'hidden',
          }}
        >
          {projectList.map((project) => (
            <div 
              key={project.id} 
              style={{ 
                flex: '0 0 280px', 
                scrollSnapAlign: 'start', 
                height: '100%' 
              }}
            >
              <TiltCard maxTilt={8}>
                <div className="premium-card">
                  {/* Header Icons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Folder size={16} />
                      <span style={{ fontSize: '0.55rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                        {project.category}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="clickable hover-accent"
                        onMouseEnter={playHoverSound}
                        onClick={playClickSound}
                        style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}
                      >
                        <GithubIcon size={14} />
                      </a>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="clickable hover-accent"
                        onMouseEnter={playHoverSound}
                        onClick={playClickSound}
                        style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ marginTop: '0.6rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                      {project.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', lineHeight: '1.4', flex: 1 }}>
                      {project.description}
                    </p>
                  </div>

                  {/* Simulated Telemetry Previews inside Cards */}
                  <div
                    style={{
                      margin: '0.5rem 0',
                      background: 'rgba(0,0,0,0.3)',
                      borderRadius: '6px',
                      padding: '0.4rem 0.6rem',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.6rem',
                      border: '1px solid rgba(255,255,255,0.03)',
                    }}
                  >
                    {project.telemetryType === 'compliance' && (
                      <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <ShieldCheck size={11} />
                        <span>extension stats: 21 installs | 46+ views</span>
                      </div>
                    )}

                    {project.telemetryType === 'waveform' && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--accent-secondary)' }}>pipeline status: automated [98% faster]</span>
                        <div style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '10px' }}>
                          {Array(8).fill(0).map((_, i) => (
                            <motion.div
                              key={i}
                              animate={{ height: [3, 10, 3] }}
                              transition={{ repeat: Infinity, duration: 0.5 + i * 0.1, ease: 'easeInOut' }}
                              style={{ width: '2px', backgroundColor: 'var(--accent-secondary)', borderRadius: '1.0px' }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {project.telemetryType === 'cache' && (
                      <div style={{ color: '#10b981', display: 'flex', justifyContent: 'space-between' }}>
                        <span>frame rate: 60+ fps</span>
                        <span style={{ color: 'var(--text-secondary)' }}>opengl & raylib</span>
                      </div>
                    )}

                    {project.telemetryType === 'matrix' && (
                      <div style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Activity size={11} className="floating" />
                        <span>telemetry: 250+ festival participants [20% boost]</span>
                      </div>
                    )}
                  </div>

                  {/* Tech Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '0.55rem',
                          fontFamily: 'JetBrains Mono, monospace',
                          color: 'var(--accent-secondary)',
                          background: 'rgba(6, 182, 212, 0.05)',
                          padding: '0.08rem 0.35rem',
                          borderRadius: '3px',
                          border: '1px solid rgba(6, 182, 212, 0.1)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                </div>
              </TiltCard>
            </div>
          ))}
        </div>

      </div>
      <style>{`
        .hover-accent:hover {
          color: var(--accent-primary) !important;
        }
      `}</style>
    </section>
  );
};
