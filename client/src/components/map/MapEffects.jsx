import { useEffect, useRef } from 'react';

/**
 * MapEffects Component
 * Adds Three.js-based visual enhancements to the map:
 * - Glowing particles
 * - Animated rescue pulses
 * - Atmospheric effects
 * - Cyberpunk visual overlays
 */
export function MapEffects({ isActive = true, mode = 'overview' }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;
    containerRef.current.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = containerRef.current?.offsetWidth || window.innerWidth;
      canvas.height = containerRef.current?.offsetHeight || window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles for tactical effects
    const initializeParticles = () => {
      particlesRef.current = [];

      if (mode === 'overview') {
        // City marker glow particles
        for (let i = 0; i < 40; i++) {
          particlesRef.current.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            life: Math.random() * 255,
            decay: Math.random() * 2 + 0.5,
            color: ['rgba(239, 68, 68, ', 'rgba(249, 115, 22, ', 'rgba(251, 191, 36, ', 'rgba(16, 185, 129, '][
              Math.floor(Math.random() * 4)
            ],
          });
        }
      } else if (mode === 'city') {
        // Incident zone pulse particles
        for (let i = 0; i < 60; i++) {
          particlesRef.current.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            life: Math.random() * 200,
            decay: Math.random() * 3 + 1,
            color: 'rgba(59, 130, 246, ', // Cyan for incident zones
          });
        }
      } else if (mode === 'building') {
        // Building rescue particles
        for (let i = 0; i < 80; i++) {
          particlesRef.current.push({
            x: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
            y: Math.random() * canvas.height * 0.8 + canvas.height * 0.1,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: Math.random() * 150,
            decay: Math.random() * 2.5 + 1,
            color: 'rgba(34, 197, 94, ', // Green for rescue
          });
        }
      }
    };

    initializeParticles();

    let frameCount = 0;

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(11, 15, 25, 0.02)'; // Very subtle trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= particle.decay;

        if (particle.life <= 0) return false;

        const alpha = Math.max(0, particle.life / 255);
        ctx.fillStyle = `${particle.color}${alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 1.5 + Math.sin(frameCount * 0.1) * 0.5, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      // Add new particles occasionally
      if (frameCount % 4 === 0 && particlesRef.current.length < (mode === 'building' ? 100 : 60)) {
        const newParticle = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: 200,
          decay: Math.random() * 1.5 + 0.5,
          color:
            mode === 'overview'
              ? ['rgba(239, 68, 68, ', 'rgba(249, 115, 22, ', 'rgba(251, 191, 36, ', 'rgba(16, 185, 129, '][Math.floor(Math.random() * 4)]
              : mode === 'city'
                ? 'rgba(59, 130, 246, '
                : 'rgba(34, 197, 94, ',
        };
        particlesRef.current.push(newParticle);
      }

      frameCount++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isActive, mode]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none opacity-60"
      style={{
        mixBlendMode: 'screen',
        zIndex: 5,
      }}
    />
  );
}

export default MapEffects;
