
import React from 'react';
import { useAppState } from '../store';
import { AppRoute } from '../types';
import { NotificationBell } from './NotificationBell';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentRoute, setRoute } = useAppState();

  const navItems = [
    { id: AppRoute.HOME, label: 'Inicio', icon: 'home' },
    { id: AppRoute.RANKING, label: 'Rankings', icon: 'trophy' },
    { id: AppRoute.PLAY, label: 'Jugar', icon: 'auto_stories', primary: true },
    { id: AppRoute.STORE, label: 'Tienda', icon: 'shopping_bag' },
    { id: AppRoute.PROFILE, label: 'Perfil', icon: 'person' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto relative border-x border-gray-100 shadow-xl overflow-hidden">
      {/* Header */}
      <header className="flex items-center p-6 justify-between bg-white/95 backdrop-blur-md sticky top-0 z-[60] border-b border-gray-50">
        <div className="flex size-16 items-center justify-center bg-white rounded-full border-2 border-zinc-900 shadow-neo">
          <div className="bg-primary rounded-full size-11 flex items-center justify-center text-white border-2 border-zinc-900 shadow-neo-sm">
            <span className="material-symbols-outlined text-[36px] font-black">edit_note</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center px-2 flex-1">
          <h1 className="text-zinc-900 text-[24px] font-fun tracking-[0.5px] text-center leading-none">
            Una palabra para la historia
          </h1>
          <div className="flex items-center gap-1 mt-1">
            <div className="size-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">1,240 EN LÍNEA</span>
          </div>
        </div>
        
        <NotificationBell />
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-32 no-scrollbar">
        {children}
      </main>

      {/* Bottom Nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[calc(100%-48px)] z-50 md:max-w-[400px]">
        <nav className="bg-white border-2 border-zinc-900 rounded-full py-3 px-2 flex justify-around items-center shadow-neo">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setRoute(item.id)}
              className="flex flex-col items-center gap-0.5 group"
            >
              <div className={`
                size-10 flex items-center justify-center rounded-full border-2 border-zinc-900 
                transition-all active:translate-y-0.5 active:shadow-none
                ${currentRoute === item.id ? 'bg-primary text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-zinc-400'}
                ${item.primary ? 'bg-mint text-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : ''}
              `}>
                <span className={`material-symbols-outlined font-bold text-xl ${currentRoute === item.id || item.primary ? 'fill-1' : ''}`}>
                  {item.icon}
                </span>
              </div>
              <span className={`text-[9px] uppercase font-black ${currentRoute === item.id ? 'text-zinc-900' : 'text-zinc-400'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};