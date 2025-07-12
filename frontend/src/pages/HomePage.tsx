import Navbar from '../components/Navbar';

const skillTreeData = [
  {
    subject: 'Biology',
    color: '#22C55E',
    bg: '#F6FDF8',
    xp: 240,
    level: 3,
    mastered: 7,
    progress: 0.65,
    icon: (
      <svg width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="32" stroke="#E5E7EB" strokeWidth="8" fill="none" /><circle cx="40" cy="40" r="32" stroke="#22C55E" strokeWidth="8" fill="none" strokeDasharray="201" strokeDashoffset="70" strokeLinecap="round" /></svg>
    ),
  },
  {
    subject: 'Chemistry',
    color: '#FF6B2C',
    bg: '#FFF7F2',
    xp: 120,
    level: 2,
    mastered: 4,
    progress: 0.35,
    icon: <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#FF6B2C' }} />,
  },
  {
    subject: 'Physics',
    color: '#0B3C6A',
    bg: '#F2F7FF',
    xp: 60,
    level: 1,
    mastered: 2,
    progress: 0.18,
    icon: <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#0B3C6A' }} />,
  },
  {
    subject: 'Mathematics',
    color: '#F9A825',
    bg: '#FFF9E5',
    xp: 320,
    level: 4,
    mastered: 10,
    progress: 0.85,
    icon: <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#F9A825' }} />,
  },
];

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
];

// Pathfinder AI guidance data
const pathfinderGuidance = {
  currentLevel: 'JHS', // or 'SHS'
  recommendations: [
    {
      type: 'strand',
      title: 'STEM Strand',
      confidence: 85,
      color: '#22C55E',
      bg: '#F6FDF8',
      description: 'Your strong performance in Mathematics (Level 4) and Physics (Level 1) shows excellent analytical thinking and problem-solving skills.',
      reasons: [
        'Mathematics: Level 4 with 320 XP',
        'Physics: Level 1 with 60 XP',
        'Chemistry: Level 2 with 120 XP'
      ],
      nextSteps: [
        'Focus on advanced Physics concepts',
        'Explore programming fundamentals',
        'Consider joining STEM clubs or competitions'
      ]
    },
    {
      type: 'career',
      title: 'Computer Engineering',
      confidence: 78,
      color: '#2563EB',
      bg: '#F2F7FF',
      description: 'Your combination of Mathematics mastery and growing Physics skills makes you an excellent candidate for computer engineering programs.',
      reasons: [
        'Strong mathematical foundation (Level 4)',
        'Logical thinking demonstrated in Physics',
        'Interest in technology and problem-solving'
      ],
      nextSteps: [
        'Take advanced Mathematics courses',
        'Learn basic programming languages',
        'Explore electronics and circuits'
      ]
    },
    {
      type: 'career',
      title: 'Data Science',
      confidence: 72,
      color: '#F9A825',
      bg: '#FFF9E5',
      description: 'Your analytical skills and mathematical thinking align perfectly with data science career paths.',
      reasons: [
        'Mathematics: Level 4 (320 XP)',
        'Biology: Level 3 (240 XP)',
        'Strong pattern recognition abilities'
      ],
      nextSteps: [
        'Develop statistical analysis skills',
        'Learn Python programming',
        'Practice data visualization'
      ]
    }
  ],
  insights: [
    {
      category: 'Strengths',
      items: ['Mathematical reasoning', 'Scientific curiosity', 'Analytical thinking']
    },
    {
      category: 'Growth Areas',
      items: ['Programming fundamentals', 'Advanced physics concepts', 'Chemistry applications']
    }
  ]
};

