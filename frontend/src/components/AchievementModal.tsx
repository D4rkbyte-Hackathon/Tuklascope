import React from 'react';

interface Skill {
  skill_name: string;
  category: string;
}

interface AchievementModalProps {
  skills: Skill[];
  onClose: () => void;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({ skills, onClose }) => {
  // fixed to 25 first-pwede railisan
  const XP_PER_SKILL = 25;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0, 0, 0, 0.7)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 2000,
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #0B3C6A, #082c4d)',
        color: 'white', borderRadius: 24, padding: '40px',
        width: '100%', maxWidth: 500, textAlign: 'center',
        border: '2px solid #F9A825',
        boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
        animation: 'zoomIn 0.3s ease-out'
      }}>
        <style>{`
          @keyframes zoomIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>
        
        <h2 style={{ fontSize: 36, margin: 0, color: '#FFD700' }}>🏆 Achievement Unlocked!</h2>
        <p style={{ fontSize: 18, opacity: 0.9, marginTop: 8 }}>You've gained new knowledge from your discovery!</p>
        
        <div style={{ margin: '32px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {skills.map(skill => (
            <div key={skill.skill_name} style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '12px 20px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: '500' }}>{skill.skill_name}</span>
              <span style={{ background: '#22C55E', padding: '4px 12px', borderRadius: 16, fontSize: 16, fontWeight: 'bold' }}>
                +{XP_PER_SKILL} XP
              </span>
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{
          background: '#FF6B2C', color: '#fff', fontWeight: 700, fontSize: 20,
          border: 'none', borderRadius: 10, padding: '16px 40px', cursor: 'pointer',
          width: '100%', marginTop: 16, transition: 'transform 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Awesome!
        </button>
      </div>
    </div>
  );
};