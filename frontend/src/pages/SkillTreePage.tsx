import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useChatbotActions } from '../hooks/useChatbotActions';
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

const SkillTreePage = () => {
  const { openChatbot } = useChatbotActions();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  useEffect(() => {
    let loadedSkills: Skill[] | null = null;
    try {
      const stored = localStorage.getItem('tuklascope_skills');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.every(s => s && typeof s.skill_name === 'string')) {
          loadedSkills = parsed;
        }
      }
    } catch (e) {
      // Ignore parse errors, fallback to sample
    }
    if (!loadedSkills) {
      // Add some sample skills for demonstration
      loadedSkills = [
        {
          skill_name: "Photosynthesis",
          category: "Biology",
          mastery_level: 75,
          xp_earned: 150,
          date_acquired: "2024-01-15",
          last_updated: "2024-01-20"
        },
        {
          skill_name: "Cell Division",
          category: "Biology",
          mastery_level: 45,
          xp_earned: 100,
          date_acquired: "2024-01-18",
          last_updated: "2024-01-19"
        },
        {
          skill_name: "Chemical Reactions",
          category: "Chemistry",
          mastery_level: 60,
          xp_earned: 125,
          date_acquired: "2024-01-10",
          last_updated: "2024-01-15"
        },
        {
          skill_name: "Atomic Structure",
          category: "Chemistry",
          mastery_level: 85,
          xp_earned: 200,
          date_acquired: "2024-01-05",
          last_updated: "2024-01-12"
        },
        {
          skill_name: "Newton's Laws",
          category: "Physics",
          mastery_level: 70,
          xp_earned: 175,
          date_acquired: "2024-01-12",
          last_updated: "2024-01-18"
        },
        {
          skill_name: "Algebraic Equations",
          category: "Mathematics",
          mastery_level: 90,
          xp_earned: 225,
          date_acquired: "2024-01-08",
          last_updated: "2024-01-16"
        }
      ];
    }
    setSkills(loadedSkills);
    setLoading(false);
  }, []);

  // Group by category
  const categoryStats: CategoryStat[] = React.useMemo(() => {
    const cats: { [category: string]: CategoryStat } = {};
    skills.forEach((skill) => {
      if (!cats[skill.category]) {
        cats[skill.category] = {
          subject: skill.category,
          xp: 0,
          level: 1,
          mastered: 0,
          progress: 0,
          skills: []
        };
      }
      cats[skill.category].xp += skill.xp_earned;
      cats[skill.category].skills.push(skill);
      // Count mastered skills (80%+ mastery)
      if (skill.mastery_level >= 80) {
        cats[skill.category].mastered += 1;
      }
    });
    Object.values(cats).forEach((cat) => {
      cat.level = Math.floor(cat.xp / 100) + 1;
      cat.progress = Math.min(1, (cat.xp % 100) / 100);
    });
    return Object.values(cats);
  }, [skills]);

  const totalXP = skills.reduce((sum, skill) => sum + skill.xp_earned, 0);
  const totalMastered = skills.filter(skill => skill.mastery_level >= 80).length;
  const averageLevel = categoryStats.length > 0 ? Math.floor(categoryStats.reduce((sum, cat) => sum + cat.level, 0) / categoryStats.length) : 1;

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill);
  };

  const handleCloseSkillModal = () => {
    setSelectedSkill(null);
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
              display: 'flex',
              flexDirection: 'column',
              gap: 32,
              width: '100%',
              maxWidth: 1400,
            }}>
              {categoryStats.map((card) => (
                <div key={card.subject}>
                  {/* Category Card */}
                  <div
                    style={{
                      background: '#fff',
                      borderRadius: 32,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                      padding: 36,
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                      border: selectedCategory === card.subject ? '3px solid #FF6B2C' : 'none',
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
                      {selectedCategory === card.subject ? 'Click to collapse' : 'Click to view skills'}
                    </div>
                  </div>

                  {/* Individual Skills */}
                  {selectedCategory === card.subject && (
                    <div style={{
                      background: '#fff',
                      borderRadius: 24,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                      padding: 32,
                      marginTop: 16,
                      width: '100%',
                    }}>
                      <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0B3C6A', marginBottom: 24 }}>
                        Skills in {card.subject}
                      </h3>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: 16,
                      }}>
                        {card.skills.map((skill, index) => (
                          <SkillCard
                            key={index}
                            skill={skill}
                            onClick={() => handleSkillClick(skill)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
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