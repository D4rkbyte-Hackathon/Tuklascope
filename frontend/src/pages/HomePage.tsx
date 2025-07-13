import Navbar from '../components/Navbar';
import { useState } from 'react';
import { DiscoveryModal } from '../components/DiscoveryModal';
import { useChatbotActions } from '../hooks/useChatbotActions';
import { useNavigate } from 'react-router-dom';
import { RecentDiscoveries, RecentDiscovery } from '../components/RecentDiscoveries';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); //state for modal
  const { openChatbot } = useChatbotActions();
  const navigate = useNavigate();

  const handleRecentClick = (discovery: RecentDiscovery) => {
    navigate('/spark-results', { state: { recentDiscovery: discovery } });
  };

  return (
    <>
      <Navbar />
      {/* Discover Section */}
      <DiscoveryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
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
              <button
                onClick={openChatbot}
                style={{
                  marginTop: 16,
                  background: '#0B3C6A',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#1e40af'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#0B3C6A'}
              >
                Ask TuklasTutor about this
              </button>
            </div>
          </div>
          {/* Right Section - UPDATED */}
          <div style={{ minWidth: 480, maxWidth: 540, background: "#fff", borderRadius: 36, boxShadow: "0 8px 32px rgba(0,0,0,0.10)", padding: 48 }}>
            <div style={{ fontWeight: 700, fontSize: 32, color: "#0B3C6A", textAlign: "center" }}>What will you discover today?</div>
            <div style={{ color: "#1F2937", textAlign: "center", marginBottom: 48, marginTop: 12, fontSize: 18 }}>
              Upload a photo or use your camera to begin.
            </div>
            {/* --- SINGLE, UNIFIED BUTTON --- */}
            <button 
              onClick={() => setIsModalOpen(true)} 
              style={{
                width: "100%", 
                background: "#FF6B2C", 
                color: "#fff", 
                fontWeight: 700, 
                fontSize: 22,
                border: "none", 
                borderRadius: 10, 
                padding: "24px 0", 
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Start Discovery
            </button>
            <div style={{ color: "#1F2937", fontWeight: 500, fontSize: 18, marginBottom: 12, marginTop: 48 }}>Recent discoveries:</div>
            <RecentDiscoveries onSelect={handleRecentClick} />
          </div>
        </div>
      </section>

      {/* Quick Navigation Section */}
      <section
        style={{
          padding: '64px 0',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F8FAFC',
        }}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 1200 }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: '#0B3C6A', marginBottom: 16, textAlign: 'center' }}>
            Explore Your <span style={{ color: '#FF6B2C' }}>Learning Journey</span>
          </h2>
          <div style={{ color: '#1F2937', fontSize: 20, marginBottom: 48, textAlign: 'center', maxWidth: 700 }}>
            Track your progress, discover new pathways, and get personalized guidance for your STEM journey.
          </div>
          
          <div style={{
            display: 'flex',
            gap: 32,
            justifyContent: 'center',
            width: '100%',
            flexWrap: 'wrap',
          }}>
            {/* Skill Tree Card */}
            <div
              style={{
                background: '#fff',
                borderRadius: 24,
                boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                padding: 32,
                minWidth: 280,
                maxWidth: 320,
                flex: '1 1 280px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                border: '2px solid #22C55E',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              onClick={() => navigate('/skill-tree')}
            >
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#22C55E', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 32, fontWeight: 700 }}>🌳</span>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: '#0B3C6A', marginBottom: 12, textAlign: 'center' }}>
                STEM Skill Tree
              </h3>
              <p style={{ color: '#1F2937', fontSize: 16, textAlign: 'center', marginBottom: 24 }}>
                Track your progress across Biology, Chemistry, Physics, and Mathematics
              </p>
              <div style={{ color: '#22C55E', fontWeight: 700, fontSize: 18 }}>
                View Skill Tree →
              </div>
            </div>

            {/* Pathways Card */}
            <div
              style={{
                background: '#fff',
                borderRadius: 24,
                boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                padding: 32,
                minWidth: 280,
                maxWidth: 320,
                flex: '1 1 280px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                border: '2px solid #2563EB',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              onClick={() => navigate('/pathways')}
            >
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#2563EB', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 32, fontWeight: 700 }}>🛤️</span>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: '#0B3C6A', marginBottom: 12, textAlign: 'center' }}>
                Learning Pathways
              </h3>
              <p style={{ color: '#1F2937', fontSize: 16, textAlign: 'center', marginBottom: 24 }}>
                Structured learning journeys from beginner to advanced levels
              </p>
              <div style={{ color: '#2563EB', fontWeight: 700, fontSize: 18 }}>
                Explore Pathways →
              </div>
            </div>

            {/* Pathfinder Card */}
            <div
              style={{
                background: '#fff',
                borderRadius: 24,
                boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                padding: 32,
                minWidth: 280,
                maxWidth: 320,
                flex: '1 1 280px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                border: '2px solid #FF6B2C',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              onClick={() => navigate('/pathfinder')}
            >
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#FF6B2C', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 32, fontWeight: 700 }}>🧭</span>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: '#0B3C6A', marginBottom: 12, textAlign: 'center' }}>
                Pathfinder AI
              </h3>
              <p style={{ color: '#1F2937', fontSize: 16, textAlign: 'center', marginBottom: 24 }}>
                Get personalized career and academic guidance based on your skills
              </p>
              <div style={{ color: '#FF6B2C', fontWeight: 700, fontSize: 18 }}>
                Get Guidance →
              </div>
            </div>
          </div>
        </div>
      </section>




    </>
  );
};

export default HomePage; 