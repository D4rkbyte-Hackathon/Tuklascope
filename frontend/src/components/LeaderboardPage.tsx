import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import ChatbotButton from './ChatbotButton';
// Import functions directly from your existing firebase.ts
import { auth, db, doc, getDoc, onAuthStateChanged } from '../database/firebase';

// --- NEW Tab Configuration ---
const leaderboardTabs = [
  { label: 'By Grade Level' },
  { label: 'All Users' },
];

// --- NEW: A single, comprehensive list of bots with grade levels ---
const allBots = [
    // Elementary Bots
    { username: 'Quiz-Kid', gradeLevel: 'Elementary', points: 2150 },
    { username: 'Edu-Explorer', gradeLevel: 'Elementary', points: 1900 },
    { username: 'Little-Learner', gradeLevel: 'Elementary', points: 1750 },

    // Junior High School Bots
    { username: 'Giga-Genius', gradeLevel: 'Junior High School', points: 3150 },
    { username: 'Mega-Mind', gradeLevel: 'Junior High School', points: 2900 },
    { username: 'Clever-Cat', gradeLevel: 'Junior High School', points: 2750 },
    { username: 'STEM-Student', gradeLevel: 'Junior High School', points: 2500 },

    // Senior High School Bots
    { username: 'Prodigy-Pro', gradeLevel: 'Senior High School', points: 4150 },
    { username: 'STEM-Superfan', gradeLevel: 'Senior High School', points: 3900 },
    { username: 'Wise-Whiz', gradeLevel: 'Senior High School', points: 3750 },
    { username: 'Bio-Boss', gradeLevel: 'Senior High School', points: 3500 },
];


const medalIcons = [
  <span key="gold" style={{ fontSize: 28 }}>🥇</span>,
  <span key="silver" style={{ fontSize: 28 }}>🥈</span>,
  <span key="bronze" style={{ fontSize: 28 }}>🥉</span>,
];

// Re-using your original constants
const USERNAME_COL_WIDTH_DESKTOP = 380;
const USERNAME_COL_WIDTH_MOBILE = 180;

