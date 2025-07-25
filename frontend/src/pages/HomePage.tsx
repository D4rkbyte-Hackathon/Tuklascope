import Navbar from '../components/Navbar';
import { useState } from 'react';
import { DiscoveryModal } from '../components/DiscoveryModal';
import { useChatbotActions } from '../hooks/useChatbotActions';
import { useNavigate } from 'react-router-dom';
import { RecentDiscoveries, RecentDiscovery } from '../components/RecentDiscoveries';
import { GamificationHeader } from '../components/GamificationHeader';

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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
          padding: '20px 0',
        }}
      >
        <GamificationHeader />
        <div
          className="homepage-flex"
          style={{
            display: "flex",
            gap: 64,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            maxWidth: 1400,
            padding: "0 3rem",
          }}
        >
          {/* Left Section */}
          <div className="homepage-left" style={{ maxWidth: 700 }}>
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
          <div className="homepage-right" style={{ minWidth: 480, maxWidth: 540, background: "#fff", borderRadius: 36, boxShadow: "0 8px 32px rgba(0,0,0,0.10)", padding: 48 }}>
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

      {/* Mobile-specific styles */}
      <style>{`
        @media (max-width: 768px) {
          .homepage-flex {
            flex-direction: column !important;
            gap: 32px !important;
            padding: 0 16px !important;
          }
          
          .homepage-left {
            width: 100% !important;
            text-align: center !important;
          }
          
          .homepage-left h1 {
            font-size: 2.5rem !important;
            margin-bottom: 24px !important;
          }
          
          .homepage-left p {
            font-size: 18px !important;
            margin-bottom: 32px !important;
            line-height: 1.5 !important;
          }
          
          .homepage-left > div {
            padding: 24px 20px !important;
            border-radius: 20px !important;
            margin-bottom: 32px !important;
          }
          
          .homepage-left > div > div:first-child {
            font-size: 18px !important;
          }
          
          .homepage-left > div > div:nth-child(2) {
            font-size: 16px !important;
            margin-bottom: 16px !important;
            line-height: 1.4 !important;
          }
          
          .homepage-left button {
            padding: 12px 20px !important;
            font-size: 16px !important;
            min-height: 44px !important;
            width: 100% !important;
            max-width: 300px !important;
          }
          
          .homepage-right {
            width: 100% !important;
            min-width: auto !important;
            border-radius: 24px !important;
            padding: 32px 24px !important;
            text-align: center !important;
          }
          
          .homepage-right > div:first-child {
            font-size: 24px !important;
            margin-bottom: 12px !important;
          }
          
          .homepage-right > div:nth-child(2) {
            font-size: 16px !important;
            margin-bottom: 32px !important;
            line-height: 1.4 !important;
          }
          
          .homepage-right button {
            font-size: 18px !important;
            padding: 20px 0 !important;
            min-height: 60px !important;
            margin-bottom: 32px !important;
          }
          
          .homepage-right > div:last-child {
            font-size: 16px !important;
            margin-bottom: 16px !important;
            text-align: left !important;
          }
          
          section:first-of-type {
            padding: 20px 16px !important;
          }
          
          section:last-of-type {
            padding: 48px 16px !important;
          }
          
          section:last-of-type h2 {
            font-size: 28px !important;
          }
          
          section:last-of-type > div > div:nth-child(2) {
            font-size: 16px !important;
            margin-bottom: 40px !important;
            line-height: 1.5 !important;
          }
          
          section:last-of-type > div > div:last-child {
            flex-direction: column !important;
            gap: 20px !important;
            max-width: 400px !important;
          }
          
          section:last-of-type > div > div:last-child > div {
            padding: 24px 20px !important;
            width: 100% !important;
            min-height: 120px !important;
            border-radius: 20px !important;
          }
          
          section:last-of-type > div > div:last-child > div > div:first-child {
            width: 60px !important;
            height: 60px !important;
            margin-bottom: 16px !important;
          }
          
          section:last-of-type > div > div:last-child > div > div:first-child > span {
            font-size: 24px !important;
          }
          
          section:last-of-type > div > div:last-child > div h3 {
            font-size: 20px !important;
            margin-bottom: 8px !important;
          }
          
          section:last-of-type > div > div:last-child > div p {
            font-size: 14px !important;
            margin-bottom: 16px !important;
            line-height: 1.4 !important;
          }
          
          section:last-of-type > div > div:last-child > div > div:last-child {
            font-size: 16px !important;
          }
        }
        
        @media (max-width: 480px) {
          .homepage-left h1 {
            font-size: 2rem !important;
          }
          
          .homepage-left p {
            font-size: 16px !important;
          }
          
          .homepage-right > div:first-child {
            font-size: 20px !important;
          }
          
          .homepage-right > div:nth-child(2) {
            font-size: 14px !important;
          }
          
          .homepage-right button {
            font-size: 16px !important;
          }
          
          section:last-of-type h2 {
            font-size: 24px !important;
          }
          
          section:last-of-type > div > div:nth-child(2) {
            font-size: 14px !important;
          }
        }
      `}</style>
    </>
  );
};

export default HomePage; 