import Navbar from '../components/Navbar';
import { useChatbotActions } from '../hooks/useChatbotActions';
import { useState, useEffect } from 'react';

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
  const [pathfinderData, setPathfinderData] = useState<PathfinderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get skills from localStorage
  const getUserSkillsForAPI = () => {
    const stored = localStorage.getItem('tuklascope_skills');
    const skills = stored ? JSON.parse(stored) : [];
    const skillsObject: Record<string, number> = {};
    skills.forEach((skill: any) => {
      skillsObject[skill.skill_name] = 75; // Default mastery for demo
    });
    return skillsObject;
  };

  const mockGradeLevel = "Junior High School";

  useEffect(() => {
    const newDiscovery = localStorage.getItem('tuklascope_new_discovery') === 'true';
    if (!newDiscovery) {
      // Try to load last result from localStorage
      const lastResult = localStorage.getItem('tuklascope_pathfinder_result');
      if (lastResult) {
        setPathfinderData(JSON.parse(lastResult));
      }
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
            grade_level: mockGradeLevel
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPathfinderData(data);
        // Save result to localStorage
        localStorage.setItem('tuklascope_pathfinder_result', JSON.stringify(data));
        // Clear the new discovery flag
        localStorage.setItem('tuklascope_new_discovery', 'false');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pathfinder data');
        setPathfinderData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPathfinderData();
  }, []);

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
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, color: '#0B3C6A', marginBottom: 16 }}>
              Analyzing your STEM journey...
            </div>
            <div style={{ color: '#1F2937' }}>
              Our AI is crafting personalized recommendations for you
            </div>
          </div>
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
          <h1 style={{ fontSize: 48, fontWeight: 700, color: '#0B3C6A', marginBottom: 16, textAlign: 'center' }}>
            {pathfinderData.title}
          </h1>
          <div style={{ color: '#1F2937', fontSize: 22, marginBottom: 48, textAlign: 'center', maxWidth: 700 }}>
            {pathfinderData.summary}
          </div>
          
          {/* Current Level Badge */}
          <div style={{ 
            background: '#FF6B2C', 
            color: '#fff', 
            padding: '12px 32px', 
            borderRadius: 24, 
            fontWeight: 700, 
            fontSize: 20, 
            marginBottom: 64,
            marginTop: 8
          }}>
            {mockGradeLevel} Student
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

export default PathfinderPage; 