// frontend/src/database/gamification.ts

// Defines the structure for a single badge
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Emojis work well!
}

// All available badges in the app
export const ALL_BADGES: Badge[] = [
  {
    id: 'badge_garden_explorer',
    name: 'Garden Explorer',
    description: 'You completed the "Backyard Ecologist" quest!',
    icon: '🌳',
  },
  // Add other badges here in the future
];