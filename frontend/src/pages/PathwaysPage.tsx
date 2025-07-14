import Navbar from '../components/Navbar';
import { useChatbotActions } from '../hooks/useChatbotActions';
import React, { useState, useEffect } from 'react';

const learningPathways = [
  {
    level: 'Beginner',
    levelColor: '#22C55E',
    title: 'Kitchen Chemist',
    points: 500,
    pointsColor: '#F9A825',
    description: 'Discover chemistry principles using everyday kitchen materials and ingredients.',
    stats: '5 quests • 2-3 hours\n644 students completed',
    progress: 0.5,
    progressText: '50% completed',
    button: { text: 'Continue Journey', color: '#22C55E', disabled: false },
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=400&h=120',
  },
  {
    level: 'Intermediate',
    levelColor: '#2563EB',
    title: 'Backyard Ecologist',
    points: 750,
    pointsColor: '#F9A825',
    description: 'Explore biodiversity and ecosystem relationships in your local environment.',
    stats: '7 quests • 4-5 hours\n629 students completed',
    progress: 0,
    progressText: 'Not Started',
    button: { text: 'Start Journey', color: '#2563EB', disabled: false },
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=120',
  },
  {
    level: 'Advanced',
    levelColor: '#DC2626',
    title: 'Code Creator',
    points: 1000,
    pointsColor: '#F9A825',
    description: 'Learn programming concepts through creative projects and real-world applications.',
    stats: '10 quests • 8-10 hours\n1347 students completed',
    progress: null,
    progressText: 'Locked',
    button: { text: 'Unlock Previous Requirement', color: '#E5E7EB', disabled: true },
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=120',
  },
  {
    level: 'Beginner',
    levelColor: '#22C55E',
    title: 'Math in Nature',
    points: 400,
    pointsColor: '#F9A825',
    description: 'Find mathematical patterns in natural phenomena around you.',
    stats: '4 quests • 1-2 hours\n892 students completed',
    progress: 0.25,
    progressText: '25% completed',
    button: { text: 'Continue Journey', color: '#22C55E', disabled: false },
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=facearea&w=400&h=120',
  },
  {
    level: 'Intermediate',
    levelColor: '#2563EB',
    title: 'Physics Explorer',
    points: 600,
    pointsColor: '#F9A825',
    description: 'Understand physics concepts through hands-on experiments and observations.',
    stats: '6 quests • 3-4 hours\n445 students completed',
    progress: 0,
    progressText: 'Not Started',
    button: { text: 'Start Journey', color: '#2563EB', disabled: false },
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=facearea&w=400&h=120',
  },
  {
    level: 'Advanced',
    levelColor: '#DC2626',
    title: 'Engineering Innovator',
    points: 1200,
    pointsColor: '#F9A825',
    description: 'Design and build solutions to real-world problems using engineering principles.',
    stats: '12 quests • 10-12 hours\n234 students completed',
    progress: null,
    progressText: 'Locked',
    button: { text: 'Unlock Previous Requirement', color: '#E5E7EB', disabled: true },
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=facearea&w=400&h=120',
  },
];

const PathwaysPage = () => {
  const { openChatbot } = useChatbotActions();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

          {/* Progress Overview */}
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
            {learningPathways.map((card, idx) => (
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
                  cursor: card.button.disabled ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!card.button.disabled) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
                }}
                onClick={() => {
                  if (!card.button.disabled) {
                    openChatbot();
                  }
                }}
              >
                {/* Image above the line */}
                <div style={{ height: 140, width: '100%', background: '#F3F4F6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={card.image} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                {/* Divider line */}
                <div style={{ height: 0, borderBottom: '3px solid #111', width: '100%' }} />
                {/* Card Content */}
                <div style={{ padding: 28, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ color: card.levelColor, fontWeight: 700 }}>{card.level}</span>
                    <span style={{ color: card.pointsColor, fontWeight: 700 }}>{card.points} pts</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 4 }}>{card.title}</div>
                  <div style={{ color: '#444', fontSize: 17, marginBottom: 12 }}>{card.description}</div>
                  <div style={{ color: '#888', fontSize: 15, marginBottom: 8, whiteSpace: 'pre-line' }}>{card.stats}</div>
                  <div style={{ color: '#444', fontSize: 16, marginBottom: 8 }}>Progress</div>
                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: 10, background: '#E5E7EB', borderRadius: 8, marginBottom: 8 }}>
                    {card.progress !== null && (
                      <div style={{ width: `${card.progress * 100}%`, height: '100%', background: card.levelColor, borderRadius: 8 }} />
                    )}
                  </div>
                  <div style={{ color: card.progress === null ? '#888' : card.levelColor, fontWeight: 600, fontSize: 15, marginBottom: 18 }}>{card.progressText}</div>
                  <button
                    style={{
                      width: '100%',
                      background: card.button.color,
                      color: card.button.disabled ? '#888' : '#fff',
                      fontWeight: 700,
                      fontSize: 18,
                      border: 'none',
                      borderRadius: 10,
                      padding: '16px 0',
                      cursor: card.button.disabled ? 'not-allowed' : 'pointer',
                      opacity: card.button.disabled ? 0.7 : 1,
                      marginTop: 'auto',
                      transition: 'background 0.2s',
                    }}
                    disabled={card.button.disabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!card.button.disabled) {
                        openChatbot();
                      }
                    }}
                  >
                    {card.button.text}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
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