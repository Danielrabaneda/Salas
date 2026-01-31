
export type PlayerSegment = 'casual' | 'heavy' | 'premium';

export interface AppNotification {
  id: string;
  type: 'turn' | 'invitation' | 'vote' | 'achievement' | 'room_ready' | 'story_complete';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: AppRoute;
  actionData?: any;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  avatar: string;
  bio?: string; // Nuevo campo
  isPublic?: boolean; // Nuevo campo
  level: number;
  coins: number;
  isPremium: boolean;
  isGuest?: boolean;
  password?: string;
  votedStories: string[];
  notifications: AppNotification[];
  unreadNotifications: number;
  premiumUntil?: Date;
  segment: PlayerSegment;
  practiceStats?: {
    totalPartidas: number;
    mejorRacha: number;
  };
  stats: {
    storiesCreated: number;
    storiesParticipated: number;
    totalWords: number;
    topStories: number;
    themeAffinity: Record<string, number>;
    preferredThemes: string[]; 
  };
  notificationSettings: {
    pushEnabled: boolean;
    lastPushAt?: Date;
    dailyPushCount: number;
    preferredHourWindow?: { start: number; end: number };
  };
  lastActiveAt: Date;
  achievements: string[];
  createdAt: Date;
}

export type StoryStatus = 'active' | 'closed' | 'voting';

export interface StoryWord {
  word: string;
  uid: string;
  timestamp: Date;
  index: number;
}

export interface Story {
  id: string;
  title?: string;
  creatorUid: string;
  status: StoryStatus;
  words: StoryWord[];
  participants: string[];
  votedBy: string[];
  participantWordCount: Record<string, number>;
  inviteCode?: string;
  isHot?: boolean;
  hotScore?: number;
  coverImageUrl?: string;
  rankingPosition?: number;
  needsPlayers?: boolean;
  playerSlots?: number;
  lastPlayerJoinedAt?: Date;
  isPractice?: boolean;
  settings: {
    language: 'es' | 'en';
    theme: string;
    maxWords: number;
    isPrivate: boolean;
    paceSeconds: number;
    allowNSFW: boolean;
  };
  currentTurnUid: string;
  turnEndsAt: Date;
  lastActivityAt: Date; 
  totalVotes: number;
  weekNumber: number;
  createdAt: Date;
}

export interface StoreItem {
  id: string;
  name: string;
  price: number;
  type: 'avatar_frame' | 'emoji_pack' | 'theme_skin';
  image: string;
  rarity: 'common' | 'rare' | 'legendary';
}

export enum AppRoute {
  HOME = 'home',
  CREATE_STORY = 'create_story',
  GAME = 'game',
  HOT_STORIES = 'hot_stories',
  PLAY = 'play',
  RANKING = 'ranking',
  STORE = 'store',
  PROFILE = 'profile',
  AUTH = 'auth',
  MY_STORIES = 'my_stories',
  STORY_DETAIL = 'story_detail',
  PRACTICE = 'practice',
  EXPLORE_ROOMS = 'explore_rooms',
  EDIT_PROFILE = 'edit_profile' // Nueva ruta
}
