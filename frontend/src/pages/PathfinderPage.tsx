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