PathfinderPage.tsk
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useChatbotActions } from '../hooks/useChatbotActions';
import { useUserSkills } from '../hooks/useUserSkills';
import { useUserEducation } from '../hooks/useUserEducation';

// LoadingIndicator copied from SparkResultsPage
const LoadingIndicator = ({ text }: { text: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '300px', gap: '20px' }}>
    <div style={{
      border: '8px solid #f3f3f3', borderTop: '8px solid #FF6B2C',
      borderRadius: '50%', width: '60px', height: '60px',
      animation: 'spin 1.2s linear infinite'
    }}></div>
    <p style={{ color: '#0B3C6A', fontWeight: 'bold', fontSize: '18px' }}>{text}</p>
    <style>{`
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `}</style>
  </div>
);

// Types for the API response
interface PathfinderRecommendation {
  type: string;
  name: string;
  why: string;
  whats_next?: string;
  inspiration?: {
    name: string;
    description: string;
  };
  career_paths?: string[];
  local_spotlight?: string[];
}

interface PathfinderResponse {
  title: string;
  summary: string;
  strongest_fields: Array<{
    skill: string;
    score: number;
  }>;
  recommendations: PathfinderRecommendation[];
}

const PathfinderPage = () => {
  const { openChatbot } = useChatbotActions();
  const { userSkills, loading: skillsLoading } = useUserSkills();
  const { education, loading: educationLoading } = useUserEducation();
  const [pathfinderData, setPathfinderData] = useState<PathfinderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get skills from Firebase instead of localStorage
  const getUserSkillsForAPI = () => {
    const skillsObject: Record<string, number> = {};
    Object.values(userSkills).forEach((skill: any) => {
      skillsObject[skill.skill_name] = skill.mastery_level || 75; // Use actual mastery level
    });
    return skillsObject;
  };

  // Function to clear pathfinder cache
  const clearPathfinderCache = () => {
    localStorage.removeItem('tuklascope_pathfinder_result');
    localStorage.removeItem('tuklascope_pathfinder_skills_hash');
    localStorage.removeItem('tuklascope_pathfinder_education');
  };

  useEffect(() => {
    // Only proceed if we have skills data and education data
    if (skillsLoading || educationLoading) return;

    const skills = Object.values(userSkills);
    if (skills.length === 0) {
      // No skills yet, show empty state
      setLoading(false);
      return;
    }

    // Create a hash of current skills to detect changes
    const skillsHash = JSON.stringify(getUserSkillsForAPI());
    const lastSkillsHash = localStorage.getItem('tuklascope_pathfinder_skills_hash');
    const lastEducation = localStorage.getItem('tuklascope_pathfinder_education');
    
    // Check if we can use cached result (same skills and education)
    const lastResult = localStorage.getItem('tuklascope_pathfinder_result');
    if (lastResult && lastSkillsHash === skillsHash && lastEducation === education) {
      setPathfinderData(JSON.parse(lastResult));
      setLoading(false);
      return;
    }

    const fetchPathfinderData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:8000/api/pathfinder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_skills: getUserSkillsForAPI(),
            grade_level: education || 'Junior High (Grades 7-10)' // Fallback to default if no education level
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPathfinderData(data);
        // Save result to localStorage along with skills hash and education level
        localStorage.setItem('tuklascope_pathfinder_result', JSON.stringify(data));
        localStorage.setItem('tuklascope_pathfinder_skills_hash', skillsHash);
        localStorage.setItem('tuklascope_pathfinder_education', education || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pathfinder data');
        setPathfinderData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPathfinderData();
  }, [userSkills, skillsLoading, education, educationLoading]);

  if (loading) {
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
          <LoadingIndicator text="Analyzing your STEM journey..." />
        </section>
      </>
    );
  }

  if (error && !pathfinderData) {
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
          <div style={{ textAlign: 'center', maxWidth: 600 }}>
            <div style={{ fontSize: 24, color: '#DC2626', marginBottom: 16 }}>
              Oops! Something went wrong
            </div>
            <div style={{ color: '#1F2937', marginBottom: 24 }}>
              {error}
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#FF6B2C',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '12px 24px',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        </section>
      </>
    );
  }

  if (!pathfinderData) {
    // Check if user has no skills yet
    const skills = Object.values(userSkills);
    if (skills.length === 0) {
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
            <div style={{ textAlign: 'center', maxWidth: 600 }}>
              <div style={{ fontSize: 32, color: '#0B3C6A', marginBottom: 16, fontWeight: 700 }}>
                Start Your STEM Journey!
              </div>
              <div style={{ color: '#1F2937', marginBottom: 32, fontSize: 18 }}>
                Complete some discoveries first to get personalized career and academic guidance.
              </div>
              <button
                onClick={() => openChatbot()}
                style={{
                  background: '#FF6B2C',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '16px 32px',
                  fontSize: 18,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Start Discovery
              </button>
            </div>
          </section>
        </>
      );
    }
    return null;
  }

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
          <h1 style={{ fontSize: isMobile ? 32 : 48, fontWeight: 700, color: '#0B3C6A', marginBottom: 16, textAlign: 'center', padding: isMobile ? '0 20px' : undefined }}>
            {pathfinderData.title}
          </h1>
          <div style={{ color: '#1F2937', fontSize: isMobile ? 18 : 22, marginBottom: 48, textAlign: 'center', maxWidth: 700, padding: isMobile ? '0 20px' : undefined }}>
            {pathfinderData.summary}
          </div>
          
          {/* Current Level Badge */}
          <div style={{ 
            background: '#FF6B2C', 
            color: '#fff', 
            padding: isMobile ? '8px 16px' : '12px 32px',
            borderRadius: 24, 
            fontWeight: 700, 
            fontSize: isMobile ? 16 : 20, 
            marginBottom: 32,
            marginTop: 8
          }}>
            {education || 'Junior High (Grades 7-10)'} Student
          </div>

          {/* Last Updated Indicator */}
          <div style={{ 
            color: '#6B7280', 
            fontSize: 14, 
            marginBottom: 64,
            textAlign: 'center'
          }}>
            Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </div>

          {/* Strongest Fields Section */}
          {pathfinderData.strongest_fields.length > 0 && (
            <div style={{
              background: '#fff',
              borderRadius: 24,
              boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
              padding: 40,
              marginBottom: 48,
              maxWidth: 800,
              width: '100%'
            }}>
              <h3 style={{ 
                fontSize: 28, 
                fontWeight: 700, 
                color: '#0B3C6A', 
                marginBottom: 24, 
                textAlign: 'center' 
              }}>
                Your Strongest STEM Fields
              </h3>
              <div style={{
                display: 'flex',
                gap: 24,
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                {pathfinderData.strongest_fields.map((field, idx) => (
                  <div key={field.skill} style={{
                    background: '#F6FDF8',
                    borderRadius: 16,
                    padding: 24,
                    border: '2px solid #22C55E',
                    minWidth: 200,
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      fontWeight: 700, 
                      fontSize: 20, 
                      color: '#0B3C6A', 
                      marginBottom: 8 
                    }}>
                      {field.skill}
                    </div>
                    <div style={{ 
                      fontSize: 32, 
                      fontWeight: 700, 
                      color: '#22C55E' 
                    }}>
                      {field.score}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations Grid */}
          {pathfinderData.recommendations.length > 0 && (
            <div style={{
              display: 'flex',
              gap: 56,
              justifyContent: 'center',
              width: '100%',
              maxWidth: 1400,
              flexWrap: 'wrap',
              marginBottom: 80,
            }}>
              {pathfinderData.recommendations.map((rec, idx) => (
                <div
                  key={rec.name}
                  style={{
                    background: '#fff',
                    borderRadius: 24,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                    padding: 40,
                    minWidth: 380,
                    maxWidth: 420,
                    flex: '1 1 380px',
                    border: `2px solid ${idx === 0 ? '#22C55E' : '#2563EB'}`,
                    position: 'relative',
                    margin: 16,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  onClick={() => openChatbot()}
                >
                  {/* Type Badge */}
                  <div style={{ 
                    background: idx === 0 ? '#F6FDF8' : '#F2F7FF', 
                    color: idx === 0 ? '#22C55E' : '#2563EB', 
                    padding: '6px 16px', 
                    borderRadius: 16, 
                    fontWeight: 700, 
                    fontSize: 14, 
                    display: 'inline-block',
                    marginBottom: 16,
                    textTransform: 'uppercase'
                  }}>
                    {rec.type}
                  </div>

                  <h3 style={{ 
                    fontSize: 28, 
                    fontWeight: 700, 
                    color: '#0B3C6A', 
                    marginBottom: 16,
                    lineHeight: 1.2
                  }}>
                    {rec.name}
                  </h3>

                  <p style={{ 
                    color: '#1F2937', 
                    fontSize: 16, 
                    lineHeight: 1.6, 
                    marginBottom: 24 
                  }}>
                    {rec.why}
                  </p>

                  {/* What's Next */}
                  {rec.whats_next && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ 
                        fontWeight: 700, 
                        color: '#0B3C6A', 
                        fontSize: 16, 
                        marginBottom: 12 
                      }}>
                        What's Next:
                      </div>
                      <p style={{ 
                        color: '#1F2937', 
                        fontSize: 14, 
                        lineHeight: 1.5 
                      }}>
                        {rec.whats_next}
                      </p>
                    </div>
                  )}

                  {/* Career Paths */}
                  {rec.career_paths && rec.career_paths.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ 
                        fontWeight: 700, 
                        color: '#0B3C6A', 
                        fontSize: 16, 
                        marginBottom: 12 
                      }}>
                        Career Paths:
                      </div>
                      <ul style={{ 
                        listStyle: 'none', 
                        padding: 0, 
                        margin: 0 
                      }}>
                        {rec.career_paths.map((career, careerIdx) => (
                          <li key={careerIdx} style={{ 
                            color: '#1F2937', 
                            fontSize: 14, 
                            marginBottom: 8, 
                            paddingLeft: 20,
                            position: 'relative'
                          }}>
                            <span style={{ 
                              position: 'absolute', 
                              left: 0, 
                              top: 6, 
                              width: 6, 
                              height: 6, 
                              borderRadius: '50%', 
                              background: idx === 0 ? '#22C55E' : '#2563EB'
                            }} />
                            {career}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Local Spotlight */}
                  {rec.local_spotlight && rec.local_spotlight.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ 
                        fontWeight: 700, 
                        color: '#0B3C6A', 
                        fontSize: 16, 
                        marginBottom: 12 
                      }}>
                        Top Philippine Universities:
                      </div>
                      <ul style={{ 
                        listStyle: 'none', 
                        padding: 0, 
                        margin: 0 
                      }}>
                        {rec.local_spotlight.map((university, uniIdx) => (
                          <li key={uniIdx} style={{ 
                            color: '#1F2937', 
                            fontSize: 14, 
                            marginBottom: 8, 
                            paddingLeft: 20,
                            position: 'relative'
                          }}>
                            <span style={{ 
                              position: 'absolute', 
                              left: 0, 
                              top: 6, 
                              width: 6, 
                              height: 6, 
                              borderRadius: '50%', 
                              background: idx === 0 ? '#22C55E' : '#2563EB'
                            }} />
                            {university}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Inspiration */}
                  {rec.inspiration && (
                    <div style={{
                      background: '#FFF9E5',
                      borderRadius: 16,
                      padding: 20,
                      border: '2px solid #F9A825',
                      marginTop: 24
                    }}>
                      <div style={{ 
                        fontWeight: 700, 
                        color: '#0B3C6A', 
                        fontSize: 16, 
                        marginBottom: 8 
                      }}>
                        💡 Filipino Inspiration: {rec.inspiration.name}
                      </div>
                      <div style={{ 
                        color: '#1F2937', 
                        fontSize: 14, 
                        lineHeight: 1.5 
                      }}>
                        {rec.inspiration.description}
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
              Want more personalized guidance?
            </h3>
            <p style={{ color: '#1F2937', fontSize: 18, marginBottom: 24 }}>
              Continue discovering STEM concepts to get even more accurate career and academic recommendations!
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
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
              <button
                onClick={() => {
                  clearPathfinderCache();
                  window.location.reload();
                }}
                style={{
                  background: '#fff',
                  color: '#0B3C6A',
                  border: '2px solid #0B3C6A',
                  borderRadius: 12,
                  padding: '16px 32px',
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#0B3C6A';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = '#0B3C6A';
                }}
              >
                Refresh Recommendations
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PathfinderPage; 


PathwaysPage.tsx
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

SkillTree.tsx
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