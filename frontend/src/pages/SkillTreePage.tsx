import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useChatbotActions } from '../hooks/useChatbotActions';
import { useUserSkills } from '../hooks/useUserSkills';
import { SkillCard } from '../components/SkillCard';
import { SkillDetailModal } from '../components/SkillDetailModal';

interface Skill {
  skill_name: string;
  category: string;
  mastery_level: number;
  xp_earned: number;
  date_acquired: string;
  last_updated: string;
}

interface CategoryStat {
  subject: string;
  xp: number;
  level: number;
  mastered: number;
  progress: number;
  skills: Skill[];
}

// CategorySkillsModal component
const CategorySkillsModal: React.FC<{
  category: CategoryStat;
  onClose: () => void;
  onSkillClick: (skill: Skill) => void;
}> = ({ category, onClose, onSkillClick }) => {
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
        maxWidth: 700,
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        animation: 'zoomIn 0.3s ease-out',
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
            {category.subject} Skills
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
        {/* Category Stats */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: '16px', background: '#F8FAFC', borderRadius: '12px', minWidth: 120 }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B2C' }}>{category.xp}</div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>XP</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', background: '#F8FAFC', borderRadius: '12px', minWidth: 120 }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#0B3C6A' }}>{category.level}</div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>Level</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', background: '#F8FAFC', borderRadius: '12px', minWidth: 120 }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#22C55E' }}>{category.mastered}</div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>Mastered</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', background: '#F8FAFC', borderRadius: '12px', minWidth: 120 }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B2C' }}>{Math.round(category.progress * 100)}%</div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>Progress</div>
          </div>
        </div>
        {/* Skills Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
        }}>
          {category.skills.map((skill, index) => (
            <SkillCard
              key={index}
              skill={skill}
              onClick={() => onSkillClick(skill)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const SkillTreePage = () => {
  const { openChatbot } = useChatbotActions();
  const { userSkills, loading, getCategoryStats, getTotalXP, getMasteredSkills } = useUserSkills();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  // Convert userSkills object to array format
  const skills: Skill[] = Object.values(userSkills);
  
  // Get category stats using the hook
  const categoryStats: CategoryStat[] = getCategoryStats();
  
  // Get overall stats using the hook
  const totalXP = getTotalXP();
  const totalMastered = getMasteredSkills().length;
  const averageLevel = categoryStats.length > 0 ? Math.floor(categoryStats.reduce((sum, cat) => sum + cat.level, 0) / categoryStats.length) : 1;

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setCategoryModalOpen(true);
  };

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill);
  };

  const handleCloseSkillModal = () => {
    setSelectedSkill(null);
  };

  const handleCloseCategoryModal = () => {
    setCategoryModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <>
      <Navbar />
      <section
        style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F8FAFC',
          padding: '64px 0',
        }}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 400 }}>
          <h1 style={{ fontSize: 48, fontWeight: 700, color: '#0B3C6A', marginBottom: 16, textAlign: 'center' }}>
            Your <span style={{ color: '#FF6B2C' }}>STEM Skill Tree</span>
          </h1>
          <div style={{ color: '#1F2937', fontSize: 22, marginBottom: 48, textAlign: 'center', maxWidth: 700 }}>
            Watch your knowledge grow! Every discovery adds to your personal skill tree and unlocks new learning pathways.
          </div>

          {/* Overall Stats */}
          <div style={{
            background: '#fff',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            padding: 32,
            marginBottom: 48,
            display: 'flex',
            gap: 48,
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#FF6B2C' }}>{totalXP}</div>
              <div style={{ color: '#6B7280', fontSize: 16 }}>Total XP</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#22C55E' }}>{totalMastered}</div>
              <div style={{ color: '#6B7280', fontSize: 16 }}>Concepts Mastered</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#0B3C6A' }}>{averageLevel}</div>
              <div style={{ color: '#6B7280', fontSize: 16 }}>Average Level</div>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: 24, color: '#6B7280' }}>Loading your skill tree...</div>
            </div>
          ) : categoryStats.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: 24, color: '#6B7280', marginBottom: '16px' }}>No skills yet!</div>
              <div style={{ fontSize: 16, color: '#9CA3AF' }}>Start discovering to build your skill tree</div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: 32,
              width: '100%',
              maxWidth: 1200,
              margin: '0 auto',
              justifyItems: 'center',
            }}>
              {categoryStats.map((card) => (
                <div key={card.subject} style={{ width: '100%', maxWidth: 500, display: 'flex', justifyContent: 'center' }}>
                  {/* Category Card */}
                  <div
                    style={{
                      background: '#fff',
                      borderRadius: 32,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                      padding: 36,
                      width: '100%',
                      maxWidth: 500,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                      border: selectedCategory === card.subject ? '3px solid #FF6B2C' : 'none',
                      margin: '0 0 0 0',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    onClick={() => handleCategoryClick(card.subject)}
                  >
                    {/* XP Badge */}
                    <div style={{ position: 'absolute', top: 24, right: 24, background: '#FF6B2C', color: '#fff', borderRadius: 16, padding: '4px 16px', fontWeight: 700, fontSize: 16 }}>
                      XP: {card.xp}
                    </div>
                    {/* Icon or Progress */}
                    <div style={{ marginBottom: 18 }} />
                    <div style={{ fontWeight: 700, fontSize: 24, color: '#0B3C6A', marginBottom: 4 }}>{card.subject}</div>
                    <div style={{ color: '#1F2937', fontSize: 18, marginBottom: 18 }}>Level {card.level}</div>
                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: 8, background: '#E5E7EB', borderRadius: 8, marginBottom: 18 }}>
                      <div style={{ width: `${card.progress * 100}%`, height: '100%', background: '#FF6B2C', borderRadius: 8 }} />
                    </div>
                    <div style={{ color: '#6B7280', fontSize: 16 }}>
                      Concepts Mastered: <span style={{ color: '#22C55E', fontWeight: 700 }}>{card.mastered}</span>
                    </div>
                    <div style={{ color: '#FF6B2C', fontSize: 14, marginTop: 8, fontWeight: 600 }}>
                      Click to view skills
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div style={{
            background: '#fff',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            padding: 48,
            marginTop: 48,
            textAlign: 'center',
            maxWidth: 600
          }}>
            <h3 style={{ fontSize: 28, fontWeight: 700, color: '#0B3C6A', marginBottom: 16 }}>
              Ready to grow your skills?
            </h3>
            <p style={{ color: '#1F2937', fontSize: 18, marginBottom: 24 }}>
              Upload a photo of any object around you and discover the STEM concepts behind it!
            </p>
            <button
              onClick={() => openChatbot()}
              style={{
                background: '#FF6B2C',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '16px 32px',
                fontSize: 18,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e55a1f'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#FF6B2C'}
            >
              Start Discovery
            </button>
          </div>
        </div>
      </section>

      {/* Category Skills Modal */}
      {categoryModalOpen && selectedCategory && (
        <CategorySkillsModal
          category={categoryStats.find((cat) => cat.subject === selectedCategory)!}
          onClose={handleCloseCategoryModal}
          onSkillClick={handleSkillClick}
        />
      )}

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <SkillDetailModal
          skill={selectedSkill}
          onClose={handleCloseSkillModal}
        />
      )}
    </>
  );
};

export default SkillTreePage; 