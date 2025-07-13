import React, {useEffect, useState} from 'react';
import Navbar from '../components/Navbar';
import ChatbotButton from '../components/ChatbotButton';
import { getAuth , doc, getDoc,  db} from '../database/firebase';
import { useNavigate } from 'react-router-dom';
import { RecentDiscoveries, RecentDiscovery } from '../components/RecentDiscoveries';

const ProfilePage = () => {
  const [userData, setUserData] = useState<{
      name: string;
      surname: string;
      email: string;
      education: string;
      city: string;
      country: string;
    } | null>(null);
  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      try{
        const userDoc = await getDoc(doc(db, 'Tuklascope-user', currentUser.uid));
        if (userDoc.exists()){
          const data = userDoc.data();
          setUserData({
          name: data.name || '',
          surname: data.surname || '',
          email: data.email || currentUser.email || '',
          education: data.education || '',
          city: data.city || '',
          country: data.country || '',
          });
        }
      }
      catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
     fetchUserData();
  }, []);
  const navigate = useNavigate();
  const handleRecentClick = (discovery: RecentDiscovery) => {
    navigate('/spark-results', { state: { recentDiscovery: discovery } });
  };
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
                <div style={{ fontWeight: 700, fontSize: 24, color: '#0B3C6A', marginBottom: 2 }}>{userData ? `${userData.name} ${userData.surname}` : 'Loading...'}</div>
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
                <RecentDiscoveries onSelect={handleRecentClick} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage; 