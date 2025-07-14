export interface Skill {
  skill_name: string;
  category: string;
  mastery_level: number;
  xp_earned: number;
  date_acquired: string;
  last_updated: string;
}

export interface SkillNode {
  id: string;
  name: string;
  category: string;
  mastery_level: number;
  xp_earned: number;
  level: number;
  skills: Skill[];
  x?: number;
  y?: number;
}

export interface SkillLink {
  source: string;
  target: string;
  strength: number;
}

export interface CategoryStat {
  subject: string;
  xp: number;
  level: number;
  mastered: number;
  progress: number;
  skills: Skill[];
} 