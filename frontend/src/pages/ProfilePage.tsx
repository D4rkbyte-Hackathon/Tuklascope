import React from 'react';
import Navbar from '../components/Navbar';
import ChatbotButton from '../components/ChatbotButton';

const ProfilePage = () => {
  return (
    <>
      <Navbar />
      <ChatbotButton />
      <div style={{ minHeight: '100vh', background: '#fff', padding: '48px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: 1400, padding: '0 32px' }}>
          <h1 style={{ fontWeight: 800, fontSize: 44, color: '#0B3C6A', marginBottom: 0, letterSpacing: 1 }}>Your Profile</h1>
          <div style={{ color: '#1F2937', fontSize: 18, marginBottom: 36, marginTop: 4 }}>Track your STEM learning journey</div>
          <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            {/* Left: User Card & Achievements */}
            <div style={{ flex: '0 0 350px', display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 320 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#FF6B2C', color: '#fff', fontWeight: 700, fontSize: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>J</div>
                <div style={{ fontWeight: 700, fontSize: 24, color: '#0B3C6A', marginBottom: 2 }}>juan_dela_cruz</div>
                <div style={{ color: '#888', fontSize: 16, marginBottom: 18 }}>Jhs Student</div>
                <div style={{ color: '#2563EB', fontWeight: 700, fontSize: 18, marginBottom: 2 }}>Total Points</div>
                <div style={{ color: '#FF6B2C', fontWeight: 800, fontSize: 32, marginBottom: 8 }}>2456</div>
                <div style={{ color: '#2563EB', fontWeight: 700, fontSize: 18, marginBottom: 2 }}>Current Streak</div>
                <div style={{ color: '#FF6B2C', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>12 days</div>
                {/* Progress Bar */}
                <div style={{ width: '100%', height: 10, background: '#F3F4F6', borderRadius: 8, marginBottom: 8 }}>
                  <div style={{ width: '80%', height: '100%', background: 'linear-gradient(90deg, #FF6B2C 60%, #FFC371 100%)', borderRadius: 8 }} />
                </div>
                <div style={{ color: '#888', fontSize: 15 }}>544 points to next level</div>
              </div>
              {/* Achievements */}
              <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 32, minWidth: 320 }}>
                <div style={{ fontWeight: 700, fontSize: 22, color: '#0B3C6A', marginBottom: 18 }}>Recent Achievements</div>
                <div style={{ marginBottom: 18 }}>
                  <div style={{ color: '#2563EB', fontWeight: 700, fontSize: 17, marginBottom: 2, cursor: 'pointer' }}>Plant Expert</div>
                  <div style={{ color: '#444', fontSize: 15 }}>Discovered 10 plant species</div>
                </div>
                <div style={{ marginBottom: 4 }}>
                  <div style={{ color: '#FF6B2C', fontWeight: 700, fontSize: 17 }}>Streak Master</div>
                </div>
                <div style={{ color: '#444', fontSize: 15, marginLeft: 24 }}>Maintained 10-day streak</div>
              </div>
            </div>
            {/* Right: Skill Progress & Discoveries */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 32, minWidth: 400 }}>
              <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 32, minHeight: 90 }}>
                <div style={{ fontWeight: 700, fontSize: 26, color: '#1F2937', marginBottom: 12 }}>Skill Progress</div>
                {/* Placeholder for skill progress chart or info */}
              </div>
              <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 32, minHeight: 120 }}>
                <div style={{ fontWeight: 700, fontSize: 26, color: '#1F2937', marginBottom: 12 }}>Recent Discoveries</div>
                <div style={{ color: '#2563EB', fontSize: 17, marginTop: 24 }}>No discoveries yet. Start exploring!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage; 