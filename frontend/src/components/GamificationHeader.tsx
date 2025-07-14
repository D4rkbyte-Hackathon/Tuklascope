// frontend/src/components/GamificationHeader.tsx

import React, { useState, useEffect } from 'react';
import { getAuth, doc, getDoc, db } from '../database/firebase';

interface UserStats {
  streak: number;
  totalPoints: number;
  dailyDiscoveries: number; // For the quest
}

export const GamificationHeader = () => {
  const [stats, setStats] = useState<UserStats>({ streak: 0, totalPoints: 0, dailyDiscoveries: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setIsLoading(false);
        return;
      }
      
      const userDocRef = doc(db, 'Tuklascope-user', currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setStats({
          streak: data.streak || 0,
          totalPoints: data.totalPoints || 0,
          // NOTE: The daily quest logic is simplified for now.
          // A full implementation would require tracking daily discoveries.
          dailyDiscoveries: 1, // We'll hardcode this to 1 for the UI.
        });
      }
      setIsLoading(false);
    };

    fetchUserStats();
  }, []);

  const dailyQuest = {
    title: "Daily Discovery Quest",
    description: "Discover 3 new objects today",
    current: stats.dailyDiscoveries,
    goal: 3,
    reward: 50 // +50 points reward
  };

  const progress = (dailyQuest.current / dailyQuest.goal) * 100;

  if (isLoading) {
    return <div style={{ height: '84px' }}></div>; // Placeholder for height
  }
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '2rem',
      width: '100%',
      maxWidth: '1400px',
      padding: '1rem 3rem',
      background: '#F8FAFC',
      border: '1px solid #E5E7EB',
      borderRadius: '24px',
      marginBottom: '4rem',
    }}>
      {/* Daily Quest Section */}
      <div style={{ flex: 1 }}>
        <div style={{ color: '#0B3C6A', fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          {dailyQuest.title} (+{dailyQuest.reward} Points)
        </div>
        <div style={{ width: '100%', background: '#E5E7EB', borderRadius: '8px', height: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #16A34A, #22C55E)',
            borderRadius: '8px',
            transition: 'width 0.5s ease-in-out'
          }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>
            {dailyQuest.current} / {dailyQuest.goal} Discovered
          </div>
        </div>
      </div>
      
      {/* Streak and Points Section */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FF6B2C' }}>
            🔥 {stats.streak}
          </div>
          <div style={{ color: '#4B5563', fontWeight: 600, fontSize: '1rem' }}>Day Streak</div>
        </div>
        <div style={{ height: '50px', width: '2px', background: '#E5E7EB' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0B3C6A' }}>
            {stats.totalPoints}
          </div>
          <div style={{ color: '#4B5563', fontWeight: 600, fontSize: '1rem' }}>Total Points</div>
        </div>
      </div>
    </div>
  );
};