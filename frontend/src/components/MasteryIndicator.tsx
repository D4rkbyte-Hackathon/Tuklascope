import React, { useEffect, useRef } from 'react';

interface MasteryIndicatorProps {
  mastery_level: number;
  size?: number;
  showParticles?: boolean;
  onLevelUp?: () => void;
}

const MasteryIndicator: React.FC<MasteryIndicatorProps> = ({ 
  mastery_level, 
  size = 60, 
  showParticles = false,
  onLevelUp 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  const getMasteryColor = (level: number) => {
    if (level >= 80) return '#22C55E';
    if (level >= 60) return '#F59E0B';
    if (level >= 40) return '#FF6B2C';
    return '#6B7280';
  };

  const getMasteryLabel = (level: number) => {
    if (level >= 80) return 'Mastered';
    if (level >= 60) return 'Proficient';
    if (level >= 40) return 'Developing';
    return 'Beginner';
  };

  useEffect(() => {
    if (!showParticles || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    // Create particles
    const particles: any[] = [];
    const particleCount = 12;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: size / 2,
        y: size / 2,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        decay: Math.random() * 0.02 + 0.01,
        color: getMasteryColor(mastery_level)
      });
    }

    particlesRef.current = particles;

    const animate = () => {
      ctx.clearRect(0, 0, size, size);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= particle.decay;

        if (particle.life > 0) {
          ctx.save();
          ctx.globalAlpha = particle.life;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          particles.splice(index, 1);
        }
      });

      if (particles.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showParticles, mastery_level, size]);

  const radius = size / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (mastery_level / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {/* Particle Canvas */}
      {showParticles && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 10
          }}
        />
      )}

      {/* SVG Circle */}
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="4"
        />
        
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getMasteryColor(mastery_level)}
          strokeWidth="4"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.8s ease-in-out',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }}
        />
      </svg>

      {/* Center Content */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        pointerEvents: 'none'
      }}>
        <div style={{
          fontSize: size * 0.2,
          fontWeight: '700',
          color: getMasteryColor(mastery_level)
        }}>
          {mastery_level}%
        </div>
        <div style={{
          fontSize: size * 0.12,
          color: '#6B7280',
          fontWeight: '500'
        }}>
          {getMasteryLabel(mastery_level)}
        </div>
      </div>

      {/* Level Up Glow Effect */}
      {mastery_level === 100 && (
        <div style={{
          position: 'absolute',
          top: -4,
          left: -4,
          right: -4,
          bottom: -4,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${getMasteryColor(mastery_level)}20, transparent 70%)`,
          animation: 'pulse 2s infinite',
          pointerEvents: 'none'
        }} />
      )}
    </div>
  );
};

export default MasteryIndicator; 