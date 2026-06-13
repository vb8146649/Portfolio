import React, { useRef, useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

export const PlanetSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulation parameters
  const [radius, setRadius] = useState<number>(65); // Planet radius (pixels)
  const [prominence, setProminence] = useState<number>(50); // Mountain prominence
  const [speed, setSpeed] = useState<number>(20); // Rotation speed
  const [atmosphere, setAtmosphere] = useState<boolean>(true); // Atmosphere toggle
  const [season, setSeason] = useState<number>(50); // Season slider (0: Winter/Ice, 50: Summer/Lush, 100: Autumn/Warm)

  // Texture offset
  const offsetRef = useRef<number>(0);

  // Generate continent noise map once
  const textureCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Pre-render a seamless 2D map texture for the planet
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 400;
    textureCanvas.height = 200;
    const tCtx = textureCanvas.getContext('2d');
    if (tCtx) {
      // Draw ocean background
      tCtx.fillStyle = '#061226';
      tCtx.fillRect(0, 0, 400, 200);

      // Generate simple procedural landmass shapes
      tCtx.fillStyle = '#10b981'; // Default green
      const numContinents = 8;
      for (let i = 0; i < numContinents; i++) {
        const cx = (i * 50) + Math.random() * 20;
        const cy = 40 + Math.random() * 120;
        const sizeX = 40 + Math.random() * 60;
        const sizeY = 30 + Math.random() * 50;

        tCtx.beginPath();
        tCtx.ellipse(cx, cy, sizeX, sizeY, Math.random() * Math.PI, 0, 2 * Math.PI);
        tCtx.fill();

        // Draw island sub-spots
        for (let j = 0; j < 3; j++) {
          tCtx.beginPath();
          tCtx.arc(
            cx + (Math.random() - 0.5) * sizeX * 1.5,
            cy + (Math.random() - 0.5) * sizeY * 1.5,
            5 + Math.random() * 15,
            0,
            2 * Math.PI
          );
          tCtx.fill();
        }
      }
    }
    textureCanvasRef.current = textureCanvas;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localFrameId: number;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = radius;

      // Draw outer atmosphere glow if enabled
      if (atmosphere) {
        ctx.save();
        const atmGlow = ctx.createRadialGradient(cx, cy, r - 5, cx, cy, r + 25);
        // Blend atmosphere glow color with active theme colors
        atmGlow.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
        atmGlow.addColorStop(0.3, 'rgba(6, 182, 212, 0.25)');
        atmGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');
        ctx.fillStyle = atmGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, r + 25, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      }

      // Draw clipped planet surface
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.clip();

      // Draw ocean base
      ctx.fillStyle = '#081730';
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      // Draw continents texture moving horizontally
      if (textureCanvasRef.current) {
        const tex = textureCanvasRef.current;
        offsetRef.current = (offsetRef.current + (speed / 10)) % tex.width;

        // Seasons coloring helper
        // We will render the texture canvas, and then tint it based on season value
        // Winter/Ice (0): Blue-white tint
        // Summer (50): Normal green/blue
        // Autumn/Dry (100): Warm orange/yellow/red tint
        let tintColor = 'rgba(255, 255, 255, 0)';
        if (season < 45) {
          // Winter icy blend
          const ratio = (45 - season) / 45;
          tintColor = `rgba(240, 248, 255, ${ratio * 0.75})`;
        } else if (season > 55) {
          // Autumn/dry land blend
          const ratio = (season - 55) / 45;
          tintColor = `rgba(245, 158, 11, ${ratio * 0.45})`;
        }

        // Draw double texture width for seamless wrapping
        ctx.drawImage(tex, -offsetRef.current, cy - r, r * 4, r * 2);
        ctx.drawImage(tex, tex.width - offsetRef.current, cy - r, r * 4, r * 2);

        // Apply season tint overlay
        if (tintColor !== 'rgba(255, 255, 255, 0)') {
          ctx.fillStyle = tintColor;
          ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
        }
      }

      // Draw 3D shadow/bump relief map to simulate mountain prominence
      // We do this by creating a radial gradient offset to simulate shading/height mapping
      const prominenceRatio = prominence / 100;
      if (prominenceRatio > 0.05) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        // Draw noise dots representing topography shadow reliefs
        ctx.strokeStyle = `rgba(0, 0, 0, ${0.12 * prominenceRatio})`;
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 40; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.sqrt(Math.random()) * r;
          const px = cx + Math.cos(angle) * dist;
          const py = cy + Math.sin(angle) * dist;
          
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + (prominenceRatio * 4), py + (prominenceRatio * 4));
          ctx.stroke();
        }
      }

      // Draw spherical lighting/shading overlay (3D sphere effect)
      const shading = ctx.createRadialGradient(
        cx - (r * 0.25), 
        cy - (r * 0.25), 
        r * 0.1, 
        cx, 
        cy, 
        r
      );
      shading.addColorStop(0, 'rgba(255, 255, 255, 0.25)'); // Highlight
      shading.addColorStop(0.3, 'rgba(255, 255, 255, 0)');  // Midtone
      shading.addColorStop(0.85, 'rgba(0, 0, 0, 0.45)');   // Dark side
      shading.addColorStop(1, 'rgba(0, 0, 0, 0.85)');      // Outer border shade
      ctx.fillStyle = shading;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      ctx.restore(); // Restore clipping region

      // Draw planet HUD grid lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Horizontal crosshair line
      ctx.moveTo(cx - r - 15, cy);
      ctx.lineTo(cx - r - 2, cy);
      ctx.moveTo(cx + r + 2, cy);
      ctx.lineTo(cx + r + 15, cy);
      // Vertical crosshair line
      ctx.moveTo(cx, cy - r - 15);
      ctx.lineTo(cx, cy - r - 2);
      ctx.moveTo(cx, cy + r + 2);
      ctx.lineTo(cx, cy + r + 15);
      ctx.stroke();

      // Outer rings/brackets
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.beginPath();
      ctx.arc(cx, cy, r + 10, -Math.PI/4, Math.PI/4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, r + 10, Math.PI * 3/4, Math.PI * 5/4);
      ctx.stroke();

      localFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(localFrameId);
    };
  }, [radius, prominence, speed, atmosphere, season]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>
      {/* Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.4rem' }}>
        <Globe size={14} style={{ color: 'var(--accent-secondary)' }} />
        <span style={{ fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.08em', color: 'var(--text-primary)' }}>
          PLANET SIMULATOR HUD
        </span>
      </div>

      {/* Simulator canvas */}
      <div 
        style={{ 
          height: '160px', 
          backgroundColor: '#03050a', 
          border: '1.5px solid rgba(6, 182, 212, 0.15)', 
          borderRadius: '6px', 
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        <canvas ref={canvasRef} width={300} height={160} style={{ display: 'block' }} />
        
        {/* Neon scanlines overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(6, 182, 212, 0.05) 50%)',
            backgroundSize: '100% 4px',
            pointerEvents: 'none',
          }}
        />

        {/* Telemetry Labels */}
        <div style={{ position: 'absolute', top: '6px', left: '8px', fontSize: '0.52rem', fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255, 255, 255, 0.4)' }}>
          REF: RAY_SIM_v0.2
        </div>
        <div style={{ position: 'absolute', bottom: '6px', right: '8px', fontSize: '0.52rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-secondary)' }}>
          STATUS: ROTATING // {speed * 6} RPM
        </div>
      </div>

      {/* Interactive Sliders Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {/* Slider: Radius */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>
            <span>RADIUS</span>
            <span style={{ color: 'var(--text-primary)' }}>{radius}px</span>
          </div>
          <input
            type="range"
            min="45"
            max="75"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            style={{
              width: '100%',
              height: '3px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '2px',
              outline: 'none',
              cursor: 'pointer',
              accentColor: 'var(--accent-secondary)'
            }}
          />
        </div>

        {/* Slider: Mountain Prominence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>
            <span>TOPOGRAPHY PROMINENCE</span>
            <span style={{ color: 'var(--text-primary)' }}>{prominence}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={prominence}
            onChange={(e) => setProminence(Number(e.target.value))}
            style={{
              width: '100%',
              height: '3px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '2px',
              outline: 'none',
              cursor: 'pointer',
              accentColor: 'var(--accent-secondary)'
            }}
          />
        </div>

        {/* Slider: Speed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>
            <span>ROTATION VELOCITY</span>
            <span style={{ color: 'var(--text-primary)' }}>{speed} deg/s</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{
              width: '100%',
              height: '3px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '2px',
              outline: 'none',
              cursor: 'pointer',
              accentColor: 'var(--accent-secondary)'
            }}
          />
        </div>

        {/* Season & Atmosphere row */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.2rem' }}>
          {/* Season Slider */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>
              <span>SEASON</span>
              <span style={{ color: 'var(--text-primary)' }}>
                {season < 40 ? 'Winter' : season > 60 ? 'Autumn' : 'Summer'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={season}
              onChange={(e) => setSeason(Number(e.target.value))}
              style={{
                width: '100%',
                height: '3px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '2px',
                outline: 'none',
                cursor: 'pointer',
                accentColor: 'var(--accent-secondary)'
              }}
            />
          </div>

          {/* Atmosphere Toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.62rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={atmosphere}
              onChange={(e) => setAtmosphere(e.target.checked)}
              style={{ cursor: 'pointer', accentColor: 'var(--accent-secondary)' }}
            />
            ATMOSPHERE
          </label>
        </div>
      </div>
      
      {/* Github link reference */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
        <a 
          href="https://github.com/vb8146649/PlanetSimulator_usingRaylib" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ fontSize: '0.52rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-primary)', textDecoration: 'underline' }}
        >
          View C++/Raylib Source Code
        </a>
        <span style={{ fontSize: '0.52rem', fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255, 255, 255, 0.3)' }}>
          Smart Simulation Active
        </span>
      </div>
    </div>
  );
};