// Define a type for the user's profile data
interface UserProfile {
    displayName: string;
    totalPoints: number;
    educationLevel: string;
}

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // --- User data fetching logic (self-contained) ---
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'Tuklascope-user', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserProfile({
            displayName: data.displayName || 'You',
            totalPoints: data.totalPoints || 0,
            educationLevel: data.educationLevel || 'Unknown',
          });
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // This effect rebuilds the leaderboard when the tab or user data changes
  useEffect(() => {
    if (userProfile) {
      const currentUserData = {
        username: userProfile.displayName,
        points: userProfile.totalPoints,
        gradeLevel: userProfile.educationLevel,
        highlight: true,
      };

      type Bot = {
        username: string;
        gradeLevel: string;
        points: number;
      };

      let sourceBots: Bot[];
      if (activeTab === 0) {
        const userGrade = currentUserData.gradeLevel;
        let keyword = "";
        if (userGrade.includes("Junior High")) keyword = "Junior High";
        else if (userGrade.includes("Senior High")) keyword = "Senior High";
        else if (userGrade.includes("Elementary")) keyword = "Elementary";

        if (keyword) {
          sourceBots = allBots.filter(bot => bot.gradeLevel.includes(keyword));
        } else {
          sourceBots = []; // No bots if user's grade level is unknown or "Other"
        }
      } else {
        // "All Users" tab: Use all bots
        sourceBots = allBots;
      }

      const combinedData = [...sourceBots, currentUserData];
      const sortedData = combinedData
        .sort((a, b) => b.points - a.points)
        .map((user, index) => ({ ...user, rank: index + 1 }));

      setLeaderboardData(sortedData);
    }
  }, [activeTab, userProfile]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const USERNAME_COL_WIDTH = isMobile ? USERNAME_COL_WIDTH_MOBILE : USERNAME_COL_WIDTH_DESKTOP;
  const userRow = leaderboardData.find((row) => row.highlight);

  // Render a loading state while fetching user data
  if (loading) {
    return (
        <>
            <Navbar />
            <div style={{textAlign: 'center', marginTop: '100px', color: '#0B3C6A', fontSize: '20px', fontWeight: 'bold'}}>
                Loading Leaderboard...
            </div>
        </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="leaderboard-main-container" style={{ minHeight: '100vh', width: '100%', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 64 }}>
        <h2 className="leaderboard-title" style={{ fontSize: 54, fontWeight: 800, color: '#111', marginBottom: 40, textAlign: 'center' }}>
          Top Discoverers
        </h2>
        <div className="leaderboard-table-container" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: isMobile ? '0 8px' : 0, minWidth: 350, maxWidth: 800, width: '100%', marginBottom: 32 }}>
          {/* Tab Switcher */}
          <div className="leaderboard-tabs-row" style={{ display: 'flex', justifyContent: 'center', gap: 0, borderRadius: 12, background: '#F3F4F6', margin: '32px auto 0 auto', width: isMobile ? '90%' : 360 }}>
            {leaderboardTabs.map((tab, idx) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(idx)}
                style={{
                  flex: 1, padding: '12px 0', fontWeight: 700, fontSize: isMobile ? 14 : 18,
                  background: activeTab === idx ? '#fff' : 'transparent',
                  color: activeTab === idx ? '#2563EB' : '#222',
                  border: 'none', borderRadius: 8,
                  boxShadow: activeTab === idx ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
                  cursor: 'pointer', outline: 'none', transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Leaderboard Table or Mobile Cards */}
          {isMobile ? (
            <div style={{ width: '100%', marginTop: 16 }}>
              {leaderboardData.map((row, idx) => (
                <div key={idx} style={{
                  background: row.highlight ? '#F3F4F6' : '#fff',
                  borderRadius: 10,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  marginBottom: 12, padding: '16px 14px',
                  display: 'flex', flexDirection: 'column', gap: 4,
                  fontWeight: row.highlight ? 700 : 600,
                  fontSize: 15, position: 'relative',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: 20, minWidth: 36, textAlign: 'center', display: 'inline-block' }}>{row.rank <= 3 ? medalIcons[row.rank - 1] : row.rank}</span>
                    <span style={{ fontWeight: row.highlight ? 700 : 600, fontSize: 16 }}>{row.username}</span>
                  </div>
                  {/* School info is removed, but we add margin for alignment */}
                  <div style={{ color: '#2563EB', fontWeight: 700, fontSize: 16, marginTop: 2, marginLeft: 46 }}>
                    {row.points.toLocaleString()} <span style={{ color: '#888', fontWeight: 400, fontSize: 13 }}>points</span>
                  </div>
                </div>
              ))}
              {/* Sticky User Row for Mobile */}
              {userRow && (
                <div className="leaderboard-sticky-row" style={{
                  width: '100%', background: '#F3F4F6', borderTop: '2px solid #E5E7EB',
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  position: 'sticky', bottom: 0, left: 0, zIndex: 2,
                  fontWeight: 700, fontSize: 15, padding: '12px 14px', borderRadius: 0,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 18, minWidth: 36, textAlign: 'center', display: 'inline-block' }}>{userRow.rank <= 3 ? medalIcons[userRow.rank - 1] : userRow.rank}</span>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{userRow.username}</span>
                  </div>
                   {/* School info is removed, but we add margin for alignment */}
                  <div style={{ color: '#2563EB', fontWeight: 700, fontSize: 15, marginTop: 2, marginLeft: 46 }}>
                    {userRow.points.toLocaleString()} <span style={{ color: '#888', fontWeight: 400, fontSize: 13 }}>points</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <table className="leaderboard-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
                <colgroup>
                  <col style={{ width: 100 }} />
                  <col style={{ width: USERNAME_COL_WIDTH }} />
                  <col />
                </colgroup>
                <thead>
                  <tr style={{ background: '#fff' }}>
                    <th style={{ textAlign: 'left', padding: '16px 24px', fontWeight: 700, fontSize: 18, borderBottom: '1px solid #E5E7EB' }}>Rank</th>
                    <th style={{ textAlign: 'left', padding: '16px 24px', fontWeight: 700, fontSize: 18, borderBottom: '1px solid #E5E7EB' }}>Username</th>
                    <th style={{ textAlign: 'right', padding: '16px 24px', fontWeight: 700, fontSize: 18, borderBottom: '1px solid #E5E7EB' }}>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((row, idx) => (
                    <tr key={idx} style={{ background: row.highlight ? '#F3F4F6' : '#fff', borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '16px 24px', fontWeight: 700, fontSize: 22, verticalAlign: 'middle' }}>
                        {row.rank <= 3 ? medalIcons[row.rank - 1] : row.rank}
                      </td>
                      <td style={{ padding: '16px 24px', fontWeight: row.highlight ? 700 : 600, fontSize: 18, verticalAlign: 'middle' }}>
                        {/* School info is removed */}
                        {row.username}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 700, fontSize: 20, verticalAlign: 'middle' }}>
                        {row.points.toLocaleString()}
                        <span style={{ color: '#888', fontWeight: 400, fontSize: 15, marginLeft: 6 }}>points</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Sticky User Row for Desktop */}
              {userRow && (
                <div className="leaderboard-sticky-row" style={{
                  width: '100%', background: '#F3F4F6', borderTop: '2px solid #E5E7EB',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  position: 'sticky', bottom: 0, left: 0, zIndex: 2,
                  fontWeight: 700, fontSize: 18, padding: '18px 24px',
                }}>
                   <span style={{ fontWeight: 700, fontSize: 22, minWidth: 100 - 48, textAlign: 'center' }}>
                      {userRow.rank <= 3 ? medalIcons[userRow.rank - 1] : userRow.rank}
                    </span>
                    <span style={{ fontWeight: 700, flex: 1, paddingLeft: 48 }}>
                      {userRow.username}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: 20 }}>
                      {userRow.points.toLocaleString()}
                      <span style={{ color: '#888', fontWeight: 400, fontSize: 15, marginLeft: 6 }}>points</span>
                    </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ChatbotButton />
      {/* --- PRESERVED MOBILE STYLES --- */}
      <style>{`
        @media (max-width: 768px) {
          .leaderboard-main-container { padding-top: 32px !important; }
          .leaderboard-title { font-size: 2rem !important; margin-bottom: 24px !important; }
          .leaderboard-tabs-row { width: 100% !important; margin: 24px 0 0 0 !important; }
          .leaderboard-tabs-row button { font-size: 15px !important; padding: 10px 0 !important; }
          .leaderboard-table-container { min-width: 0 !important; max-width: 100vw !important; border-radius: 10px !important; padding: 0 !important; }
          .leaderboard-table th, .leaderboard-table td { padding: 10px 8px !important; font-size: 14px !important; }
          .leaderboard-table th { font-size: 15px !important; }
          .leaderboard-table td { font-size: 14px !important; }
          .leaderboard-sticky-row { font-size: 15px !important; padding: 12px 8px !important; }
        }
        @media (max-width: 480px) {
          .leaderboard-title { font-size: 1.2rem !important; }
          .leaderboard-table th, .leaderboard-table td { font-size: 12px !important; padding: 8px 4px !important; }
          .leaderboard-sticky-row { font-size: 13px !important; padding: 8px 4px !important; }
        }
      `}</style>
    </>
  );
};

export default LeaderboardPage;