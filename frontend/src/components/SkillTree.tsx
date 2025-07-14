import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { SkillNode } from '../types/skills';

interface SkillTreeProps {
  data: SkillNode[];
  onNodeClick: (node: SkillNode) => void;
}

const SkillTree: React.FC<SkillTreeProps> = ({ data, onNodeClick }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

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

  const getCategoryColor = (category: string) => {
    const colors = {
      'Biology': '#22C55E',
      'Chemistry': '#3B82F6',
      'Physics': '#8B5CF6',
      'Mathematics': '#F59E0B',
      'Engineering': '#EF4444',
      'Technology': '#06B6D4',
      'default': '#6B7280'
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  return (
    <div style={{ padding: '16px' }}>
      {/* User Center Node */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        marginBottom: '24px',
        background: 'radial-gradient(circle, #FF6B2C20, transparent)',
        borderRadius: '16px',
        border: '2px solid #FF6B2C'
      }}>
        <div style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#FF6B2C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          fontWeight: '700',
          marginRight: '16px'
        }}>
          You
        </div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#0B3C6A' }}>
            Your Knowledge Tree
          </div>
          <div style={{ fontSize: '14px', color: '#6B7280' }}>
            {data.length} categories • {data.reduce((sum, cat) => sum + cat.skills.length, 0)} skills
          </div>
        </div>
      </div>

      {/* Categories and Skills */}
      {data.map((node) => (
        <div key={node.id} style={{ marginBottom: '12px' }}>
          {/* Category Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              borderLeft: `4px solid ${getCategoryColor(node.category)}`,
              position: 'relative'
            }}
            onClick={() => toggleCategory(node.category)}
          >
            {/* Connection line from user */}
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              width: '2px',
              height: '12px',
              background: '#FF6B2C',
              transform: 'translateX(-50%)'
            }} />
            
            {expandedCategories.has(node.category) ? (
              <ChevronDownIcon style={{ width: 20, height: 20, color: '#6B7280', marginRight: 12 }} />
            ) : (
              <ChevronRightIcon style={{ width: 20, height: 20, color: '#6B7280', marginRight: 12 }} />
            )}
            
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>
                {node.name}
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>
                Level {node.level} • {node.xp_earned} XP • {node.skills.length} skills
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{
                background: getMasteryColor(node.mastery_level),
                color: 'white',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {getMasteryLabel(node.mastery_level)}
              </div>
            </div>
          </div>

          {/* Skills List */}
          {expandedCategories.has(node.category) && (
            <div style={{ marginLeft: 24, marginTop: 8 }}>
              {node.skills.map((skill, index) => (
                <div
                  key={index}
                  style={{
                    background: '#F8FAFC',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '8px',
                    border: '1px solid #E5E7EB',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                  onClick={() => onNodeClick({ ...node, skills: [skill] })}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.background = '#F1F5F9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.background = '#F8FAFC';
                  }}
                >
                  {/* Connection line from category */}
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '24px',
                    width: '2px',
                    height: '8px',
                    background: getCategoryColor(node.category)
                  }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>
                      {skill.skill_name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#FF6B2C', fontWeight: '600' }}>
                      +{skill.xp_earned} XP
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>
                      Mastery: {skill.mastery_level}%
                    </div>
                    <div style={{
                      background: getMasteryColor(skill.mastery_level),
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: '500'
                    }}>
                      {getMasteryLabel(skill.mastery_level)}
                    </div>
                  </div>
                  
                  <div style={{ width: '100%', height: '4px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${skill.mastery_level}%`,
                        height: '100%',
                        background: getMasteryColor(skill.mastery_level),
                        borderRadius: '2px',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SkillTree; 