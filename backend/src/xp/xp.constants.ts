export const XP_RULES = {
  dailyLogin: 100,

  task: {
    maxPerDay: 5,
    xpPerTask: 50,
    bonusForAll: 50,
  },

  project: {
    // for flexibility if I use this in the future
    xp: {
      small: 200,
      medium: 400,
      large: 600,
    },
    maxPerDay: 1,
    maxPerWeek: 2400,
  },

  studySession: {
    xpTable: [
      { duration: 10, xp: 50 },
      { duration: 30, xp: 300 },
      { duration: 60, xp: 600 },
      { duration: 90, xp: 800 },
    ],
  },
  // days
  streak: {
    bonusAfter: 3,
    bonusXP: 50,
  },
};
