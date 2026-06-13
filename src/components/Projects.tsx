import React from 'react';
import { motion } from 'framer-motion';
import { SplitText } from './SplitText';
import { TiltCard } from './TiltCard';
import { ExternalLink, Folder, ChevronLeft, ChevronRight } from 'lucide-react';
import { GithubIcon } from './Icons';

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  imgUrl: string;
  avgColor: string;
  avgColorRgb: string;
}

export const Projects: React.FC = () => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350; // card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const projectList: ProjectItem[] = [
    {
      id: 'yt-playlist',
      title: 'YouTube Playlist Finder Extension',
      category: 'REACT & FLASK',
      description: 'A Chrome extension built with React and Vite backed by a Flask API that retrieves and displays public playlists containing the currently viewed video, eliminating manual search effort.',
      tags: ['React', 'Vite', 'Flask', 'Python', 'YouTube API'],
      githubUrl: 'https://github.com/vb8146649',
      liveUrl: 'https://github.com/vb8146649',
      imgUrl: '/yt-playlist.png',
      avgColor: '#a78bfa',
      avgColorRgb: '167, 139, 250',
    },
    {
      id: 'yt-bot',
      title: 'AI-Powered YouTube Bot',
      category: 'PYTHON & SELENIUM',
      description: 'An automated video creation and publishing pipeline orchestrating Selenium, FFmpeg, and AI-driven visuals and text-to-speech. Slashes content creation time by 98% (saving 8 hours weekly).',
      tags: ['Python', 'Selenium', 'FFmpeg', 'AI Generation', 'YouTube API'],
      githubUrl: 'https://github.com/vb8146649',
      liveUrl: 'https://github.com/vb8146649',
      imgUrl: '/yt-bot.png',
      avgColor: '#22d3ee',
      avgColorRgb: '34, 211, 238',
    },
    {
      id: 'vr-game',
      title: 'FPS Shooter VR Game',
      category: 'C++ & OPENGL',
      description: 'A first-person virtual reality shooter game developed in C++ using Raylib and OpenGL, featuring real-time rendering, procedurally generated terrains and enemies, and custom 3D controls.',
      tags: ['C++', 'Raylib', 'OpenGL', 'Procedural Animation'],
      githubUrl: 'https://github.com/vb8146649',
      liveUrl: 'https://github.com/vb8146649',
      imgUrl: '/vr-game.png',
      avgColor: '#34d399',
      avgColorRgb: '52, 211, 153',
    },
    {
      id: 'cv-track',
      title: 'Robotics Computer Vision Track',
      category: 'OPENCV & PYTHON',
      description: 'Led a sub-team of 5 at the Society of Robotics, DTU, developing computer vision systems for the annual tech fest. Boosted robot detection accuracy by 20% using OpenCV and Python.',
      tags: ['OpenCV', 'Python', 'Computer Vision', 'Robotics Track'],
      githubUrl: 'https://github.com/vb8146649',
      liveUrl: 'https://github.com/vb8146649',
      imgUrl: '/cv-track.png',
      avgColor: '#fb923c',
      avgColorRgb: '251, 146, 60',
    },
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
        position: 'relative'
      }}
    >
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'center' }}>

        {/* Entrance Transition wrapper for the entire section */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}
        >
          {/* Section Heading */}
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem' }}>
              <SplitText text="Featured Projects" duration={0.5} stagger={0.03} />
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: 'clamp(0.85rem, 2vw, 1rem)', lineHeight: 1.6 }}>
              A selection of software engineering projects covering web extensions, automation pipelines, VR graphics, and computer vision.
            </p>
          </div>

          {/* Carousel Container with Navigation */}
          <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Left Carousel Button */}
            <button
              onClick={() => scroll('left')}
              style={{
                position: 'absolute',
                left: '0',
                zIndex: 20,
                background: 'rgba(var(--accent-rgb), 0.15)',
                border: '1px solid rgba(var(--accent-rgb), 0.3)',
                color: 'var(--accent-primary)',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              className="carousel-btn clickable"
              title="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Horizontal Scroll Carousel for Custom Cyberpunk Cards */}
            <div
              ref={scrollContainerRef}
              className="projects-scrollbar"
              style={{
                display: 'flex',
                gap: '1.8rem',
                width: '100%',
                overflowX: 'auto',
                overflowY: 'hidden',
                padding: '2.5rem 50px',
                scrollSnapType: 'x proximity',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                flex: 1,
              }}
            >
              {projectList.map((project, index) => (
                <div
                  key={project.id}
                  style={{
                    flex: '0 0 320px',
                    scrollSnapAlign: 'center',
                    height: '440px',
                    position: 'relative',
                  }}
                >
                  <TiltCard maxTilt={8} style={{ height: '100%', width: '100%' }}>
                    {/* CUSTOM CYBERPUNK CARD BODY */}
                    <div
                      style={{
                        height: '440px',
                        width: '300px',
                        background: 'linear-gradient(180deg, #0d1527 0%, #050810 100%)',
                        border: `2px solid ${project.avgColor}`,
                        borderRadius: '12px',
                        padding: '1.2rem',
                        boxShadow: `0 0 20px rgba(${project.avgColorRgb}, 0.15), inset 0 0 15px rgba(${project.avgColorRgb}, 0.05)`,
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        boxSizing: 'border-box',
                        overflow: 'visible',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {/* Top-Left Circular Emblem/Badge */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '-15px',
                          left: '-15px',
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          background: `radial-gradient(circle, #070c18 50%, ${project.avgColor} 100%)`,
                          border: `2px solid ${project.avgColor}`,
                          boxShadow: `0 0 12px ${project.avgColor}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 5,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <span style={{ fontSize: '0.9rem', fontWeight: 900, fontFamily: 'Orbitron, sans-serif', color: '#fff', textShadow: `0 0 5px ${project.avgColor}` }}>
                          {index + 1}
                        </span>
                      </div>

                      {/* Upper Screen: Project PNG Image */}
                      <div
                        style={{
                          height: '110px',
                          width: '100%',
                          backgroundColor: '#03050a',
                          border: `1.5px solid rgba(${project.avgColorRgb}, 0.25)`,
                          borderRadius: '6px',
                          position: 'relative',
                          overflow: 'hidden',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: '0.8rem',
                          boxSizing: 'border-box',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <img
                          src={project.imgUrl}
                          alt={project.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0.85,
                            transition: 'all 0.3s ease',
                          }}
                        />
                        {/* Gradient Overlay */}
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: `linear-gradient(180deg, transparent 40%, rgba(${project.avgColorRgb}, 0.15) 100%)`,
                            pointerEvents: 'none',
                          }}
                        />
                        {/* CRT Scanline pattern overlay */}
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: `linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(${project.avgColorRgb}, 0.08) 50%)`,
                            backgroundSize: '100% 4px',
                            pointerEvents: 'none',
                          }}
                        />
                      </div>

                      {/* Middle Header Banner Bar */}
                      <div
                        style={{
                          width: 'calc(100% + 2.4rem)',
                          marginLeft: '-1.2rem',
                          height: '40px',
                          background: `linear-gradient(90deg, rgba(${project.avgColorRgb}, 0.05) 0%, rgba(${project.avgColorRgb}, 0.25) 50%, rgba(${project.avgColorRgb}, 0.05) 100%)`,
                          borderTop: `2.5px solid ${project.avgColor}`,
                          borderBottom: `2.5px solid ${project.avgColor}`,
                          boxShadow: `0 0 10px rgba(${project.avgColorRgb}, 0.3)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          zIndex: 3,
                          marginBottom: '0.8rem',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {/* Left & Right Glowing Dots */}
                        <div style={{ position: 'absolute', left: '6px', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: project.avgColor, boxShadow: `0 0 6px ${project.avgColor}`, transition: 'all 0.3s ease' }} />
                        <div style={{ position: 'absolute', right: '6px', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: project.avgColor, boxShadow: `0 0 6px ${project.avgColor}`, transition: 'all 0.3s ease' }} />

                        <h3 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 800, fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.08em', textAlign: 'center', margin: 0, padding: '0 12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textShadow: `0 0 5px rgba(${project.avgColorRgb}, 0.5)` }}>
                          {project.title.toUpperCase()}
                        </h3>
                      </div>

                      {/* Lower Body Content */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 2 }}>
                        {/* Description */}
                        <p style={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.85rem',
                          lineHeight: '1.45',
                          fontFamily: 'JetBrains Mono, monospace',
                          margin: '0 0 0.6rem 0',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {project.description}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          {/* Tech Tags */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
                            {project.tags.slice(0, 4).map((tag) => (
                              <span
                                key={tag}
                                style={{
                                  fontSize: '0.72rem',
                                  fontFamily: 'JetBrains Mono, monospace',
                                  color: project.avgColor,
                                  background: `rgba(${project.avgColorRgb}, 0.05)`,
                                  padding: '0.1rem 0.4rem',
                                  borderRadius: '3px',
                                  border: `1px solid rgba(${project.avgColorRgb}, 0.15)`,
                                  transition: 'all 0.3s ease',
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Footer Navigation Links */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid rgba(${project.avgColorRgb}, 0.15)`, paddingTop: '0.5rem', transition: 'all 0.3s ease' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.05em', fontFamily: 'Orbitron, sans-serif' }}>
                              {project.category}
                            </span>
                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="clickable"
                                style={{ color: 'var(--text-secondary)', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = project.avgColor}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                              >
                                <GithubIcon size={14} />
                              </a>
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="clickable"
                                style={{ color: 'var(--text-secondary)', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = project.avgColor}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                              >
                                <ExternalLink size={14} />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Corner Decorative Tech Circles (Bottom Left & Right) */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '-12px',
                          left: '-12px',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: `1.5px solid ${project.avgColor}`,
                          background: '#040710',
                          boxShadow: `0 0 8px rgba(${project.avgColorRgb}, 0.4)`,
                          zIndex: 4,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: `1px dotted ${project.avgColor}`, animation: 'projectsBadgeSpin 8s linear infinite' }} />
                      </div>

                      <div
                        style={{
                          position: 'absolute',
                          bottom: '-12px',
                          right: '-12px',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: `1.5px solid ${project.avgColor}`,
                          background: '#040710',
                          boxShadow: `0 0 8px rgba(${project.avgColorRgb}, 0.4)`,
                          zIndex: 4,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Folder size={12} style={{ color: project.avgColor, transition: 'all 0.3s ease' }} />
                      </div>

                      {/* Bottom Center Status Segment */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '-8px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          display: 'flex',
                          gap: '4px',
                          padding: '2px 8px',
                          background: '#070c18',
                          border: `1.5px solid ${project.avgColor}`,
                          borderRadius: '4px',
                          zIndex: 5,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            style={{
                              width: '6px',
                              height: '6px',
                              background: star <= (index === 0 ? 5 : index === 1 ? 4 : index === 2 ? 4 : 3) ? project.avgColor : 'transparent',
                              border: `1px solid ${project.avgColor}`,
                              transform: 'rotate(45deg)',
                              boxShadow: star <= (index === 0 ? 5 : index === 1 ? 4 : index === 2 ? 4 : 3) ? `0 0 5px ${project.avgColor}` : 'none',
                              transition: 'all 0.3s ease',
                            }}
                          />
                        ))}
                      </div>

                    </div>
                  </TiltCard>
                </div>
              ))}
            </div>

            {/* Right Carousel Button */}
            <button
              onClick={() => scroll('right')}
              style={{
                position: 'absolute',
                right: '0',
                zIndex: 20,
                background: 'rgba(var(--accent-rgb), 0.15)',
                border: '1px solid rgba(var(--accent-rgb), 0.3)',
                color: 'var(--accent-primary)',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              className="carousel-btn clickable"
              title="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>

      </div>
      <style>{`
        .hover-accent:hover {
          color: var(--accent-primary) !important;
        }
        @keyframes projectsBadgeSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};
