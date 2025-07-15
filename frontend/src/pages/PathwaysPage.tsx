import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useChatbotActions } from '../hooks/useChatbotActions';
import { useNavigate } from 'react-router-dom';
// --- Import the DiscoveryModal to be controlled by this page ---
import { DiscoveryModal } from '../components/DiscoveryModal';

// --- MODIFIED: The hardcoded data now only includes the fields you requested. ---
const learningPathways = [
  {
    level: 'Beginner',
    levelColor: '#22C55E',
    title: 'Kitchen Chemist',
    points: 500,
    pointsColor: '#F9A825',
    description: 'Discover chemistry principles using everyday kitchen materials and ingredients.',
    progressText: '50% completed',
    button: { text: 'Continue Journey', color: '#22C55E', disabled: false },
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=400&h=120',
    questId: null,
  },
  {
    level: 'Intermediate',
    levelColor: '#2563EB',
    title: 'Backyard Ecologist',
    points: 750,
    pointsColor: '#F9A825',
    description: 'Explore biodiversity and ecosystem relationships in your local environment.',
    progressText: 'Not Started',
    button: { text: 'Start Journey', color: '#2563EB', disabled: false },
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=120',
    questId: 'quest_garden_safari',
  },
  {
    level: 'Advanced',
    levelColor: '#DC2626',
    title: 'Code Creator',
    points: 1000,
    pointsColor: '#F9A825',
    description: 'Learn programming concepts through creative projects and real-world applications.',
    progressText: 'Locked',
    button: { text: 'Unlock Previous Requirement', color: '#E5E7EB', disabled: true },
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=120',
    questId: null,
  },
  // ... other pathways
];

const PathwaysPage = () => {
  const { openChatbot } = useChatbotActions();
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // State for controlling the modal and active quest
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeQuestId, setActiveQuestId] = useState<string | null>(null);


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /**
   * This function is called by the DiscoveryModal when an image is selected.
   * It closes the modal and navigates to the results page with the necessary state.
   */
  const handleDiscoveryStart = (image: string) => {
    setIsModalOpen(false);
    navigate('/spark-results', {
      state: {
        image: image,
        questId: activeQuestId, // Pass the active quest ID to the next page
      },
    });
  };

  /**
   * This handles the click on a pathway's journey button.
   */
  const handleJourneyClick = (questId: string | null) => {
    // If the pathway has a quest, set it as active and open the modal.
    if (questId) {
      setActiveQuestId(questId);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Navbar />
      {/* The DiscoveryModal is now rendered and controlled here */}
      <DiscoveryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDiscoveryStart={handleDiscoveryStart} // Pass the new handler function
      />

      <section
        style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
          padding: '64px 0',
        }}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 400 }}>
          <h1 style={{ fontSize: isMobile ? 32 : 48, fontWeight: 700, color: '#0B3C6A', marginBottom: 16, textAlign: 'center', padding: isMobile ? '0 20px' : undefined }}>
            Learning <span style={{ color: '#FF6B2C' }}>Pathways</span>
          </h1>
          <div style={{ color: '#64748B', fontSize: isMobile ? 18 : 22, marginBottom: 48, textAlign: 'center', maxWidth: 700, fontWeight: 500, padding: isMobile ? '0 20px' : undefined }}>
            Structured learning journeys that elevate the experience from single lessons to genuine skill development.
          </div>

          {/* Progress Overview (This remains unchanged) */}
          <div style={{
            background: '#F8FAFC',
            borderRadius: 24,
            padding: 32,
            marginBottom: 48,
            display: 'flex',
            gap: 48,
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: 800
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#22C55E' }}>2</div>
              <div style={{ color: '#6B7280', fontSize: 16 }}>Active Pathways</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#FF6B2C' }}>37.5%</div>
              <div style={{ color: '#6B7280', fontSize: 16 }}>Average Progress</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#0B3C6A' }}>900</div>
              <div style={{ color: '#6B7280', fontSize: 16 }}>Total Points Earned</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: 40,
            justifyContent: 'center',
            width: '100%',
            maxWidth: 1400,
            flexWrap: 'wrap',
          }}>
            {learningPathways.map((card) => (
              <div
                key={card.title}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  border: '1.5px solid #BDBDBD',
                  minWidth: 370,
                  maxWidth: 400,
                  flex: '1 1 370px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  position: 'relative',
                  margin: 12,
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{ height: 140, width: '100%', background: '#F3F4F6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={card.image} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ height: 0, borderBottom: '3px solid #111', width: '100%' }} />
                <div style={{ padding: 28, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ color: card.levelColor, fontWeight: 700 }}>{card.level}</span>
                    <span style={{ color: card.pointsColor, fontWeight: 700 }}>{card.points} pts</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 4 }}>{card.title}</div>
                  <div style={{ color: '#444', fontSize: 17, marginBottom: 12 }}>{card.description}</div>
                  
                  {/* --- MODIFIED: The progress bar and stats divs have been removed --- */}
                  <div style={{ color: '#444', fontSize: 16, marginBottom: 8 }}>Progress</div>
                  <div style={{ color: card.levelColor, fontWeight: 600, fontSize: 15, marginBottom: 18 }}>
                    {card.progressText}
                  </div>
                  
                  <button
                    style={{
                      width: '100%',
                      background: card.questId ? card.button.color : '#E5E7EB',
                      color: card.questId ? '#fff' : '#888',
                      fontWeight: 700,
                      fontSize: 18,
                      border: 'none',
                      borderRadius: 10,
                      padding: '16px 0',
                      cursor: card.questId ? 'pointer' : 'not-allowed',
                      opacity: card.questId ? 1 : 0.7,
                      marginTop: 'auto',
                      transition: 'background 0.2s',
                    }}
                    disabled={!card.questId}
                    onClick={() => handleJourneyClick(card.questId)}
                  >
                    {card.button.text}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action (This remains unchanged) */}
          <div style={{
            background: '#F8FAFC',
            borderRadius: 24,
            padding: 48,
            marginTop: 48,
            textAlign: 'center',
            maxWidth: 600
          }}>
            <h3 style={{ fontSize: 28, fontWeight: 700, color: '#0B3C6A', marginBottom: 16 }}>
              Want to unlock more pathways?
            </h3>
            <p style={{ color: '#1F2937', fontSize: 18, marginBottom: 24 }}>
              Complete your current pathways and discover new STEM concepts to unlock advanced learning journeys!
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
    </>
  );
};

export default PathwaysPage;
