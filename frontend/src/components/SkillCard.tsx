import React from 'react';

interface Skill {
  skill_name: string;
  category: string;
  mastery_level: number;
  xp_earned: number;
  date_acquired: string;
  last_updated: string;
}

interface SkillCardProps {
  skill: Skill;
  onClick?: () => void;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill, onClick }) => {
  const getMasteryColor = (level: number) => {
    if (level >= 80) return '#22C55E'; // Green for mastered
    if (level >= 60) return '#F59E0B'; // Yellow for proficient
    if (level >= 40) return '#FF6B2C'; // Orange for developing
    return '#6B7280'; // Gray for beginner
  };

  const getMasteryLabel = (level: number) => {
    if (level >= 80) return 'Mastered';
    if (level >= 60) return 'Proficient';
    if (level >= 40) return 'Developing';
    return 'Beginner';
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: '16px',
        border: '1px solid #E5E7EB',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        marginBottom: '8px'
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>
          {skill.skill_name}
        </h4>
        <span style={{
          background: getMasteryColor(skill.mastery_level),
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          {getMasteryLabel(skill.mastery_level)}
        </span>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '14px', color: '#6B7280' }}>
          Mastery: {skill.mastery_level}%
        </span>
        <span style={{ fontSize: '14px', color: '#FF6B2C', fontWeight: '600' }}>
          +{skill.xp_earned} XP
        </span>
      </div>
      
      <div style={{ width: '100%', height: '6px', background: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${skill.mastery_level}%`,
            height: '100%',
            background: getMasteryColor(skill.mastery_level),
            borderRadius: '3px',
            transition: 'width 0.3s ease'
          }}
        />
      </div>
      
      <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '8px' }}>
        Acquired: {new Date(skill.date_acquired).toLocaleDateString()}
      </div>
    </div>
  );
}; 