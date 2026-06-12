import React, { useEffect, useRef } from 'react';

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999, radius: 150 };

    const getColors = () => {
      try {
        const style = window.getComputedStyle(document.documentElement);
        const primary = style.getPropertyValue('--accent-primary').trim() || '#8b5cf6';
        const secondary = style.getPropertyValue('--accent-secondary').trim() || '#06b6d4';
        return { primary, secondary };
      } catch (e) {
        return { primary: '#8b5cf6', secondary: '#06b6d4' };
      }
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseRadius: number;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.radius = Math.random() * 1.5 + 0.8;
        this.baseRadius = this.radius;
        // Speeds
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
      }

      update(w: number, h: number, speedMult: number = 1.0) {
        // Move
        this.x += this.vx * speedMult;
        this.y += this.vy * speedMult;

        // Bounce walls
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;

        // Mouse repulsion
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < mouse.radius * mouse.radius) {
          const dist = Math.sqrt(distSq);
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          
          // Gently push away
          this.x += Math.cos(angle) * force * 1.2;
          this.y += Math.sin(angle) * force * 1.2;
          
          // Slightly grow
          this.radius = this.baseRadius * (1 + force * 1.5);
        } else {
          // Shrink back
          if (this.radius > this.baseRadius) {
            this.radius -= 0.05;
          }
        }
      }

      draw(context: CanvasRenderingContext2D, color: string) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
      }
    }

    const init = () => {
      const w = canvas.width = window.innerWidth;
      const h = canvas.height = window.innerHeight;
      
      // Determine density based on screen size
      const count = Math.min(Math.floor((w * h) / 12000), 120);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(w, h));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const handleResize = () => {
      init();
    };

    let speedModifier = 1.0;
    const handleSpeedChange = (e: Event) => {
      speedModifier = (e as CustomEvent).detail ?? 1.0;
    };

    // Listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);
    window.addEventListener('particlespeed', handleSpeedChange);

    init();

    // Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const colors = getColors();

      // Update and Draw Particles
      particles.forEach((p) => {
        p.update(canvas.width, canvas.height, speedModifier);
        p.draw(ctx, colors.primary);
      });

      // Draw Connections (lines)
      const maxDist = 110;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDist * maxDist) {
            const dist = Math.sqrt(distSq);
            const alpha = (maxDist - dist) / maxDist * 0.15; // Opacity based on distance
            
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            // Mix colors based on variables
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            gradient.addColorStop(0, colors.primary);
            gradient.addColorStop(1, colors.secondary);
            
            ctx.strokeStyle = gradient;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.6;
            ctx.stroke();
            ctx.globalAlpha = 1.0; // reset
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('particlespeed', handleSpeedChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};
