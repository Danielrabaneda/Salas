
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Story, AppRoute, AppNotification } from './types';

interface AppState {
  user: User | null;
  currentRoute: AppRoute;
  currentGame: Story | null;
  availableRooms: Story[];
  setRoute: (route: AppRoute) => void;
  setUser: (user: User | null) => void;
  setCurrentGame: (story: Story | null) => void;
  addAvailableRoom: (room: Story) => void; // Nueva función para simular inserción en DB
  logout: () => void;
  voteStory: (storyId: string) => void;
  hasVotedStory: (storyId: string) => boolean;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.AUTH);
  const [currentGame, setCurrentGame] = useState<Story | null>(null);

  // Salas mockeadas con fechas variadas para validar ORDER BY created_at DESC
  const [availableRooms, setAvailableRooms] = useState<Story[]>([
    {
      id: 'room-1',
      title: 'El laberinto de cristal',
      creatorUid: 'other-1',
      status: 'active',
      words: Array(15).fill({ word: 'cristal', uid: 'other', timestamp: new Date(), index: 0 }),
      participants: ['other-1', 'other-2'],
      playerSlots: 5,
      needsPlayers: true,
      votedBy: [],
      participantWordCount: {},
      coverImageUrl: 'https://picsum.photos/seed/crystal/600/400',
      settings: { language: 'es', theme: 'misterio', maxWords: 50, isPrivate: false, paceSeconds: 15, allowNSFW: false },
      currentTurnUid: 'other-1',
      turnEndsAt: new Date(),
      lastActivityAt: new Date(),
      totalVotes: 42,
      weekNumber: 12,
      createdAt: new Date(Date.now() - 3600000 * 24) // Hace 1 día
    },
    {
      id: 'room-2',
      title: 'Viernes de oficina infinito',
      creatorUid: 'other-3',
      status: 'active',
      words: Array(42).fill({ word: 'café', uid: 'other', timestamp: new Date(), index: 0 }),
      participants: ['other-3', 'other-4', 'other-5'],
      playerSlots: 8,
      needsPlayers: true,
      votedBy: [],
      participantWordCount: {},
      coverImageUrl: 'https://picsum.photos/seed/office/600/400',
      settings: { language: 'es', theme: 'oficina', maxWords: 100, isPrivate: false, paceSeconds: 10, allowNSFW: false },
      currentTurnUid: 'other-4',
      turnEndsAt: new Date(),
      lastActivityAt: new Date(),
      totalVotes: 12,
      weekNumber: 12,
      createdAt: new Date(Date.now() - 3600000) // Hace 1 hora
    },
    {
      id: 'room-3',
      title: 'La invasión de los gatos zombie',
      creatorUid: 'other-6',
      status: 'active',
      words: Array(8).fill({ word: 'miau', uid: 'other', timestamp: new Date(), index: 0 }),
      participants: ['other-6'],
      playerSlots: 4,
      needsPlayers: true,
      votedBy: [],
      participantWordCount: {},
      coverImageUrl: 'https://picsum.photos/seed/zombiecat/600/400',
      settings: { language: 'es', theme: 'terror', maxWords: 30, isPrivate: false, paceSeconds: 20, allowNSFW: false },
      currentTurnUid: 'other-6',
      turnEndsAt: new Date(),
      lastActivityAt: new Date(),
      totalVotes: 5,
      weekNumber: 12,
      createdAt: new Date() // Ahora
    }
  ]);

  useEffect(() => {
    const savedSession = localStorage.getItem('OWS_SESSION');
    if (savedSession) {
      const userData = JSON.parse(savedSession);
      setUser(userData);
      setCurrentRoute(AppRoute.HOME);
    }
  }, []);

  const setRoute = (route: AppRoute) => setCurrentRoute(route);

  const addAvailableRoom = (room: Story) => {
    setAvailableRooms(prev => [room, ...prev]);
  };

  const logout = () => {
    localStorage.removeItem('OWS_SESSION');
    setUser(null);
    setRoute(AppRoute.AUTH);
  };

  const hasVotedStory = (storyId: string) => {
    if (!user) return false;
    return user.votedStories?.includes(storyId) || false;
  };

  const voteStory = (storyId: string) => {
    if (!user || user.isGuest) return;
    if (hasVotedStory(storyId)) return;

    if (currentGame && currentGame.id === storyId) {
      if (currentGame.creatorUid === user.uid) return;
      const updatedGame = {
        ...currentGame,
        totalVotes: (currentGame.totalVotes || 0) + 1,
        votedBy: [...(currentGame.votedBy || []), user.uid]
      };
      setCurrentGame(updatedGame);
    }

    const updatedUser = {
      ...user,
      coins: (user.coins || 0) + 5,
      votedStories: [...(user.votedStories || []), storyId]
    };
    setUser(updatedUser);
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    if (!user) return;
    
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
      ...notif
    };

    const updatedUser = {
      ...user,
      notifications: [newNotif, ...(user.notifications || [])].slice(0, 50),
      unreadNotifications: (user.unreadNotifications || 0) + 1
    };
    setUser(updatedUser);

    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }
  };

  const markAsRead = (id: string) => {
    if (!user) return;
    const updatedNotifications = user.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    const unreadCount = updatedNotifications.filter(n => !n.read).length;
    setUser({
      ...user,
      notifications: updatedNotifications,
      unreadNotifications: unreadCount
    });
  };

  const markAllAsRead = () => {
    if (!user) return;
    const updatedNotifications = user.notifications.map(n => ({ ...n, read: true }));
    setUser({
      ...user,
      notifications: updatedNotifications,
      unreadNotifications: 0
    });
  };

  const deleteNotification = (id: string) => {
    if (!user) return;
    const updatedNotifications = user.notifications.filter(n => n.id !== id);
    const unreadCount = updatedNotifications.filter(n => !n.read).length;
    setUser({
      ...user,
      notifications: updatedNotifications,
      unreadNotifications: unreadCount
    });
  };

  useEffect(() => {
    if (user && !user.isGuest) {
      localStorage.setItem('OWS_SESSION', JSON.stringify(user));
    }
  }, [user]);

  return React.createElement(
    AppContext.Provider,
    {
      value: {
        user,
        currentRoute,
        currentGame,
        availableRooms,
        setRoute,
        setUser,
        setCurrentGame,
        addAvailableRoom,
        logout,
        voteStory,
        hasVotedStory,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification
      },
    },
    children
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppState must be used within AppProvider');
  return context;
};
