
export const MOCK_USER = {
  uid: 'user-123',
  displayName: 'MagoDePalabras',
  avatar: 'https://picsum.photos/seed/mago/200',
  level: 15,
  coins: 1240,
  isPremium: false,
  segment: 'heavy',
  stats: {
    storiesCreated: 142,
    storiesParticipated: 350,
    totalWords: 1240,
    topStories: 12,
    themeAffinity: { "humor": 45, "terror": 12, "salseo": 8 },
    preferredThemes: ["humor", "terror"]
  },
  notificationSettings: {
    pushEnabled: true,
    dailyPushCount: 0,
    lastPushAt: new Date()
  },
  lastActiveAt: new Date()
};

export const STORY_THEMES = [
  { id: 'terror', emoji: '👻', label: 'Terror', color: 'bg-zinc-900', text: 'text-white' },
  { id: 'salseo', emoji: '🤫', label: 'Salseo', color: 'bg-pink-400', text: 'text-zinc-900' },
  { id: 'oficina', emoji: '📎', label: 'Oficina', color: 'bg-blue-400', text: 'text-zinc-900' },
  { id: 'humor', emoji: '😂', label: 'Humor', color: 'bg-yellow-400', text: 'text-zinc-900' }
];
