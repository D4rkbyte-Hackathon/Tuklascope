import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import ChatbotButton from './ChatbotButton';

const leaderboardTabs = [
  { label: 'School' },
  { label: 'City' },
  { label: 'National' },
];

const leaderboardDataSets = [
  // School
  [
    { rank: 1, username: 'Tralalero tralala', school: 'Cebu Institute of Technology - University', points: 2750 },
    { rank: 2, username: 'Tralalero tralala', school: 'Cebu Institute of Technology - University', points: 2650 },
    { rank: 3, username: 'Tralalero tralala', school: 'Cebu Institute of Technology - University', points: 2550 },
    { rank: 4, username: 'This is you', school: 'Cebu Institute of Technology - University', points: 2450, highlight: true },
    { rank: 5, username: 'Tralalero tralala', school: 'Cebu Institute of Technology - University', points: 2350 },
    { rank: 6, username: 'Tralalero tralala', school: 'Cebu Institute of Technology - University', points: 2250 },
    { rank: 7, username: 'Tralalero tralala', school: 'Cebu Institute of Technology - University', points: 2150 },
    { rank: 8, username: 'Tralalero tralala', school: 'Cebu Institute of Technology - University', points: 2050 },
    { rank: 9, username: 'Tralalero tralala', school: 'Cebu Institute of Technology - University', points: 1950 },
    { rank: 10, username: 'Tralalero tralala', school: 'Cebu Institute of Technology - University', points: 1850 },
    { rank: 11, username: 'Tralalero tralala', school: 'Cebu Institute of Technology - University', points: 1750 },
    { rank: 12, username: 'Tralalero tralala', school: 'Cebu Institute of Technology - University', points: 1650 },
    { rank: 13, username: 'Tralalero tralala', school: 'Cebu Institute of Technology - University', points: 1550 },
    { rank: 14, username: 'Tralalero tralala', school: 'Cebu Institute of Technology - University', points: 1450 },
    { rank: 15, username: 'Tralalero tralala', school: 'Cebu Institute of Technology - University', points: 1350 },
  ],
  // City
  [
    { rank: 1, username: 'City Champ', school: 'Cebu', points: 3750 },
    { rank: 2, username: 'City Runner', school: 'Cebu', points: 3650 },
    { rank: 3, username: 'City Bronze', school: 'Cebu', points: 3550 },
    { rank: 4, username: 'You in City', school: 'Cebu', points: 3450, highlight: true },
    { rank: 5, username: 'City User', school: 'Cebu', points: 3350 },
    { rank: 6, username: 'City User', school: 'Cebu', points: 3250 },
    { rank: 7, username: 'City User', school: 'Cebu', points: 3150 },
    { rank: 8, username: 'City User', school: 'Cebu', points: 3050 },
    { rank: 9, username: 'City User', school: 'Cebu', points: 2950 },
    { rank: 10, username: 'City User', school: 'Cebu', points: 2850 },
    { rank: 11, username: 'City User', school: 'Cebu', points: 2750 },
    { rank: 12, username: 'City User', school: 'Cebu', points: 2650 },
    { rank: 13, username: 'City User', school: 'Cebu', points: 2550 },
    { rank: 14, username: 'City User', school: 'Cebu', points: 2450 },
    { rank: 15, username: 'City User', school: 'Cebu', points: 2350 },
  ],
  // National
  [
    { rank: 1, username: 'National Hero', school: 'Philippines', points: 4750 },
    { rank: 2, username: 'National Silver', school: 'Philippines', points: 4650 },
    { rank: 3, username: 'National Bronze', school: 'Philippines', points: 4550 },
    { rank: 4, username: 'You National', school: 'Philippines', points: 4450, highlight: true },
    { rank: 5, username: 'National User', school: 'Philippines', points: 4350 },
    { rank: 6, username: 'National User', school: 'Philippines', points: 4250 },
    { rank: 7, username: 'National User', school: 'Philippines', points: 4150 },
    { rank: 8, username: 'National User', school: 'Philippines', points: 4050 },
    { rank: 9, username: 'National User', school: 'Philippines', points: 3950 },
    { rank: 10, username: 'National User', school: 'Philippines', points: 3850 },
    { rank: 11, username: 'National User', school: 'Philippines', points: 3750 },
    { rank: 12, username: 'National User', school: 'Philippines', points: 3650 },
    { rank: 13, username: 'National User', school: 'Philippines', points: 3550 },
    { rank: 14, username: 'National User', school: 'Philippines', points: 3450 },
    { rank: 15, username: 'National User', school: 'Philippines', points: 3350 },
  ],
];