const HomePage = () => {
  return (
    <>
      <Navbar />
      {/* Discover Section */}
      <section
        style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            maxWidth: 1400,
            padding: "0 3rem",
            gap: 64,
          }}
        >
          {/* Left Section */}
          <div style={{ maxWidth: 700 }}>
            <h1 style={{ fontSize: "3.5rem", fontWeight: 700, color: "#0B3C6A", lineHeight: 1.1 }}>
              Discover <span style={{ color: "#FF6B2C" }}>STEM</span><br />Everywhere You Look
            </h1>
            <p style={{ marginTop: 40, fontSize: 24, color: "#1F2937" }}>
              Transform any object around you into a STEM learning adventure. Upload a photo and unlock the science behind everyday Filipino life!
            </p>
            <div style={{ marginTop: 48, border: "2px solid #FF6B2C", borderRadius: 24, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", background: "#fff" }}>
              <div style={{ fontWeight: 700, color: "#0B3C6A", fontSize: 22, marginBottom: 12 }}>
                Tuklas-Araw (Today's Discovery)
              </div>
              <div style={{ fontSize: 20, color: "#1F2937" }}>
                "Explore the science behind <b>Filipino rice terraces</b> - How do these ancient structures demonstrate physics and engineering?"
              </div>
            </div>
          </div>
          {/* Right Section */}
          <div style={{ minWidth: 480, maxWidth: 540, background: "#fff", borderRadius: 36, boxShadow: "0 8px 32px rgba(0,0,0,0.10)", padding: 48 }}>
            <div style={{ fontWeight: 700, fontSize: 32, color: "#0B3C6A", textAlign: "center" }}>Start Your Discovery</div>
            <div style={{ color: "#1F2937", textAlign: "center", marginBottom: 32, marginTop: 12, fontSize: 18 }}>
              Upload any photo to begin learning!
            </div>
            <div style={{ background: "#F5F6FA", borderRadius: 18, height: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 32, border: "1px solid #E5E7EB" }}>
              <div style={{ fontWeight: 500, fontSize: 22, color: "#1F2937" }}>Drop your photo here</div>
              <div style={{ color: "#6B7280", fontSize: 16, marginTop: 6 }}>or click to browse from your device</div>
            </div>
            <button style={{ width: "100%", background: "#FF6B2C", color: "#fff", fontWeight: 700, fontSize: 22, border: "none", borderRadius: 10, padding: "18px 0", marginBottom: 32, cursor: "pointer" }}>Take Photo</button>
            <div style={{ color: "#1F2937", fontWeight: 500, fontSize: 18, marginBottom: 12 }}>Recent discoveries:</div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 10, background: "#F3F4F6", overflow: "hidden" }}><img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=56&h=56" alt="recent1" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
              <div style={{ width: 56, height: 56, borderRadius: 10, background: "#F3F4F6", overflow: "hidden" }}><img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=56&h=56" alt="recent2" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
              <div style={{ width: 56, height: 56, borderRadius: 10, background: "#F3F4F6", overflow: "hidden" }}><img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=56&h=56" alt="recent3" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
            </div>
          </div>
        </div>
      </section>
      {/* STEM Skill Tree Section */}
      <section
        style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F8FAFC',
        }}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 400 }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, color: '#0B3C6A', marginBottom: 8, textAlign: 'center' }}>
            Your <span style={{ color: '#FF6B2C' }}>STEM Skill Tree</span>
          </h2>
          <div style={{ color: '#1F2937', fontSize: 20, marginBottom: 40, textAlign: 'center', maxWidth: 700 }}>
            Watch your knowledge grow! Every discovery adds to your personal skill tree and unlocks new learning pathways.
          </div>
          <div style={{
            display: 'flex',
            gap: 32,
            justifyContent: 'center',
            width: '100%',
            maxWidth: 1400,
            flexWrap: 'wrap',
          }}>
            {skillTreeData.map((card) => (
              <div
                key={card.subject}
                style={{
                  background: '#fff',
                  borderRadius: 32,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                  padding: 36,
                  minWidth: 280,
                  maxWidth: 320,
                  flex: '1 1 280px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  margin: 8,
                }}
              >
                {/* XP Badge */}
                <div style={{ position: 'absolute', top: 24, right: 24, background: '#FF6B2C', color: '#fff', borderRadius: 16, padding: '4px 16px', fontWeight: 700, fontSize: 16 }}>
                  XP: {card.xp}
                </div>
                {/* Icon or Progress */}
                <div style={{ marginBottom: 18 }}>{card.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 24, color: card.color, marginBottom: 4 }}>{card.subject}</div>
                <div style={{ color: '#1F2937', fontSize: 18, marginBottom: 18 }}>Level {card.level}</div>
                {/* Progress Bar */}
                <div style={{ width: '100%', height: 8, background: '#E5E7EB', borderRadius: 8, marginBottom: 18 }}>
                  <div style={{ width: `${card.progress * 100}%`, height: '100%', background: card.color, borderRadius: 8 }} />
                </div>
                <div style={{ color: '#6B7280', fontSize: 16 }}>
                  Concepts Mastered: <span style={{ color: card.color, fontWeight: 700 }}>{card.mastered}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Learning Pathways Section */}
      <section
        style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
        }}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 400 }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, color: '#0B3C6A', marginBottom: 8, textAlign: 'center', maxWidth: 700 }}>
            Learning Pathways
          </h2>
          <div style={{ color: '#64748B', fontSize: 22, marginBottom: 40, textAlign: 'center', maxWidth: 700, fontWeight: 500 }}>
            elevates the experience from single lessons to genuine skill development.<br />(placeholder)
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
                  >
                    {card.button.text}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Guide: Pathfinder AI Section */}
      <section
        style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F8FAFC',
          padding: '64px 0', // Added vertical padding
        }}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 400 }}>
          <h2 style={{ fontSize: 40, fontWeight: 700, color: '#0B3C6A', marginBottom: 8, textAlign: 'center' }}>
            Your <span style={{ color: '#FF6B2C' }}>Pathfinder AI Guide</span>
          </h2>
          <div style={{ color: '#1F2937', fontSize: 20, marginBottom: 40, textAlign: 'center', maxWidth: 700 }}>
            Get personalized guidance for your academic and career journey based on your STEM skill tree.
          </div>
          
          {/* Current Level Badge */}
          <div style={{ 
            background: '#FF6B2C', 
            color: '#fff', 
            padding: '8px 24px', 
            borderRadius: 20, 
            fontWeight: 700, 
            fontSize: 18, 
            marginBottom: 56, // Increased space below badge
            marginTop: 8
          }}>
            {pathfinderGuidance.currentLevel === 'JHS' ? 'Junior High School' : 'Senior High School'} Student
          </div>

          {/* Recommendations Grid */}
          <div style={{
            display: 'flex',
            gap: 56, // Increased horizontal gap
            justifyContent: 'center',
            width: '100%',
            maxWidth: 1400,
            flexWrap: 'wrap',
            marginBottom: 80, // Increased space below cards
          }}>
            {pathfinderGuidance.recommendations.map((rec, idx) => (
              <div
                key={rec.title}
                style={{
                  background: '#fff',
                  borderRadius: 24,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                  padding: 40, // More padding inside cards
                  minWidth: 380,
                  maxWidth: 420,
                  flex: '1 1 380px',
                  border: `2px solid ${rec.color}`,
                  position: 'relative',
                  margin: 16, // More margin around each card
                }}
              >
                {/* Confidence Badge */}
                <div style={{ 
                  position: 'absolute', 
                  top: 20, 
                  right: 20, 
                  background: rec.color, 
                  color: '#fff', 
                  borderRadius: 12, 
                  padding: '4px 12px', 
                  fontWeight: 700, 
                  fontSize: 14 
                }}>
                  {rec.confidence}% Match
                </div>

                {/* Type Badge */}
                <div style={{ 
                  background: rec.bg, 
                  color: rec.color, 
                  padding: '6px 16px', 
                  borderRadius: 16, 
                  fontWeight: 700, 
                  fontSize: 14, 
                  display: 'inline-block',
                  marginBottom: 16,
                  textTransform: 'uppercase'
                }}>
                  {rec.type === 'strand' ? 'Recommended Strand' : 'Career Path'}
                </div>

                <h3 style={{ 
                  fontSize: 28, 
                  fontWeight: 700, 
                  color: '#0B3C6A', 
                  marginBottom: 16,
                  lineHeight: 1.2
                }}>
                  {rec.title}
                </h3>

                <p style={{ 
                  color: '#1F2937', 
                  fontSize: 16, 
                  lineHeight: 1.6, 
                  marginBottom: 24 
                }}>
                  {rec.description}
                </p>

                {/* Reasons */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ 
                    fontWeight: 700, 
                    color: '#0B3C6A', 
                    fontSize: 16, 
                    marginBottom: 12 
                  }}>
                    Why this fits you:
                  </div>
                  <ul style={{ 
                    listStyle: 'none', 
                    padding: 0, 
                    margin: 0 
                  }}>
                    {rec.reasons.map((reason, reasonIdx) => (
                      <li key={reasonIdx} style={{ 
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
                          background: rec.color 
                        }} />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Next Steps */}
                <div>
                  <div style={{ 
                    fontWeight: 700, 
                    color: '#0B3C6A', 
                    fontSize: 16, 
                    marginBottom: 12 
                  }}>
                    Next Steps:
                  </div>
                  <ul style={{ 
                    listStyle: 'none', 
                    padding: 0, 
                    margin: 0 
                  }}>
                    {rec.nextSteps.map((step, stepIdx) => (
                      <li key={stepIdx} style={{ 
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
                          background: rec.color 
                        }} />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Insights Section */}
          <div style={{
            background: '#fff',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            padding: 48, // More padding
            width: '100%',
            maxWidth: 1000,
            margin: '40px 20px 0 20px' // More margin above
          }}>
            <h3 style={{ 
              fontSize: 28, 
              fontWeight: 700, 
              color: '#0B3C6A', 
              marginBottom: 32, 
              textAlign: 'center' 
            }}>
              Your Learning Insights
            </h3>
            
            <div style={{
              display: 'flex',
              gap: 40,
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {pathfinderGuidance.insights.map((insight, idx) => (
                <div key={insight.category} style={{ flex: '1 1 300px', minWidth: 300 }}>
                  <div style={{ 
                    fontWeight: 700, 
                    fontSize: 20, 
                    color: '#0B3C6A', 
                    marginBottom: 16,
                    textAlign: 'center'
                  }}>
                    {insight.category}
                  </div>
                  <div style={{
                    background: idx === 0 ? '#F6FDF8' : '#FFF7F2',
                    borderRadius: 16,
                    padding: 24,
                    border: `2px solid ${idx === 0 ? '#22C55E' : '#FF6B2C'}`
                  }}>
                    {insight.items.map((item, itemIdx) => (
                      <div key={itemIdx} style={{
                        color: '#1F2937',
                        fontSize: 16,
                        marginBottom: 12,
                        paddingLeft: 20,
                        position: 'relative'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: 0,
                          top: 8,
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: idx === 0 ? '#22C55E' : '#FF6B2C'
                        }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage; 