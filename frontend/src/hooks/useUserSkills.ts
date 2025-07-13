import { useState, useEffect } from 'react';
import { auth, getUserSkillsRealtime, saveUserSkills } from '../database/firebase';

interface Skill {
  skill_name: string;
  category: string;
  mastery_level: number;
  xp_earned: number;
  date_acquired: string;
  last_updated: string;
}

export const useUserSkills = () => {
  const [userSkills, setUserSkills] = useState<Record<string, Skill>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.currentUser) {
      const unsubscribe = getUserSkillsRealtime(auth.currentUser.uid, (skills) => {
        setUserSkills(skills);
        setLoading(false);
      });
      
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const addSkills = async (skills: Array<{skill_name: string, category: string}>) => {
    if (auth.currentUser) {
      return await saveUserSkills(auth.currentUser.uid, skills);
    }
    return false;
  };

  const getSkillsByCategory = (category: string) => {
    return Object.values(userSkills).filter(skill => skill.category === category);
  };

  const getTotalXP = () => {
    return Object.values(userSkills).reduce((sum, skill) => sum + skill.xp_earned, 0);
  };

  const getMasteredSkills = () => {
    return Object.values(userSkills).filter(skill => skill.mastery_level >= 50);
  };

  const getCategoryStats = () => {
    const categories: Record<string, any> = {};
    
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
    Object.values(categories).forEach((category: any) => {
      category.level = Math.floor(category.xp / 100) + 1;
      category.progress = Math.min(1, (category.xp % 100) / 100);
    });

    return Object.values(categories);
  };

  return {
    userSkills,
    loading,
    addSkills,
    getSkillsByCategory,
    getTotalXP,
    getMasteredSkills,
    getCategoryStats
  };
}; 