const medalIcons = [
  <span key="gold" style={{ fontSize: 28 }}>🥇</span>,
  <span key="silver" style={{ fontSize: 28 }}>🥈</span>,
  <span key="bronze" style={{ fontSize: 28 }}>🥉</span>,
];

const USERNAME_COL_WIDTH_DESKTOP = 380;
const USERNAME_COL_WIDTH_MOBILE = 180;

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const leaderboardData = leaderboardDataSets[activeTab];
  // Find the user's row (highlighted)
  const userRow = leaderboardData.find((row) => row.highlight);
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

  return (
    <>
      <Navbar />
      <div className="leaderboard-main-container" style={{ minHeight: '100vh', width: '100%', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 64 }}>
        <h2 className="leaderboard-title" style={{ fontSize: 54, fontWeight: 800, color: '#111', marginBottom: 40, textAlign: 'center' }}>
          Top Discoverers
        </h2>
        <div className="leaderboard-table-container" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: isMobile ? '0 8px' : 0, minWidth: 350, maxWidth: 800, width: '100%', marginBottom: 32 }}>
          {/* Tab Switcher */}
          <div className="leaderboard-tabs-row" style={{ display: 'flex', justifyContent: 'center', gap: 0, borderRadius: 12, background: '#F3F4F6', margin: '32px auto 0 auto', width: 360 }}>
            {leaderboardTabs.map((tab, idx) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(idx)}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  fontWeight: 700,
                  fontSize: 18,
                  background: activeTab === idx ? '#fff' : 'transparent',
                  color: activeTab === idx ? '#2563EB' : '#222',
                  border: 'none',
                  borderRadius: 8,
                  boxShadow: activeTab === idx ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'background 0.2s',
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
                  marginBottom: 12,
                  padding: '16px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  fontWeight: row.highlight ? 700 : 600,
                  fontSize: 15,
                  position: 'relative',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: 20, minWidth: 36, textAlign: 'center', display: 'inline-block' }}>{row.rank <= 3 ? medalIcons[row.rank - 1] : row.rank}</span>
                    <span style={{ fontWeight: row.highlight ? 700 : 600, fontSize: 16 }}>{row.username}</span>
                  </div>
                  <div style={{ color: '#888', fontWeight: 400, fontSize: 13, marginLeft: 46 }}>{row.school}</div>
                  <div style={{ color: '#2563EB', fontWeight: 700, fontSize: 16, marginTop: 2, marginLeft: 46 }}>{row.points} <span style={{ color: '#888', fontWeight: 400, fontSize: 13 }}>points</span></div>
                </div>
              ))}
              {/* Sticky User Row for Mobile */}
              {userRow && (
                <div className="leaderboard-sticky-row" style={{
                  width: '100%',
                  background: '#F3F4F6',
                  borderTop: '2px solid #E5E7EB',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  position: 'sticky',
                  bottom: 0,
                  left: 0,
                  zIndex: 2,
                  fontWeight: 700,
                  fontSize: 15,
                  padding: '12px 14px',
                  borderRadius: 0,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 18, minWidth: 36, textAlign: 'center', display: 'inline-block' }}>{userRow.rank <= 3 ? medalIcons[userRow.rank - 1] : userRow.rank}</span>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{userRow.username}</span>
                  </div>
                  <div style={{ color: '#888', fontWeight: 400, fontSize: 13, marginLeft: 46 }}>{userRow.school}</div>
                  <div style={{ color: '#2563EB', fontWeight: 700, fontSize: 15, marginTop: 2, marginLeft: 46 }}>{userRow.points} <span style={{ color: '#888', fontWeight: 400, fontSize: 13 }}>points</span></div>
                </div>
              )}
            </div>
          ) : (
            <>
              <table className="leaderboard-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <colgroup>
                  <col style={{ width: 100 }} />
                  <col style={{ width: USERNAME_COL_WIDTH }} />
                  <col />
                </colgroup>
                <thead>
                  <tr style={{ background: '#fff' }}>
                    <th style={{ textAlign: 'left', padding: '16px 24px', fontWeight: 700, fontSize: 18 }}>Rank</th>
                    <th style={{ textAlign: 'left', padding: '16px 24px', fontWeight: 700, fontSize: 18 }}>Username</th>
                    <th style={{ textAlign: 'right', padding: '16px 24px', fontWeight: 700, fontSize: 18 }}>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((row, idx) => (
                    <tr key={idx} style={{ background: row.highlight ? '#F3F4F6' : '#fff' }}>
                      <td style={{ padding: '16px 24px', fontWeight: 700, fontSize: 22, verticalAlign: 'middle' }}>
                        {row.rank <= 3 ? medalIcons[row.rank - 1] : row.rank}
                      </td>
                      <td style={{ padding: '16px 24px', fontWeight: row.highlight ? 700 : 600, fontSize: 18, verticalAlign: 'middle', width: USERNAME_COL_WIDTH }}>
                        <div style={{ minWidth: USERNAME_COL_WIDTH }}>
                          {row.username}
                          <div style={{ color: '#888', fontWeight: 400, fontSize: 15 }}>{row.school}</div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 700, fontSize: 20, verticalAlign: 'middle' }}>
                        {row.points}
                        <span style={{ color: '#888', fontWeight: 400, fontSize: 15, marginLeft: 6 }}>points</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Sticky User Row for Desktop */}
              {userRow && (
                <div className="leaderboard-sticky-row" style={{
                  width: '100%',
                  background: '#F3F4F6',
                  borderTop: '2px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'sticky',
                  bottom: 0,
                  left: 0,
                  zIndex: 2,
                  fontWeight: 700,
                  fontSize: 18,
                  padding: '18px 24px',
                }}>
                  <span style={{ fontWeight: 700, fontSize: 22 }}>{userRow.rank <= 3 ? medalIcons[userRow.rank - 1] : userRow.rank}</span>
                  <span style={{ fontWeight: 700, minWidth: USERNAME_COL_WIDTH, display: 'inline-block' }}>{userRow.username}
                    <span style={{ color: '#888', fontWeight: 400, fontSize: 15, marginLeft: 8 }}>{userRow.school}</span>
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 20 }}>{userRow.points}<span style={{ color: '#888', fontWeight: 400, fontSize: 15, marginLeft: 6 }}>points</span></span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ChatbotButton />
      {/* Mobile-specific styles */}
      <style>{`
        @media (max-width: 768px) {
          .leaderboard-main-container {
            padding-top: 32px !important;
          }
          .leaderboard-title {
            font-size: 2rem !important;
            margin-bottom: 24px !important;
          }
          .leaderboard-tabs-row {
            width: 100% !important;
            margin: 24px 0 0 0 !important;
          }
          .leaderboard-tabs-row button {
            font-size: 15px !important;
            padding: 10px 0 !important;
          }
          .leaderboard-table-container {
            min-width: 0 !important;
            max-width: 100vw !important;
            border-radius: 10px !important;
            padding: 0 !important;
          }
          .leaderboard-table th, .leaderboard-table td {
            padding: 10px 8px !important;
            font-size: 14px !important;
          }
          .leaderboard-table th {
            font-size: 15px !important;
          }
          .leaderboard-table td {
            font-size: 14px !important;
          }
          .leaderboard-sticky-row {
            font-size: 15px !important;
            padding: 12px 8px !important;
          }
        }
        @media (max-width: 480px) {
          .leaderboard-title {
            font-size: 1.2rem !important;
          }
          .leaderboard-table th, .leaderboard-table td {
            font-size: 12px !important;
            padding: 8px 4px !important;
          }
          .leaderboard-sticky-row {
            font-size: 13px !important;
            padding: 8px 4px !important;
          }
        }
      `}</style>
    </>
  );
};

export default LeaderboardPage; 