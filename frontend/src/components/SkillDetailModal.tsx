import React from 'react';

interface Skill {
  skill_name: string;
  category: string;
  mastery_level: number;
  xp_earned: number;
  date_acquired: string;
  last_updated: string;
}

interface SkillDetailModalProps {
  skill: Skill;
  onClose: () => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({ skill, onClose }) => {
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

  const getNextMilestone = (level: number) => {
    if (level < 40) return 40;
    if (level < 60) return 60;
    if (level < 80) return 80;
    return 100;
  };

  const getProgressToNext = (level: number) => {
    const next = getNextMilestone(level);
    const current = level;
    const range = next - (next === 40 ? 0 : next === 60 ? 40 : next === 80 ? 60 : 80);
    return ((current - (next === 40 ? 0 : next === 60 ? 40 : next === 80 ? 60 : 80)) / range) * 100;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 24,
        padding: '32px',
        width: '100%',
        maxWidth: 500,
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        animation: 'zoomIn 0.3s ease-out'
      }}>
        <style>{`
          @keyframes zoomIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#0B3C6A' }}>
            {skill.skill_name}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6B7280',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        {/* Category Badge */}
        <div style={{ marginBottom: '24px' }}>
          <span style={{
            background: '#F3F4F6',
            color: '#374151',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {skill.category}
          </span>
        </div>

        {/* Mastery Level */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>
              Mastery Level
            </span>
            <span style={{
              background: getMasteryColor(skill.mastery_level),
              color: 'white',
              padding: '6px 12px',
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {getMasteryLabel(skill.mastery_level)}
            </span>
          </div>
          
          <div style={{ width: '100%', height: '12px', background: '#E5E7EB', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px' }}>
            <div
              style={{
                width: `${skill.mastery_level}%`,
                height: '100%',
                background: getMasteryColor(skill.mastery_level),
                borderRadius: '6px',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6B7280' }}>
            <span>{skill.mastery_level}%</span>
            <span>Next: {getNextMilestone(skill.mastery_level)}%</span>
          </div>
        </div>

        {/* Progress to Next Milestone */}
        {skill.mastery_level < 100 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
              Progress to next milestone
            </div>
            <div style={{ width: '100%', height: '8px', background: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${getProgressToNext(skill.mastery_level)}%`,
                  height: '100%',
                  background: '#FF6B2C',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ textAlign: 'center', padding: '16px', background: '#F8FAFC', borderRadius: '12px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B2C' }}>
              {skill.xp_earned}
            </div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>XP Earned</div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '16px', background: '#F8FAFC', borderRadius: '12px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#0B3C6A' }}>
              {Math.floor(skill.mastery_level / 20) + 1}
            </div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>Skill Level</div>
          </div>
        </div>

        {/* Dates */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>Timeline</div>
          <div style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
            <strong>Acquired:</strong> {new Date(skill.date_acquired).toLocaleDateString()}
          </div>
          <div style={{ fontSize: '14px', color: '#374151' }}>
            <strong>Last Updated:</strong> {new Date(skill.last_updated).toLocaleDateString()}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: '#F3F4F6',
              color: '#374151',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#E5E7EB'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#F3F4F6'}
          >
            Close
          </button>
          
          <button
            onClick={() => {
              // TODO: Implement practice/learn more functionality
              console.log('Practice skill:', skill.skill_name);
            }}
            style={{
              flex: 1,
              background: '#FF6B2C',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#e55a1f'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#FF6B2C'}
          >
            Practice More
          </button>
        </div>
      </div>
    </div>
  );
}; 