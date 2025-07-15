import React, { useEffect, useState } from 'react';
import { auth, saveUserSkills } from '../database/firebase';

interface Skill {
  skill_name: string;
  category: string;
}

interface AchievementModalProps {
  skills: Skill[];
  onClose: () => void;
  customIcon?: string;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({ skills, onClose, customIcon}) => {
  // fixed to 25 first-pwede railisan
  const XP_PER_SKILL = 25;
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Save skills to database when modal opens
  useEffect(() => {
    if (!customIcon) {
    const saveSkills = async () => {
      if (auth.currentUser) {
        setIsSaving(true);
        const success = await saveUserSkills(auth.currentUser.uid, skills);
        setSaveSuccess(success);
        setIsSaving(false);
      }
    };
    
    saveSkills();
  }
  }, [skills]);

  return (
    <div className="achievement-modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0, 0, 0, 0.7)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 2000,
      backdropFilter: 'blur(5px)'
    }}>
      <div className="achievement-modal-content" style={{
        background: 'linear-gradient(145deg, #0B3C6A, #082c4d)',
        color: 'white', borderRadius: 24, padding: '40px',
        width: '100%', maxWidth: 500, textAlign: 'center',
        border: '2px solid #F9A825',
        boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
        animation: 'zoomIn 0.3s ease-out',
        overflowY: 'auto',
        maxHeight: '90vh',
        touchAction: 'auto',
      }}>
        <style>{`
          @keyframes zoomIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .achievement-modal-content::-webkit-scrollbar {
            display: none;
          }
          .achievement-modal-content {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          @media (max-width: 768px) {
            .achievement-modal-overlay {
              padding: 16px !important;
            }
            
            .achievement-modal-content {
              padding: 24px !important;
              border-radius: 20px !important;
              max-width: 400px !important;
              overflow-y: auto !important;
              max-height: 90vh !important;
              touch-action: auto !important;
            }
            
            .achievement-modal-content h2 {
              font-size: 28px !important;
              line-height: 1.2 !important;
            }
            
            .achievement-modal-content p {
              font-size: 16px !important;
              margin-top: 12px !important;
            }
            
            .achievement-skills-container {
              margin: 24px 0 !important;
              gap: 10px !important;
            }
            
            .achievement-skill-item {
              padding: 10px 16px !important;
              border-radius: 10px !important;
              flex-direction: column !important;
              gap: 8px !important;
              align-items: flex-start !important;
            }
            
            .achievement-skill-name {
              font-size: 16px !important;
              font-weight: 600 !important;
            }
            
            .achievement-skill-xp {
              font-size: 14px !important;
              padding: 3px 10px !important;
              border-radius: 12px !important;
              align-self: flex-end !important;
            }
            
            .achievement-button {
              font-size: 18px !important;
              padding: 14px 32px !important;
              min-height: 48px !important;
              margin-top: 20px !important;
            }
          }
          
          @media (max-width: 480px) {
            .achievement-modal-content {
              padding: 20px !important;
              max-width: 350px !important;
            }
            
            .achievement-modal-content h2 {
              font-size: 24px !important;
            }
            
            .achievement-modal-content p {
              font-size: 14px !important;
            }
            
            .achievement-skill-name {
              font-size: 14px !important;
            }
            
            .achievement-skill-xp {
              font-size: 12px !important;
              padding: 2px 8px !important;
            }
            
            .achievement-button {
              font-size: 16px !important;
              padding: 12px 24px !important;
            }
          }
        `}</style>
        
        <h2 style={{ fontSize: 36, margin: 0, color: '#FFD700' }}>{customIcon ? customIcon : '🏆'} {customIcon ? 'Badge Unlocked!' : 'Achievement Unlocked!'}</h2>
        <p style={{ fontSize: 18, opacity: 0.9, marginTop: 8 }}>
          {isSaving ? 'Saving your new skills...' : 'You\'ve gained new knowledge from your discovery!'}
        </p>
        
        <div className="achievement-skills-container" style={{ margin: '32px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
  {skills.map(item => (
    <div key={item.skill_name} className="achievement-skill-item" style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '12px 20px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ textAlign: 'left' }}>
        <span className="achievement-skill-name" style={{ fontSize: 18, fontWeight: '600' }}>{item.skill_name}</span>
        {/* If it's a badge, show its description (which is passed in the 'category' field) */}
        {customIcon && (
            <p style={{ fontSize: 14, opacity: 0.8, margin: '4px 0 0 0' }}>{item.category}</p>
        )}
      </div>
      {/* Only show the "+XP" if it's a skill, not a badge */}
      {!customIcon && (
        <span className="achievement-skill-xp" style={{ background: '#22C55E', padding: '4px 12px', borderRadius: 16, fontSize: 16, fontWeight: 'bold' }}>
          +{XP_PER_SKILL} XP
        </span>
      )}
    </div>
  ))}
</div>

        <button className="achievement-button" onClick={onClose} style={{
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