import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SplitText } from './SplitText';
import {
  Shield,
  Cpu,
  Database,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Compass,
  FileCode,
  Layers,
  Network
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
  const [showZoomHint, setShowZoomHint] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Interactive view states matching image.png's flat, sweep projection by default
  const [systemTilt, setSystemTilt] = useState(30); // pitch (degrees)
  const [systemYaw, setSystemYaw] = useState(-25); // yaw (degrees)
  const [zoom, setZoom] = useState(1.0); // zoom scale factor
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0); // speed multiplier (0 = paused)
  const [mobileScale, setMobileScale] = useState(1.0); // responsive scaling factor
  const [isDragging, setIsDragging] = useState(false);

  // Drag coordinates reference (8 planets)
  const dragStartRef = useRef({ x: 0, y: 0 });
  const anglesRef = useRef([0, 0, 0, 0, 0, 0, 0, 0]);
  const [angles, setAngles] = useState([0, 0, 0, 0, 0, 0, 0, 0]);

  const containerRef = useRef<HTMLDivElement>(null);

  const planets: PlanetInfo[] = [
    {
      id: 'mercury',
      name: 'Mercury',
      discipline: 'Frontend Foundations',
      color: '#a3a3a3',
      radiusX: 140,
      radiusY: 120,
      inclination: 7.0,
      orbitDuration: 6,
      size: 14,
      icon: <Cpu size={14} />,
      fact: 'Fastest orbital velocity. Processes raw markup, document templates, and semantic structures.',
      skills: ['HTML5 & CSS3', 'JavaScript (ES6+)', 'Flexbox & CSS Grid', 'Semantic Web', 'Responsive Layouts']
    },
    {
      id: 'venus',
      name: 'Venus',
      discipline: 'UI Frameworks',
      color: '#ffd075',
      radiusX: 220,
      radiusY: 180,
      inclination: 3.4,
      orbitDuration: 12,
      size: 20,
      icon: <Layers size={14} />,
      fact: 'High-density components. Powers reactive state hooks and component architectures.',
      skills: ['React.js', 'Next.js', 'Vite & Bundlers', 'State Management', 'Tailwind CSS', 'Material UI']
    },
    {
      id: 'earth',
      name: 'Earth',
      discipline: 'Languages & OOP',
      color: '#4b9cd3',
      radiusX: 300,
      radiusY: 240,
      inclination: 0.0,
      orbitDuration: 20,
      size: 22,
      icon: <FileCode size={14} />,
      fact: 'Life-supporting architecture. Host to native typing structures, algorithms, and compiling loops.',
      skills: ['Python', 'C++', 'C Programming', 'TypeScript', 'Java', 'SQL']
    },
    {
      id: 'mars',
      name: 'Mars',
      discipline: 'CS Fundamentals',
      color: '#e06a3b',
      radiusX: 380,
      radiusY: 300,
      inclination: 1.85,
      orbitDuration: 30,
      size: 18,
      icon: <Shield size={14} />,
      fact: 'Iron-rich core diagnostics. Directs algorithmic scaling, memory tracking, and storage models.',
      skills: ['Data Structures', 'Algorithms', 'Object Oriented Programming', 'DBMS', 'Operating Systems']
    },
    {
      id: 'jupiter',
      name: 'Jupiter',
      discipline: 'Backend Services',
      color: '#d6ae82',
      radiusX: 470,
      radiusY: 370,
      inclination: 1.3,
      orbitDuration: 45,
      size: 40,
      icon: <Database size={14} />,
      fact: 'High gravity and throughput. Organizes server engines, API logic, and non-blocking sockets.',
      skills: ['Node.js & Express', 'FastAPI & Flask', 'REST APIs & GraphQL', 'PostgreSQL & MongoDB', 'Redis Caching']
    },
    {
      id: 'saturn',
      name: 'Saturn',
      discipline: 'DevOps & Cloud',
      color: '#d8b4fe',
      radiusX: 580,
      radiusY: 450,
      inclination: 2.5,
      orbitDuration: 62,
      size: 34,
      icon: <Network size={14} />,
      fact: 'Encircled by rings of automation. Launches scripts, container bundles, and deploy schedules.',
      skills: ['Git & Version Control', 'CI/CD Pipelines', 'Docker Containers', 'AWS Deployment', 'Selenium Automation', 'Bash Scripting']
    },
    {
      id: 'uranus',
      name: 'Uranus',
      discipline: 'Computer Vision & ML',
      color: '#a5f3fc',
      radiusX: 690,
      radiusY: 530,
      inclination: 0.8,
      orbitDuration: 85,
      size: 26,
      icon: <Cpu size={14} />,
      fact: 'Retrograde camera alignment. Runs image matrix calculations, trackers, and training models.',
      skills: ['OpenCV', 'NumPy & Pandas', 'Machine Learning Models', 'Feature Tracking', 'Neural Networks']
    },
    {
      id: 'neptune',
      name: 'Neptune',
      discipline: 'Robotics & Control',
      color: '#60a5fa',
      radiusX: 800,
      radiusY: 610,
      inclination: 1.77,
      orbitDuration: 110,
      size: 24,
      icon: <Compass size={14} />,
      fact: 'Distant icy control loops. Syncs coordinates, hardware paths, and targeting arrays.',
      skills: ['Raylib / OpenGL', 'Robotics Systems', 'Embedded Controls', 'Pathfinding Algorithms', 'C++ Graphics']
    }
  ];

  // Preselect Earth planet on mount to give initial user feedback
  useEffect(() => {
    const earth = planets.find(p => p.id === 'earth');
    if (earth) {
      setSelectedPlanet(earth);
    }
  }, []);

  // Window resize scale adjustment
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1025;
      setIsMobile(mobile);
      if (window.innerWidth < 480) {
        setMobileScale(0.28); // even smaller so that it fits nicely on a 360px screen by default
      } else if (window.innerWidth < 768) {
        setMobileScale(0.42);
      } else if (window.innerWidth < 1025) {
        setMobileScale(0.5); // tablet stacked scale
      } else {
        setMobileScale(0.78);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Custom wheel zoom listener (prevent scroll overlap, require Ctrl key)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY * -0.0015;
        setZoom((prev) => Math.max(0.4, Math.min(2.0, prev + delta)));
      } else {
        setShowZoomHint(true);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Auto-hide zoom hint after 2 seconds
  useEffect(() => {
    if (showZoomHint) {
      const timer = setTimeout(() => setShowZoomHint(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showZoomHint]);

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
          if (!planet) return angle;
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

  // Preset Views matching the image layout
  const trigger3DView = () => {
    setSystemTilt(30);
    setSystemYaw(-25);
  };

  const trigger2DView = () => {
    setSystemTilt(0);
    setSystemYaw(0);
  };

  const triggerReset = () => {
    setSystemTilt(30);
    setSystemYaw(-25);
    setZoom(1.0);
    setPlaybackSpeed(1.0);
    const earth = planets.find(p => p.id === 'earth');
    if (earth) setSelectedPlanet(earth);
  };

  const activeInfo = hoveredPlanet || selectedPlanet;

  const handlePrevPlanet = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeInfo) return;
    const currentIndex = planets.findIndex(p => p.id === activeInfo.id);
    const prevIndex = (currentIndex - 1 + planets.length) % planets.length;
    setSelectedPlanet(planets[prevIndex]);
    setHoveredPlanet(null);
  };

  const handleNextPlanet = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeInfo) return;
    const currentIndex = planets.findIndex(p => p.id === activeInfo.id);
    const nextIndex = (currentIndex + 1) % planets.length;
    setSelectedPlanet(planets[nextIndex]);
    setHoveredPlanet(null);
  };

  const currentScale = zoom * mobileScale;

  // Center alignment coordinates (perfectly centered)
  const centerX = '50%';
  const centerY = '50%';

  return (
    <section
      className="section"
      id="skills"
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isMobile ? 'flex-start' : 'center',
        boxSizing: 'border-box',
        // Deep stellar background
        background: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.05) 45%, #03060f 100%)',
        padding: isMobile ? '100px 1rem 60px 1rem' : '0'
      }}
    >

      {/* 360 Celestial Starfield Parallax Backdrop (Rotates with system drag controls) */}
      <div
        style={{
          position: 'absolute',
          top: '-25%',
          left: '-25%',
          width: '150%',
          height: '150%',
          backgroundImage: `
            radial-gradient(circle at 75% 25%, rgba(6, 182, 212, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 25% 75%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
            radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px),
            radial-gradient(white, rgba(255,255,255,.15) 1.5px, transparent 30px),
            radial-gradient(white, rgba(255,255,255,.1) 2.5px, transparent 50px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 550px 550px, 350px 350px, 250px 250px',
          backgroundPosition: '0 0, 0 0, 0 0, 40px 60px, 130px 270px',
          opacity: 0.7,
          zIndex: 1,
          pointerEvents: 'none',
          // 360 view rotation: responds to yaw and tilt (at a lower speed for depth parallax)
          transform: `rotateX(${systemTilt * 0.2}deg) rotateZ(${systemYaw * 0.2}deg)`,
          transformStyle: 'preserve-3d',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%', height: isMobile ? 'auto' : '100%', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ width: '100%', height: isMobile ? 'auto' : '100%', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
        >

          {/* Section Heading - positioned as overlay */}
          <div style={isMobile ? { position: 'relative', width: '100%', textAlign: 'center', marginBottom: '1.5rem', zIndex: 5 } : { position: 'absolute', top: '2rem', left: '2rem', zIndex: 5, textAlign: 'left', maxWidth: '45%' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              <SplitText text="Technical Arsenal" duration={0.5} stagger={0.03} />
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Drag to rotate orbits. Click planets to scan technical stacks.
            </p>
          </div>

          {/* Full page Space Canvas & Telemetry Scan HUD */}
          <div
            style={isMobile ? {
              position: 'relative',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              alignItems: 'center'
            } : {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Relative wrapper for canvas & telemetry controls */}
            <div
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: '100%',
                height: isMobile ? (window.innerWidth < 1025 && window.innerWidth >= 768 ? '450px' : '380px') : '100%',
                top: 0,
                left: 0,
                borderRadius: isMobile ? '8px' : '0',
                border: isMobile ? '1px solid rgba(0, 243, 255, 0.1)' : 'none',
                overflow: 'hidden',
              }}
            >
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
                  cursor: isDragging ? 'grabbing' : 'grab',
                  transformStyle: 'preserve-3d',
                  perspective: '1400px',
                }}
              >
              {/* Ecliptic Grid Plane - rotates with dragging */}
              <div
                style={{
                  position: 'absolute',
                  width: '1800px',
                  height: '1800px',
                  backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.012) 1.5px, transparent 1.5px)',
                  backgroundSize: '30px 30px',
                  transform: `translate3d(0, 0, -200px) rotateX(${systemTilt}deg) rotateZ(${systemYaw}deg) scale3d(${currentScale}, ${currentScale}, ${currentScale})`,
                  transformStyle: 'preserve-3d',
                  pointerEvents: 'none',
                  opacity: 0.5,
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                }}
              />

              {/* Solar System Core - Rotates according to Pitch/Yaw dragging */}
              <div
                style={{
                  position: 'absolute',
                  left: centerX,
                  top: centerY,
                  width: '1px',
                  height: '1px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `rotateX(${systemTilt}deg) rotateZ(${systemYaw}deg) scale3d(${currentScale}, ${currentScale}, ${currentScale})`,
                  transformStyle: 'preserve-3d',
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                }}
              >
                {/* The Sun (Center Core) - Centered with corona glow */}
                <div
                  style={{
                    position: 'absolute',
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at center, #ffffff 0%, #ff9e00 35%, #ff2a00 70%, #0d0000 100%)',
                    boxShadow: '0 0 90px rgba(255, 94, 0, 0.95), 0 0 30px rgba(255, 255, 255, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.6)',
                    border: '2px solid rgba(255, 255, 255, 0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    // Billboard effect (inverse rotations)
                    transform: `rotateZ(${-systemYaw}deg) rotateX(${-systemTilt}deg)`,
                    pointerEvents: 'none',
                    left: '-70px',
                    top: '-70px',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.12em', color: '#fff', textAlign: 'center', fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 8px #ff2a00' }}>
                    ARSENAL
                  </span>
                </div>

                {/* Planets and Elliptic Inclined Orbits */}
                {planets.map((planet, index) => {
                  const angle = angles[index] || 0;
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

                  const collisionSize = planet.size + 64;

                  return (
                    <React.Fragment key={planet.id}>
                      {/* Concentric Greyish-White Orbit Ring */}
                      <div
                        style={{
                          position: 'absolute',
                          width: `${planet.radiusX * 2}px`,
                          height: `${planet.radiusY * 2}px`,
                          left: `-${planet.radiusX}px`,
                          top: `-${planet.radiusY}px`,
                          borderRadius: '50%',
                          border: `1.5px ${isActive ? 'solid' : 'solid'} ${isActive ? planet.color : 'rgba(255, 255, 255, 0.12)'}`,
                          transform: `rotateX(${planet.inclination}deg)`,
                          transformStyle: 'preserve-3d',
                          pointerEvents: 'none',
                          boxShadow: isActive ? `0 0 15px ${planet.color}` : 'none',
                          transition: 'border-color 0.25s, box-shadow 0.25s',
                        }}
                      />

                      {/* Invisible Hover Target Wrapper (Larger Collision block for enhanced interaction) */}
                      <div
                        onMouseEnter={() => {
                          setHoveredPlanet(planet);
                        }}
                        onMouseLeave={() => {
                          setHoveredPlanet(null);
                        }}
                        onClick={() => {
                          setSelectedPlanet(selectedPlanet?.id === planet.id ? null : planet);
                        }}
                        style={{
                          position: 'absolute',
                          width: `${collisionSize}px`,
                          height: `${collisionSize}px`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          zIndex: 20,
                          // Combine 3D projection & billboard inverse rotation
                          transform: `translate3d(${x_3d}px, ${y_3d}px, ${z_3d}px) rotateZ(${-systemYaw}deg) rotateX(${-systemTilt}deg)`,
                          transformStyle: 'preserve-3d',
                          left: `-${collisionSize / 2}px`,
                          top: `-${collisionSize / 2}px`,
                          backgroundColor: 'transparent',
                        }}
                      >
                        {/* Billboarded 3D Planet sphere */}
                        <div
                          style={{
                            position: 'relative',
                            width: `${planet.size}px`,
                            height: `${planet.size}px`,
                            borderRadius: '50%',
                            boxShadow: isActive
                              ? `0 0 25px ${planet.color}`
                              : `0 0 10px rgba(255, 255, 255, 0.1)`,
                            transformStyle: 'preserve-3d',
                            transition: 'transform 0.2s ease-out',
                            transform: isActive ? 'scale(1.25)' : 'scale(1)',
                          }}
                        >
                          {/* Base planetary texture */}
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              borderRadius: '50%',
                              background: planet.color === '#ffd075'
                                ? 'radial-gradient(circle at 30% 30%, #ffd075 0%, #b86214 70%, #301400 100%)'
                                : planet.color === '#4b9cd3'
                                  ? 'radial-gradient(circle at 30% 30%, #4b9cd3 0%, #1a5e3a 50%, #0d2c54 80%, #000000 100%)'
                                  : planet.color === '#e06a3b'
                                    ? 'radial-gradient(circle at 30% 30%, #e06a3b 0%, #943316 70%, #290800 100%)'
                                    : planet.color === '#d6ae82'
                                      ? 'linear-gradient(to bottom, #d6ae82 0%, #a37b58 15%, #d6ae82 30%, #7e5336 45%, #d6ae82 60%, #a37b58 75%, #59351d 90%, #241205 100%)'
                                      : planet.color === '#d8b4fe'
                                        ? 'linear-gradient(to bottom, #fae8ff 0%, #e9d5ff 25%, #d8b4fe 50%, #c084fc 75%, #a855f7 100%)'
                                        : planet.color === '#a5f3fc'
                                          ? 'linear-gradient(135deg, #a5f3fc 0%, #22d3ee 50%, #0891b2 100%)'
                                          : planet.color === '#60a5fa'
                                            ? 'linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #1d4ed8 100%)'
                                            : `radial-gradient(circle at 30% 30%, #ffffff 0%, ${planet.color} 50%, #000000 100%)`,
                            }}
                          />

                          {/* 3D shading mask overlay (light comes from Sun in the center) */}
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              borderRadius: '50%',
                              background: 'radial-gradient(circle at 30% 30%, transparent 22%, rgba(0,0,0,0.85) 75%, #000 100%)',
                              mixBlendMode: 'multiply',
                              pointerEvents: 'none',
                            }}
                          />

                          {/* Glowing selection rings around the selected planet */}
                          {isSelected && (
                            <div
                              style={{
                                position: 'absolute',
                                width: `${planet.size + 16}px`,
                                height: `${planet.size + 16}px`,
                                border: `2px solid ${planet.color}`,
                                borderRadius: '50%',
                                boxShadow: `0 0 15px ${planet.color}, inset 0 0 10px ${planet.color}`,
                                animation: 'skillsRingSpin 6s linear infinite',
                                pointerEvents: 'none',
                                left: '-8px',
                                top: '-8px',
                                zIndex: 1,
                              }}
                            />
                          )}

                          {/* Saturn's flat tilted rings */}
                          {planet.id === 'saturn' && (
                            <div
                              style={{
                                position: 'absolute',
                                width: `${planet.size * 2.5}px`,
                                height: `${planet.size * 0.6}px`,
                                border: '3px solid rgba(216, 180, 254, 0.65)',
                                borderRadius: '50%',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%) rotate(-15deg)',
                                pointerEvents: 'none',
                                boxShadow: '0 0 10px rgba(216, 180, 254, 0.5), inset 0 0 8px rgba(216, 180, 254, 0.3)',
                                zIndex: 3,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Sidebar View Control HUD (Left bottom) */}
            <div
              style={isMobile ? {
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                background: 'rgba(7, 12, 24, 0.75)',
                backdropFilter: 'blur(10px)',
                padding: '0.6rem',
                borderRadius: '8px',
                border: '1px solid var(--card-border)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                transform: 'scale(0.85)',
                transformOrigin: 'bottom left',
              } : {
                position: 'absolute',
                bottom: '2rem',
                left: '2rem',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
                background: 'rgba(7, 12, 24, 0.45)',
                backdropFilter: 'blur(10px)',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--card-border)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <Compass size={14} style={{ color: 'var(--accent-secondary)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Orbitron, sans-serif', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
                  TELEMETRY CONTROLS
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  <button onClick={trigger3DView} className="btn-hud" style={{ fontSize: '0.75rem', fontFamily: 'Orbitron, sans-serif', padding: '3px 8px', background: systemTilt === 30 ? 'rgba(6, 182, 212, 0.15)' : 'transparent', border: '1px solid var(--card-border)', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>
                    3D VIEW
                  </button>
                  <button onClick={trigger2DView} className="btn-hud" style={{ fontSize: '0.75rem', fontFamily: 'Orbitron, sans-serif', padding: '3px 8px', background: systemTilt === 0 ? 'rgba(6, 182, 212, 0.15)' : 'transparent', border: '1px solid var(--card-border)', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>
                    2D VIEW
                  </button>
                  <button onClick={triggerReset} className="btn-hud" style={{ fontSize: '0.75rem', padding: '3px 8px', border: '1px solid var(--card-border)', borderRadius: '4px', color: 'var(--text-secondary)', cursor: 'pointer', background: 'transparent' }}>
                    <RotateCcw size={10} />
                  </button>
                </div>
              </div>

              {/* Simulation Play/Pause speed controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.6rem', gap: '0.5rem' }}>
                <button
                  onClick={() => setPlaybackSpeed((prev) => (prev === 0 ? 1.0 : 0))}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--accent-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {playbackSpeed === 0 ? <Play size={12} /> : <Pause size={12} />}
                </button>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[0.5, 1.0, 2.0].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      style={{
                        fontSize: '0.72rem',
                        padding: '2px 4px',
                        border: 'none',
                        background: playbackSpeed === spd ? 'rgba(6, 182, 212, 0.18)' : 'transparent',
                        color: playbackSpeed === spd ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        borderRadius: '3px',
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
                  onClick={() => setZoom((prev) => Math.max(0.4, prev - 0.15))}
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

            <AnimatePresence>
              {activeInfo && (
                <motion.div
                  className="glass"
                  initial={isMobile ? { opacity: 0, y: 20, scale: 0.95 } : { opacity: 0, x: 50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  exit={isMobile ? { opacity: 0, y: 20, scale: 0.95 } : { opacity: 0, x: 50, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  style={isMobile ? {
                    width: '100%',
                    maxWidth: '650px',
                    marginInline: 'auto',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid var(--card-border)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 15px rgba(139, 92, 246, 0.15)',
                    position: 'relative',
                    overflow: 'visible',
                    zIndex: 10,
                    boxSizing: 'border-box',
                    marginTop: '1.5rem',
                  } : {
                    width: 'min(350px, 35vw)',
                    maxHeight: 'min(550px, 65vh)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid var(--card-border)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 15px rgba(139, 92, 246, 0.15)',
                    position: 'absolute',
                    top: '2rem',
                    right: '2rem',
                    overflowY: 'auto',
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

                  <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                    <div>
                      {/* Heading tag */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.15em', fontFamily: 'Orbitron, sans-serif' }}>
                          ORBIT LOCK ACTIVE
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: planetColorToAccent(activeInfo.color), fontSize: '0.65rem', fontWeight: 600 }}>
                          {activeInfo.icon} {activeInfo.name.toUpperCase()}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.2rem', fontFamily: 'Orbitron, sans-serif' }}>
                        {activeInfo.discipline}
                      </h3>
                      <div style={{ width: '30px', height: '2px', backgroundColor: planetColorToAccent(activeInfo.color), marginBottom: '0.6rem' }} />

                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', lineHeight: '1.5', marginBottom: '0.8rem', fontStyle: 'italic', fontFamily: 'JetBrains Mono, monospace' }}>
                        &gt; "{activeInfo.fact}"
                      </p>

                      {/* Skill array grid */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {activeInfo.skills.map((skill, index) => (
                          <div key={skill} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-primary)' }}>
                              <span>{skill}</span>
                              <span style={{ color: planetColorToAccent(activeInfo.color) }}>{92 - index * 5}%</span>
                            </div>
                            {/* Skill bar */}
                            <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '1.5px', overflow: 'hidden' }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${92 - index * 5}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                style={{ height: '100%', backgroundColor: planetColorToAccent(activeInfo.color), borderRadius: '1.5px' }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Planet selection nav buttons inside HUD */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px dashed rgba(255,255,255,0.08)', paddingTop: '0.8rem' }}>
                        <button
                          onClick={handlePrevPlanet}
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '4px',
                            color: 'var(--text-primary)',
                            padding: '3px 8px',
                            cursor: 'pointer',
                            fontSize: '0.6rem',
                            fontFamily: 'Orbitron, sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            transition: 'background 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        >
                          &lt; PREV
                        </button>
                        <span style={{ fontSize: '0.58rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                          SYSTEM {planets.indexOf(activeInfo) + 1} / {planets.length}
                        </span>
                        <button
                          onClick={handleNextPlanet}
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '4px',
                            color: 'var(--text-primary)',
                            padding: '3px 8px',
                            cursor: 'pointer',
                            fontSize: '0.6rem',
                            fontFamily: 'Orbitron, sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            transition: 'background 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        >
                          NEXT &gt;
                        </button>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '0.6rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>
                        OBSERVATORY SYNCED
                      </span>
                      <button
                        onClick={() => {
                          setSelectedPlanet(null);
                          setHoveredPlanet(null);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: planetColorToAccent(activeInfo.color),
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>

      {/* Floating Scroll Zoom Hint (Ctrl + Scroll) */}
      <AnimatePresence>
        {showZoomHint && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 10, x: '-50%' }}
            style={{
              position: 'absolute',
              bottom: '5rem',
              left: '50%',
              padding: '0.5rem 1rem',
              background: 'rgba(11, 15, 25, 0.9)',
              border: '1px solid var(--accent-secondary)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.7rem',
              fontFamily: 'JetBrains Mono, monospace',
              zIndex: 100,
              pointerEvents: 'none',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)',
            }}
          >
            💡 Hold [Ctrl] + Scroll to Zoom Canvas
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes skillsRingSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

// Helper function to map planet raw hex colors to readable accents
function planetColorToAccent(color: string): string {
  if (color === '#ffd075') return 'var(--accent-secondary)'; // Venus -> Cyan
  if (color === '#4b9cd3') return '#10b981'; // Earth -> Green
  if (color === '#a3a3a3') return 'var(--accent-secondary)'; // Mercury -> Cyan
  return color;
}
