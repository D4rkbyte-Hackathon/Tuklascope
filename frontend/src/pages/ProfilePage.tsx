import React, {useEffect, useState} from 'react';
import Navbar from '../components/Navbar';
import ChatbotButton from '../components/ChatbotButton';
import { getAuth , doc, getDoc, updateDoc, db, getUserSkillsRealtime} from '../database/firebase';
import { useNavigate } from 'react-router-dom';
import { RecentDiscoveries, RecentDiscovery } from '../components/RecentDiscoveries';

interface UserSkill {
  skill_name: string;
  category: string;
  mastery_level: number;
  xp_earned: number;
  date_acquired: string;
  last_updated: string;
}

interface CategoryStat {
  subject: string;
  xp: number;
  level: number;
  mastered: number;
  progress: number;
  skills: UserSkill[];
}

const ProfilePage = () => {
  const [userData, setUserData] = useState<{
      name: string;
      surname: string;
      email: string;
      education: string;
      city: string;
      country: string;
    } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userSkills, setUserSkills] = useState<Record<string, UserSkill>>({});
  const [editForm, setEditForm] = useState({
    name: '',
    surname: '',
    education: '',
    city: '',
    country: '',
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setIsLoading(false);
        return;
      }
      
      try{
        const userDoc = await getDoc(doc(db, 'Tuklascope-user', currentUser.uid));
        if (userDoc.exists()){
          const data = userDoc.data();
          const userInfo = {
            name: data.name || '',
            surname: data.surname || '',
            email: data.email || currentUser.email || '',
            education: data.education || '',
            city: data.city || '',
            country: data.country || '',
          };
          setUserData(userInfo);
          setEditForm({
            name: userInfo.name,
            surname: userInfo.surname,
            education: userInfo.education,
            city: userInfo.city,
            country: userInfo.country,
          });
        }
      }
      catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    }
     fetchUserData();
  }, []);

  // Fetch user skills for achievements
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const unsubscribe = getUserSkillsRealtime(currentUser.uid, (skills) => {
      setUserSkills(skills);
    });

    return () => unsubscribe();
  }, []);

  // Get recent achievements (2 most recent)
  const getRecentAchievements = () => {
    const skillsArray = Object.values(userSkills);
    return skillsArray
      .sort((a, b) => new Date(b.date_acquired).getTime() - new Date(a.date_acquired).getTime())
      .slice(0, 2);
  };

  // Get category stats for skill tree
  const getCategoryStats = (): CategoryStat[] => {
    const categories: Record<string, CategoryStat> = {};
    
    Object.values(userSkills).forEach((skill) => {
      const category = skill.category;
      if (!categories[category]) {
        categories[category] = {
          subject: category,
          xp: 0,
          level: 0,
          mastered: 0,
          progress: 0,
          skills: []
        };
      }
      
      categories[category].xp += skill.xp_earned;
      categories[category].mastered += skill.mastery_level >= 50 ? 1 : 0;
      categories[category].skills.push(skill);
    });

    // Calculate levels and progress
    Object.values(categories).forEach((category) => {
      category.level = Math.floor(category.xp / 100) + 1;
      category.progress = Math.min(1, (category.xp % 100) / 100);
    });

    return Object.values(categories);
  };

  const handleEditSave = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser || !userData) return;

    try {
      await updateDoc(doc(db, 'Tuklascope-user', currentUser.uid), {
        name: editForm.name,
        surname: editForm.surname,
        education: editForm.education,
        city: editForm.city,
        country: editForm.country,
      });

      setUserData({
        ...userData,
        ...editForm,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleEditCancel = () => {
    setEditForm({
      name: userData?.name || '',
      surname: userData?.surname || '',
      education: userData?.education || '',
      city: userData?.city || '',
      country: userData?.country || '',
    });
    setIsEditing(false);
  };

  const navigate = useNavigate();
  const handleRecentClick = (discovery: RecentDiscovery) => {
    navigate('/spark-results', { state: { recentDiscovery: discovery } });
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <ChatbotButton />
        <div style={{ minHeight: '100vh', background: '#fff', padding: '48px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#6B7280', fontSize: 18 }}>Loading profile...</div>
        </div>
      </>
    );
  }

  if (!userData) {
    return (
      <>
        <Navbar />
        <ChatbotButton />
        <div style={{ minHeight: '100vh', background: '#fff', padding: '48px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#DC2626', fontSize: 18 }}>Failed to load profile data</div>
        </div>
      </>
    );
  }

  const recentAchievements = getRecentAchievements();
  const categoryStats = getCategoryStats();

  return (
    <>
      <Navbar />
      <ChatbotButton />
      <div className="profile-main-container" style={{ minHeight: '100vh', background: '#fff', padding: '48px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: 1400, padding: '0 32px' }}>
          <div className="profile-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
            <div>
              <h1 style={{ fontWeight: 800, fontSize: isMobile ? 32 : 44, color: '#0B3C6A', marginBottom: 0, letterSpacing: 1, textAlign: isMobile ? 'center' : undefined, padding: isMobile ? '0 20px' : undefined }}>
                Your Profile
              </h1>
              <div style={{ color: '#1F2937', fontSize: isMobile ? 18 : 18, marginTop: 4, textAlign: isMobile ? 'center' : undefined, padding: isMobile ? '0 20px' : undefined }}>
                Track your STEM learning journey
              </div>
            </div>
            {!isEditing ? (
              <button
                className="profile-edit-btn"
                onClick={() => setIsEditing(true)}
                style={{
                  background: '#FF6B2C',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e55a1f'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#FF6B2C'}
              >
                Edit Profile
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  className="profile-save-btn"
                  onClick={handleEditSave}
                  style={{
                    background: '#22C55E',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 24px',
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#16a34a'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#22C55E'}
                >
                  Save
                </button>
                <button
                  className="profile-cancel-btn"
                  onClick={handleEditCancel}
                  style={{
                    background: '#6B7280',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 24px',
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#4B5563'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#6B7280'}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className="profile-cards-container" style={{ display: 'flex', gap: 40, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            {/* Left: User Card & Location */}
            <div className="profile-left-column" style={{ flex: '0 0 350px', display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div className="profile-user-card" style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 320 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#FF6B2C', color: '#fff', fontWeight: 700, fontSize: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  {(userData.name && userData.name.trim().length > 0)
                    ? userData.name.trim().charAt(0).toUpperCase()
                    : 'U'}
                </div>
                {isEditing ? (
                  <div className="profile-form" style={{ width: '100%', marginBottom: 18 }}>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      placeholder="Name"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #E5E7EB',
                        borderRadius: 6,
                        fontSize: 16,
                        marginBottom: 8,
                      }}
                    />
                    <input
                      type="text"
                      value={editForm.surname}
                      onChange={(e) => setEditForm({...editForm, surname: e.target.value})}
                      placeholder="Surname"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #E5E7EB',
                        borderRadius: 6,
                        fontSize: 16,
                        marginBottom: 8,
                      }}
                    />
                    <select
                      value={editForm.education}
                      onChange={(e) => setEditForm({...editForm, education: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #E5E7EB',
                        borderRadius: 6,
                        fontSize: 16,
                      }}
                    >
                      <option value="">Select Education Level</option>
                      <option value="Senior High (Grades 11-12)">Senior High (Grades 11-12)</option>
                      <option value="Junior High (Grades 7-10)">Junior High (Grades 7-10)</option>
                      <option value="Elementary (Grades 1-6)">Elementary (Grades 1-6)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                ) : (
                  <>
                    <div style={{ fontWeight: 700, fontSize: 24, color: '#0B3C6A', marginBottom: 2 }}>
                      {userData.name} {userData.surname}
                    </div>
                    <div style={{ color: '#888', fontSize: 16, marginBottom: 18 }}>
                      {userData.education || 'Education level not set'}
                    </div>
                  </>
                )}
                <div style={{ color: '#2563EB', fontWeight: 700, fontSize: 18, marginBottom: 2 }}>Total Points</div>
                <div style={{ color: '#FF6B2C', fontWeight: 800, fontSize: 32, marginBottom: 8 }}>0</div>
                <div style={{ color: '#2563EB', fontWeight: 700, fontSize: 18, marginBottom: 2 }}>Current Streak</div>
                <div style={{ color: '#FF6B2C', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>0 days</div>
                {/* Progress Bar */}
                <div style={{ width: '100%', height: 10, background: '#F3F4F6', borderRadius: 8, marginBottom: 8 }}>
                  <div style={{ width: '0%', height: '100%', background: 'linear-gradient(90deg, #FF6B2C 60%, #FFC371 100%)', borderRadius: 8 }} />
                </div>
                <div style={{ color: '#888', fontSize: 15 }}>100 points to next level</div>
              </div>

              {/* Location Information Card */}
              <div className="profile-location-card" style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 32, minWidth: 320 }}>
                <div style={{ fontWeight: 700, fontSize: 22, color: '#0B3C6A', marginBottom: 18 }}>Location</div>
                {isEditing ? (
                  <div style={{ width: '100%' }}>
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ color: '#2563EB', fontWeight: 700, fontSize: 17, marginBottom: 4 }}>City</div>
                      <input
                        type="text"
                        value={editForm.city}
                        onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                        placeholder="Enter your city"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #E5E7EB',
                          borderRadius: 6,
                          fontSize: 15,
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: 4 }}>
                      <div style={{ color: '#FF6B2C', fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Country</div>
                      <input
                        type="text"
                        value={editForm.country}
                        onChange={(e) => setEditForm({...editForm, country: e.target.value})}
                        placeholder="Enter your country"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #E5E7EB',
                          borderRadius: 6,
                          fontSize: 15,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ color: '#2563EB', fontWeight: 700, fontSize: 17, marginBottom: 4 }}>City</div>
                      <div style={{ color: '#444', fontSize: 15 }}>
                        {userData.city || 'Not specified'}
                      </div>
                    </div>
                    <div style={{ marginBottom: 4 }}>
                      <div style={{ color: '#FF6B2C', fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Country</div>
                      <div style={{ color: '#444', fontSize: 15 }}>
                        {userData.country || 'Not specified'}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right: Skill Progress, Discoveries & Achievements */}
            <div className="profile-right-column" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 32, minWidth: 400 }}>
              <div className="profile-skill-progress-card" style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 32, minHeight: 90 }}>
                <div className="profile-section-title" style={{ fontWeight: 700, fontSize: 26, color: '#1F2937', marginBottom: 16 }}>Skill Progress</div>
                {categoryStats.length > 0 ? (
                  <div className="profile-category-stats" style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 16, 
                    maxHeight: '200px', 
                    overflowY: 'auto',
                    paddingRight: '8px'
                  }}>
                    {categoryStats.map((category) => (
                      <div key={category.subject} className="profile-category-card" style={{ 
                        padding: '16px', 
                        background: '#F8FAFC', 
                        borderRadius: 12, 
                        border: '1px solid #E5E7EB',
                        minHeight: '80px',
                        marginBottom: 8, // add spacing between cards
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <div style={{ fontWeight: 700, fontSize: 18, color: '#0B3C6A' }}>
                            {category.subject}
                          </div>
                          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: 16, fontWeight: 700, color: '#FF6B2C' }}>{category.xp}</div>
                              <div style={{ fontSize: 12, color: '#6B7280' }}>XP</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: 16, fontWeight: 700, color: '#0B3C6A' }}>Lv.{category.level}</div>
                              <div style={{ fontSize: 12, color: '#6B7280' }}>Level</div>
                            </div>
                          </div>
                        </div>
                        <div style={{ width: '100%', height: 6, background: '#E5E7EB', borderRadius: 6 }}>
                          <div style={{ 
                            width: `${category.progress * 100}%`, 
                            height: '100%', 
                            background: '#FF6B2C', 
                            borderRadius: 6 
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: '#6B7280', fontSize: 16, textAlign: 'center', padding: '20px' }}>
                    No skills yet. Start discovering to build your skill tree!
                  </div>
                )}
              </div>
              <div className="profile-discoveries-card" style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 32, minHeight: 120 }}>
                <div className="profile-section-title" style={{ fontWeight: 700, fontSize: 26, color: '#1F2937', marginBottom: 12 }}>Recent Discoveries</div>
                <RecentDiscoveries onSelect={handleRecentClick} />
              </div>
              {/* Achievements */}
              <div className="profile-achievements-card" style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 32, minWidth: 320 }}>
                <div className="profile-section-title" style={{ fontWeight: 700, fontSize: 22, color: '#0B3C6A', marginBottom: 18 }}>Recent Achievements</div>
                <div className="profile-achievements-row">
                {recentAchievements.length > 0 ? (
                  recentAchievements.map((achievement, index) => (
                    <div key={achievement.skill_name} style={{ marginBottom: index < recentAchievements.length - 1 ? 18 : 4 }}>
                      <div style={{ color: '#2563EB', fontWeight: 700, fontSize: 17, marginBottom: 2, cursor: 'pointer' }}>
                        {achievement.skill_name}
                      </div>
                      <div style={{ color: '#444', fontSize: 15, marginBottom: 4 }}>
                        {achievement.category} • +{achievement.xp_earned} XP
                      </div>
                      <div style={{ color: '#22C55E', fontSize: 14, fontWeight: 600 }}>
                        Mastery: {achievement.mastery_level}%
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#6B7280', fontSize: 16 }}>
                    No achievements yet. Start discovering to earn skills!
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile-specific styles */}
      <style>{`
        @media (max-width: 768px) {
          .profile-main-container {
            padding: 24px 12px !important;
          }
          .profile-header-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
          .profile-header-row h1 {
            font-size: 1.5rem !important;
            padding: 0 8px !important;
          }
          .profile-header-row > div:first-child > div {
            font-size: 0.95rem !important;
            padding: 0 8px !important;
          }
          .profile-header-row > div:last-child {
            margin-top: 12px !important;
          }
          .profile-edit-btn, .profile-save-btn, .profile-cancel-btn {
            padding: 10px 18px !important;
            font-size: 15px !important;
            border-radius: 8px !important;
          }
          .profile-form {
            flex-direction: column !important;
            gap: 16px !important;
          }
          .profile-form input, .profile-form select {
            font-size: 15px !important;
            padding: 10px !important;
          }
          .profile-section-title {
            font-size: 1rem !important;
            margin-bottom: 12px !important;
          }
          .profile-achievements-row {
            flex-direction: column !important;
            gap: 12px !important;
          }
          .profile-category-stats {
            flex-direction: column !important;
            gap: 16px !important;
          }
          .profile-category-card {
            width: 100% !important;
            min-width: 0 !important;
            margin-bottom: 12px !important;
          }
          /* Stack cards vertically on mobile */
          .profile-cards-container {
            flex-direction: column !important;
            gap: 24px !important;
          }
          .profile-left-column, .profile-right-column {
            flex: none !important;
            width: 100% !important;
            min-width: 0 !important;
          }
          .profile-user-card, .profile-location-card, .profile-skill-progress-card, .profile-discoveries-card, .profile-achievements-card {
            min-width: 0 !important;
            width: 100% !important;
            padding: 24px !important;
          }
        }
        @media (max-width: 480px) {
          .profile-header-row h1 {
            font-size: 1.1rem !important;
            padding: 0 8px !important;
            text-align: center !important;
            line-height: 1.2 !important;
          }
          .profile-header-row > div:first-child > div {
            font-size: 0.85rem !important;
            padding: 0 8px !important;
            text-align: center !important;
            line-height: 1.5 !important;
          }
          .profile-section-title {
            font-size: 0.95rem !important;
          }
          .profile-main-container {
            padding: 16px 6px !important;
          }
          .profile-user-card, .profile-location-card, .profile-skill-progress-card, .profile-discoveries-card, .profile-achievements-card {
            padding: 20px !important;
          }
        }
      `}</style>
    </>
  );
};

export default ProfilePage; 