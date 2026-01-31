
import React from 'react';
import { AppProvider, useAppState } from './store';
import { AppRoute } from './types';
import { Layout } from './components/Layout';
import { Home } from './views/Home';
import { CreateStory } from './views/CreateStory';
import { Game } from './views/Game';
import { HotStories } from './views/HotStories';
import { Play } from './views/Play';
import { Ranking } from './views/Ranking';
import { Store } from './views/Store';
import { Profile } from './views/Profile';
import { MyStories } from './views/MyStories';
import { StoryDetail } from './views/StoryDetail';
import { Auth } from './views/Auth';
import { PracticeMode } from './views/PracticeMode';
import { ExploreRooms } from './views/ExploreRooms';
import { EditProfile } from './views/EditProfile'; // Nuevo import

const AppContent: React.FC = () => {
  const { currentRoute } = useAppState();

  const renderRoute = () => {
    switch (currentRoute) {
      case AppRoute.AUTH: return <Auth />;
      case AppRoute.HOME: return <Home />;
      case AppRoute.CREATE_STORY: return <CreateStory />;
      case AppRoute.GAME: return <Game />;
      case AppRoute.HOT_STORIES: return <HotStories />;
      case AppRoute.PLAY: return <Play />;
      case AppRoute.RANKING: return <Ranking />;
      case AppRoute.STORE: return <Store />;
      case AppRoute.PROFILE: return <Profile />;
      case AppRoute.MY_STORIES: return <MyStories />;
      case AppRoute.STORY_DETAIL: return <StoryDetail />;
      case AppRoute.PRACTICE: return <PracticeMode />;
      case AppRoute.EXPLORE_ROOMS: return <ExploreRooms />;
      case AppRoute.EDIT_PROFILE: return <EditProfile />; // Nueva ruta
      default: return <Home />;
    }
  };

  if (currentRoute === AppRoute.AUTH) {
    return renderRoute();
  }

  return <Layout>{renderRoute()}</Layout>;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
