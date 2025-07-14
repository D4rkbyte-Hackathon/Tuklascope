import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { useChatbotActions } from '../hooks/useChatbotActions';
import { useUserSkills } from '../hooks/useUserSkills';
import { SkillDetailModal } from '../components/SkillDetailModal';
import NetworkGraph from '../components/NetworkGraph';
import SkillTree from '../components/SkillTree';
import MasteryIndicator from '../components/MasteryIndicator';
import { Skill, SkillNode, SkillLink } from '../types/skills';

const SkillTreePage = () => {
  const { openChatbot } = useChatbotActions();
  const { userSkills, loading, getCategoryStats, getTotalXP, getMasteredSkills } = useUserSkills();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert userSkills object to array format
  const skills: Skill[] = Object.values(userSkills);
  
  // Get category stats using the hook
  const categoryStats = getCategoryStats();
  
  // Get overall stats using the hook
  const totalXP = getTotalXP();
  const totalMastered = getMasteredSkills().length;
  const averageLevel = categoryStats.length > 0 ? Math.floor(categoryStats.reduce((sum, cat) => sum + cat.level, 0) / categoryStats.length) : 1;

  // Create network graph data
  const createNetworkData = () => {
    const nodes: SkillNode[] = categoryStats.map((cat, index) => ({
      id: cat.subject,
      name: cat.subject,
      category: cat.subject,
      mastery_level: Math.min(100, Math.floor((cat.xp / 500) * 100)), // Convert XP to mastery level
      xp_earned: cat.xp,
      level: cat.level,
      skills: cat.skills
    }));

    // Create connections between related categories
    const links: SkillLink[] = [];
    const categoryRelations = {
      'Biology': ['Chemistry', 'Physics'],
      'Chemistry': ['Biology', 'Physics'],
      'Physics': ['Mathematics', 'Chemistry'],
      'Mathematics': ['Physics', 'Engineering'],
      'Engineering': ['Mathematics', 'Technology'],
      'Technology': ['Engineering', 'Mathematics']
    };

    nodes.forEach(node => {
      const related = categoryRelations[node.category as keyof typeof categoryRelations];
      if (related) {
        related.forEach(targetCategory => {
          const targetNode = nodes.find(n => n.category === targetCategory);
          if (targetNode) {
            links.push({
              source: node.id,
              target: targetNode.id,
              strength: 0.5
            });
          }
        });
      }
    });

    return { nodes, links };
  };

  const networkData = createNetworkData();

  // Handle responsive design
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle node click
  const handleNodeClick = (node: SkillNode) => {
    if (node.skills.length > 0) {
      setSelectedSkill(node.skills[0]);
    }
  };

  const handleCloseSkillModal = () => {
    setSelectedSkill(null);
  };

  // Trigger particle effect when skills change
  useEffect(() => {
    if (skills.length > 0) {
      setShowParticles(true);
      const timer = setTimeout(() => setShowParticles(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [skills.length]);

  return (
    <>
      <Navbar />
      <section
        style={{
          minHeight: '100vh',
          width: '100%',
          background: '#F8FAFC',
          padding: '64px 0',
        }}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ fontSize: isMobile ? 32 : 48, fontWeight: 700, color: '#0B3C6A', marginBottom: 16, textAlign: 'center' }}>
            Your <span style={{ color: '#FF6B2C' }}>STEM Continuum</span>
          </h1>
          <div style={{ color: '#1F2937', fontSize: isMobile ? 18 : 22, marginBottom: 48, textAlign: 'center', maxWidth: 700, padding: '0 20px' }}>
            Watch your knowledge grow! Every discovery adds to your personal skill network and unlocks new learning pathways.
          </div>

          {/* Overall Stats with Mastery Indicators */}
          <div style={{
            background: '#fff',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            padding: isMobile ? 24 : 32,
            marginBottom: 48,
            display: 'flex',
            gap: isMobile ? 24 : 48,
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '90%'
          }}>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <MasteryIndicator 
                mastery_level={Math.min(100, Math.floor((totalXP / 1000) * 100))}
                size={isMobile ? 50 : 60}
                showParticles={showParticles}
              />
              <div style={{ color: '#6B7280', fontSize: isMobile ? 14 : 16, marginTop: 8 }}>Total Progress</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: 700, color: '#FF6B2C' }}>{totalXP}</div>
              <div style={{ color: '#6B7280', fontSize: isMobile ? 14 : 16 }}>Total XP</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: 700, color: '#22C55E' }}>{totalMastered}</div>
              <div style={{ color: '#6B7280', fontSize: isMobile ? 14 : 16 }}>Concepts Mastered</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: 700, color: '#0B3C6A' }}>{averageLevel}</div>
              <div style={{ color: '#6B7280', fontSize: isMobile ? 14 : 16 }}>Average Level</div>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: 24, color: '#6B7280' }}>Loading your skill continuum...</div>
            </div>
          ) : categoryStats.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: 24, color: '#6B7280', marginBottom: '16px' }}>No skills yet!</div>
              <div style={{ fontSize: 16, color: '#9CA3AF' }}>Start discovering to build your skill network</div>
            </div>
          ) : (
            <div 
              ref={containerRef}
              style={{
                width: '100%',
                maxWidth: isMobile ? '100%' : 1200,
                margin: '0 auto',
                padding: isMobile ? '0 16px' : '0 32px'
              }}
            >
              {isMobile ? (
                <SkillTree 
                  data={networkData.nodes}
                  onNodeClick={handleNodeClick}
                />
              ) : (
                <div style={{
                  background: '#fff',
                  borderRadius: 24,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                  padding: 32,
                  minHeight: 600,
                  position: 'relative'
                }}>
                            <div style={{ marginBottom: 24, textAlign: 'center' }}>
            <h3 style={{ fontSize: 24, fontWeight: 700, color: '#0B3C6A', marginBottom: 8 }}>
              Your Knowledge Tree
            </h3>
            <p style={{ color: '#6B7280', fontSize: 16 }}>
              You're at the center • Main branches are STEM categories • Leaves are individual skills
            </p>
          </div>
                  <NetworkGraph
                    data={networkData}
                    onNodeClick={handleNodeClick}
                    width={containerRef.current?.clientWidth || 800}
                    height={500}
                  />
                </div>
              )}
            </div>
          )}

          {/* Call to Action */}
          <div style={{
            background: '#fff',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            padding: isMobile ? 32 : 48,
            marginTop: 48,
            textAlign: 'center',
            maxWidth: 600,
            margin: '48px auto 0'
          }}>
            <h3 style={{ fontSize: isMobile ? 24 : 28, fontWeight: 700, color: '#0B3C6A', marginBottom: 16 }}>
              Ready to expand your network?
            </h3>
            <p style={{ color: '#1F2937', fontSize: isMobile ? 16 : 18, marginBottom: 24 }}>
              Upload a photo of any object around you and discover the STEM concepts behind it!
            </p>
            <button
              onClick={() => openChatbot()}
              style={{
                background: '#FF6B2C',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: isMobile ? '14px 28px' : '16px 32px',
                fontSize: isMobile ? 16 : 18,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
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

      {/* Global Styles for Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </>
  );
};

export default SkillTreePage; 