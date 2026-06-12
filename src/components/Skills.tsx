import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SplitText } from './SplitText';
import { playHoverSound, playClickSound, playSuccessSound } from '../utils/audio';
import { 
  Terminal, 
  Shield, 
  Cpu, 
  Database, 
  Play, 
  Pause, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Compass 
} from 'lucide-react';

interface PlanetInfo {
  id: string;
  name: string;
  discipline: string;
  color: string;
  radiusX: number;
  radiusY: number;
  inclination: number;
  orbitDuration: number;
  size: number;
  skills: string[];
  icon: React.ReactNode;
  fact: string;
}

export const Skills: React.FC = () => {
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetInfo | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetInfo | null>(null);
  
  // Interactive view states
  const [systemTilt, setSystemTilt] = useState(60); // pitch (degrees)
  const [systemYaw, setSystemYaw] = useState(-15); // yaw (degrees)
  const [zoom, setZoom] = useState(1.0); // zoom scale factor
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0); // speed multiplier (0 = paused)
  const [mobileScale, setMobileScale] = useState(1.0); // responsive scaling factor
  const [isDragging, setIsDragging] = useState(false);

  // Drag coordinates reference
  const dragStartRef = useRef({ x: 0, y: 0 });
  const anglesRef = useRef([0, 0, 0, 0]);
  const [angles, setAngles] = useState([0, 0, 0, 0]);

  const containerRef = useRef<HTMLDivElement>(null);

  const planets: PlanetInfo[] = [
    {
      id: 'frontend',
      name: 'Mercury',
      discipline: 'Frontend & UI',
      color: '#00f3ff', // Cyan
      radiusX: 75,
      radiusY: 65,
      inclination: 7.0,
      orbitDuration: 8,
      size: 16,
      icon: <Cpu size={16} />,
      fact: 'Fastest orbit. Transmits responsive UI frameworks and styling constructs.',
      skills: ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS', 'HTML & CSS', 'Material UI']
    },
    {
      id: 'backend',
      name: 'Venus',
      discipline: 'Systems & Languages',
      color: '#b026ff', // Purple
      radiusX: 125,
      radiusY: 110,
      inclination: 3.4,
      orbitDuration: 16,
      size: 22,
      icon: <Terminal size={16} />,
      fact: 'Heavy atmosphere. Handles systems programming, backend architectures, and core logic.',
      skills: ['Python', 'C++', 'C', 'SQL', 'OOP', 'Data Structures & Algorithms']
    },
    {
      id: 'devops',
      name: 'Earth',
      discipline: 'Backend & Automation',
      color: '#10b981', // Green
      radiusX: 180,
      radiusY: 160,
      inclination: 0.0,
      orbitDuration: 28,
      size: 26,
      icon: <Database size={16} />,
      fact: 'Stable life support. Hosts servers, database models, and automated bots.',
      skills: ['Node.js', 'FastAPI', 'FFmpeg', 'Selenium', 'Git & CI/CD', 'Jest Testing']
    },
    {
      id: 'aiml',
      name: 'Mars',
      discipline: 'Robotics & CV',
      color: '#f59e0b', // Amber
      radiusX: 235,
      radiusY: 215,
      inclination: 1.85,
      orbitDuration: 44,
      size: 20,
      icon: <Shield size={16} />,
      fact: 'Telemetry diagnostics. Powers computer vision tracks and autonomous robot targeting.',
      skills: ['OpenCV', 'NumPy', 'Pandas', 'Computer Vision Algorithms', 'Robotics Systems']
    }
  ];

  // Window resize scale adjustment
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setMobileScale(0.55);
      } else if (window.innerWidth < 768) {
        setMobileScale(0.75);
      } else {
        setMobileScale(1.0);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Custom wheel zoom listener (non-passive preventDefault)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * -0.0015;
      setZoom((prev) => Math.max(0.5, Math.min(2.0, prev + delta)));
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Animation loop updating orbital angles
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const update = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (playbackSpeed > 0) {
        anglesRef.current = anglesRef.current.map((angle, index) => {
          const planet = planets[index];
          const deltaAngle = (2 * Math.PI / planet.orbitDuration) * delta * playbackSpeed;
          return (angle + deltaAngle) % (2 * Math.PI);
        });
        setAngles([...anglesRef.current]);
      }

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [playbackSpeed]);

  // Mouse drag handlers for Pitch/Yaw rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    setSystemYaw((prev) => prev + dx * 0.45);
    setSystemTilt((prev) => Math.max(10, Math.min(85, prev - dy * 0.45)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    setSystemYaw((prev) => prev + dx * 0.45);
    setSystemTilt((prev) => Math.max(10, Math.min(85, prev - dy * 0.45)));
  };

  // Preset Views
  const trigger3DView = () => {
    playSuccessSound();
    setSystemTilt(60);
    setSystemYaw(-15);
  };

  const trigger2DView = () => {
    playSuccessSound();
    setSystemTilt(0);
    setSystemYaw(0);
  };

  const triggerReset = () => {
    playClickSound();
    setSystemTilt(60);
    setSystemYaw(-15);
    setZoom(1.0);
    setPlaybackSpeed(1.0);
    setSelectedPlanet(null);
  };

  const activeInfo = hoveredPlanet || selectedPlanet;

  return (
    <section 
      className="section" 
      id="skills" 
      style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        boxSizing: 'border-box' 
      }}
    >
      
      {/* Decorative cosmic stars backdrop */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '100%', justifyContent: 'center' }}>
        
        {/* Section Heading - positioned as overlay */}
        <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 5, textAlign: 'left', maxWidth: '45%' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            <SplitText text="Technical Arsenal" duration={0.5} stagger={0.03} />
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5 }}>
            Drag to orbit, scroll to zoom.
          </p>
        </div>

        {/* Full page Space Canvas & Telemetry Scan HUD */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Center: Interactive Space Canvas & Orbit Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', height: '100%', justifyContent: 'center' }}>
            
            {/* Viewport Dragging area - Full page */}
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                borderRadius: '0',
                border: 'none',
                boxShadow: 'none',
                overflow: 'hidden',
                cursor: isDragging ? 'grabbing' : 'grab',
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
            >
              {/* Ecliptic Grid Plane - rotates with dragging */}
              <div
                style={{
                  position: 'absolute',
                  width: '600px',
                  height: '600px',
                  backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  transform: `rotateX(${systemTilt}deg) rotateZ(${systemYaw}deg) scale(${zoom * mobileScale * 0.85})`,
                  transformStyle: 'preserve-3d',
                  pointerEvents: 'none',
                  opacity: 0.8,
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                }}
              />

              {/* Solar System Core - Rotates according to Pitch/Yaw dragging */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `rotateX(${systemTilt}deg) rotateZ(${systemYaw}deg) scale(${zoom * mobileScale * 0.85})`,
                  transformStyle: 'preserve-3d',
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                }}
              >
                {/* The Sun (Center Core) */}
                <div
                  style={{
                    position: 'absolute',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #ff007f 40%, #8b5cf6 85%, #000000 100%)',
                    boxShadow: '0 0 35px rgba(139, 92, 246, 0.85), 0 0 15px #ff007f',
                    border: '1.5px solid rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    // Billboard effect (inverse rotations)
                    transform: `rotateZ(${-systemYaw}deg) rotateX(${-systemTilt}deg)`,
                    pointerEvents: 'none',
                  }}
                >
                  <span style={{ fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.12em', color: '#fff', textAlign: 'center', fontFamily: 'Orbitron, sans-serif' }}>
                    ARSENAL
                  </span>
                </div>

                {/* Planets and Elliptic Inclined Orbits */}
                {planets.map((planet, index) => {
                  const angle = angles[index];
                  const localX = Math.cos(angle) * planet.radiusX;
                  const localY = Math.sin(angle) * planet.radiusY;
                  const incRad = planet.inclination * Math.PI / 180;
                  
                  // Projected positions relative to the orbit plane tilt
                  const x_3d = localX;
                  const y_3d = localY * Math.cos(incRad);
                  const z_3d = localY * Math.sin(incRad);
                  
                  const isHovered = hoveredPlanet?.id === planet.id;
                  const isSelected = selectedPlanet?.id === planet.id;
                  const isActive = isHovered || isSelected;

                  return (
                    <React.Fragment key={planet.id}>
                      {/* Tilted Elliptic Orbit Ring (Centered via calc) */}
                      <div
                        style={{
                          position: 'absolute',
                          width: `${planet.radiusX * 2}px`,
                          height: `${planet.radiusY * 2}px`,
                          left: `calc(50% - ${planet.radiusX}px)`,
                          top: `calc(50% - ${planet.radiusY}px)`,
                          borderRadius: '50%',
                          border: `1.5px ${isActive ? 'solid' : 'dashed'} ${isActive ? planet.color : 'rgba(255,255,255,0.06)'}`,
                          transform: `rotateX(${planet.inclination}deg)`,
                          transformStyle: 'preserve-3d',
                          pointerEvents: 'none',
                          boxShadow: isActive ? `0 0 12px rgba(${planet.color === '#00f3ff' ? '0,243,255' : planet.color === '#b026ff' ? '176,38,255' : planet.color === '#10b981' ? '16,185,129' : '245,158,11'}, 0.08)` : 'none',
                          transition: 'border-color 0.2s, border-style 0.2s',
                        }}
                      />
                      
                      {/* Invisible Hover Target Wrapper (Larger Collision block) */}
                      <div
                        onMouseEnter={() => {
                          playHoverSound();
                          setHoveredPlanet(planet);
                        }}
                        onMouseLeave={() => {
                          setHoveredPlanet(null);
                        }}
                        onClick={() => {
                          playSuccessSound();
                          setSelectedPlanet(selectedPlanet?.id === planet.id ? null : planet);
                        }}
                        style={{
                          position: 'absolute',
                          width: `${planet.size + 40}px`, // Increased to 40px padding for better hover detection
                          height: `${planet.size + 40}px`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          zIndex: 20,
                          // Combine 3D projection & billboard inverse rotation
                          transform: `translate3d(${x_3d}px, ${y_3d}px, ${z_3d}px) rotateZ(${-systemYaw}deg) rotateX(${-systemTilt}deg)`,
                          transformStyle: 'preserve-3d',
                          left: `calc(50% - ${(planet.size + 40) / 2}px)`,
                          top: `calc(50% - ${(planet.size + 40) / 2}px)`,
                          backgroundColor: 'transparent',
                        }}
                      >
                        {/* Billboarded Planetary Sphere */}
                        <div
                          style={{
                            width: `${planet.size}px`,
                            height: `${planet.size}px`,
                            borderRadius: '50%',
                            background: `radial-gradient(circle at 30% 30%, #ffffff 0%, ${planet.color} 50%, #000000 100%)`,
                            boxShadow: isSelected 
                              ? `0 0 20px ${planet.color}, 0 0 0 3px #ffffff` 
                              : isHovered 
                                ? `0 0 20px ${planet.color}` 
                                : `0 0 10px ${planet.color}`,
                            position: 'relative',
                            transition: 'box-shadow 0.2s, border 0.2s',
                          }}
                        >
                          {/* Target reticle surrounding selected planet */}
                          {isSelected && (
                            <div
                              style={{
                                position: 'absolute',
                                width: `${planet.size + 14}px`,
                                height: `${planet.size + 14}px`,
                                border: `1.5px dashed ${planet.color}`,
                                borderRadius: '50%',
                                top: '-8px',
                                left: '-8px',
                                animation: 'spin 12s linear infinite',
                                boxShadow: `0 0 10px ${planet.color}`,
                                pointerEvents: 'none',
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Tiny watermarked view orientation display in corner */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '0.8rem',
                  left: '1rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.58rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.1rem',
                  zIndex: 20,
                  pointerEvents: 'none',
                }}
              >
                <span>PITCH: {Math.round(systemTilt)}°</span>
                <span>YAW: {Math.round(systemYaw)}°</span>
                <span>ZOOM: {zoom.toFixed(2)}x</span>
              </div>
            </div>

            {/* Observatory Controls Panel (Bottom Center) */}
            <div
              className="glass"
              style={{
                width: 'auto',
                maxWidth: 'min(400px, 90vw)',
                padding: '0.6rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--card-border)',
                borderRadius: '12px',
                gap: '0.8rem',
                flexWrap: 'wrap',
                position: 'absolute',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
              }}
            >
              {/* Reset View */}
              <button
                onClick={triggerReset}
                onMouseEnter={playHoverSound}
                className="clickable btn-secondary"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
                title="Reset viewpoint coordinates"
              >
                <RotateCcw size={11} /> Reset
              </button>

              {/* View Angles (3D vs 2D) */}
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <button
                  onClick={trigger3DView}
                  onMouseEnter={playHoverSound}
                  style={{
                    backgroundColor: systemTilt !== 0 ? 'rgba(139,92,246,0.15)' : 'transparent',
                    border: '1px solid var(--card-border)',
                    borderRadius: '4px',
                    color: systemTilt !== 0 ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontSize: '0.65rem',
                    padding: '0.25rem 0.5rem',
                    cursor: 'pointer',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                  }}
                >
                  <Compass size={11} /> 3D
                </button>
                <button
                  onClick={trigger2DView}
                  onMouseEnter={playHoverSound}
                  style={{
                    backgroundColor: systemTilt === 0 ? 'rgba(6,182,212,0.15)' : 'transparent',
                    border: '1px solid var(--card-border)',
                    borderRadius: '4px',
                    color: systemTilt === 0 ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                    fontSize: '0.65rem',
                    padding: '0.25rem 0.5rem',
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  2D PLANE
                </button>
              </div>

              {/* Speed modulation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <button
                  onClick={() => {
                    playClickSound();
                    setPlaybackSpeed((prev) => (prev === 0 ? 1.0 : 0));
                  }}
                  onMouseEnter={playHoverSound}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--card-border)',
                    borderRadius: '4px',
                    color: 'var(--text-primary)',
                    padding: '3px 5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title={playbackSpeed === 0 ? 'Resume orbital simulation' : 'Pause orbital simulation'}
                >
                  {playbackSpeed === 0 ? <Play size={10} /> : <Pause size={10} />}
                </button>

                <div style={{ display: 'flex', border: '1px solid var(--card-border)', borderRadius: '4px', overflow: 'hidden' }}>
                  {[0.5, 1.0, 2.0, 5.0].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => {
                        playClickSound();
                        setPlaybackSpeed(spd);
                      }}
                      onMouseEnter={playHoverSound}
                      style={{
                        backgroundColor: playbackSpeed === spd ? 'rgba(139,92,246,0.15)' : 'transparent',
                        border: 'none',
                        color: playbackSpeed === spd ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        fontSize: '0.58rem',
                        padding: '0.25rem 0.4rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Zoom Buttons */}
              <div style={{ display: 'flex', gap: '0.2rem' }}>
                <button
                  onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.15))}
                  onMouseEnter={playHoverSound}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--card-border)',
                    borderRadius: '4px',
                    color: 'var(--text-secondary)',
                    padding: '3px 5px',
                    cursor: 'pointer',
                  }}
                >
                  <ZoomOut size={10} />
                </button>
                <button
                  onClick={() => setZoom((prev) => Math.min(2.0, prev + 0.15))}
                  onMouseEnter={playHoverSound}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--card-border)',
                    borderRadius: '4px',
                    color: 'var(--text-secondary)',
                    padding: '3px 5px',
                    cursor: 'pointer',
                  }}
                >
                  <ZoomIn size={10} />
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Holographic Skills Scan HUD (Positioned Top-Right) */}
          <div
            className="glass"
            style={{
              width: 'min(350px, 35vw)',
              maxHeight: 'min(450px, 40vh)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid var(--card-border)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              overflow: 'hidden',
              minHeight: '320px',
              zIndex: 10,
            }}
          >
            {/* Holographic neon scanlines backdrop */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(255, 255, 255, 0.02) 50%)',
                backgroundSize: '100% 4px',
                zIndex: 0,
                pointerEvents: 'none',
              }}
            />

            <AnimatePresence mode="wait">
              {activeInfo ? (
                <motion.div
                  key={activeInfo.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{ zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}
                >
                  <div>
                    {/* Heading tag */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.15em', fontFamily: 'Orbitron, sans-serif' }}>
                        ORBIT LOCK ACTIVE
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: activeInfo.color, fontSize: '0.65rem', fontWeight: 600 }}>
                        {activeInfo.icon} {activeInfo.name.toUpperCase()}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.2rem', fontFamily: 'Orbitron, sans-serif' }}>
                      {activeInfo.discipline}
                    </h3>
                    <div style={{ width: '30px', height: '2px', backgroundColor: activeInfo.color, marginBottom: '0.6rem' }} />
                    
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', lineHeight: '1.5', marginBottom: '0.8rem', fontStyle: 'italic', fontFamily: 'JetBrains Mono, monospace' }}>
                      &gt; "{activeInfo.fact}"
                    </p>

                    {/* Skill array grid */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {activeInfo.skills.map((skill, index) => (
                        <div key={skill} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-primary)' }}>
                            <span>{skill}</span>
                            <span style={{ color: activeInfo.color }}>{92 - index * 5}%</span>
                          </div>
                          {/* Skill bar */}
                          <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '1.5px', overflow: 'hidden' }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${92 - index * 5}%` }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                              style={{ height: '100%', backgroundColor: activeInfo.color, borderRadius: '1.5px' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '0.6rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>
                      OBSERVATORY SYNCED
                    </span>
                    <button
                      onClick={() => {
                        playClickSound();
                        setSelectedPlanet(null);
                        setHoveredPlanet(null);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: activeInfo.color,
                        fontSize: '0.6rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Clear Scan
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', zIndex: 1 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '0.6rem', color: '#ff007f', letterSpacing: '0.12em', fontWeight: 700, fontFamily: 'Orbitron, sans-serif' }}>
                        SCANNING TRACKS...
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.6rem', fontFamily: 'Orbitron, sans-serif' }}>
                      Observed Telemetry
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', lineHeight: '1.6', fontFamily: 'JetBrains Mono, monospace' }}>
                      &gt; AWAITING ORBITAL LOCK.
                      <br />
                      &gt; Hover over or click a planet in the viewport grid to launch a scanning session.
                      <br /><br />
                      &gt; Planetary Legend:
                      <br />
                      &nbsp;&nbsp;• Mercury : Frontend UI & Styling
                      <br />
                      &nbsp;&nbsp;• Venus   : Core Languages & Systems
                      <br />
                      &nbsp;&nbsp;• Earth   : Backend Engines & Automation
                      <br />
                      &nbsp;&nbsp;• Mars    : Robotics CV Tracks
                    </p>
                  </div>

                  <div
                    style={{
                      border: '1px dashed rgba(255,255,255,0.08)',
                      padding: '0.6rem',
                      textAlign: 'center',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.62rem',
                      color: 'var(--accent-secondary)',
                      backgroundColor: 'rgba(0,243,255,0.02)',
                    }}
                  >
                    OBSERVATORY SYSTEM CONNECTED
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};
