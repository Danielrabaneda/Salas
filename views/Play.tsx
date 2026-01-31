
import React, { useState } from 'react';
import { useAppState } from '../store';
import { AppRoute } from '../types';

export const Play: React.FC = () => {
  const { setRoute, user, setCurrentGame } = useAppState();
  const [isSearching, setIsSearching] = useState(false);
  const [showGuestAlert, setShowGuestAlert] = useState(false);

  const handleQuickJoin = () => {
    if (user?.isGuest) {
      setShowGuestAlert(true);
      return;
    }
    
    setIsSearching(true);
    setTimeout(() => {
      const mockPrioritizedStory = {
        id: 'pj-123',
        creatorUid: 'other-user',
        status: 'active',
        words: [],
        participants: ['other-user'],
        participantWordCount: {},
        needsPlayers: true,
        playerSlots: 5,
        settings: {
          theme: 'Misterio',
          language: 'es',
          paceSeconds: 15,
          maxWords: 50,
          isPrivate: false,
          allowNSFW: false
        },
        coverImageUrl: 'https://picsum.photos/seed/mystery/600/400',
        currentTurnUid: 'other-user',
        turnEndsAt: new Date(),
        lastActivityAt: new Date(),
        totalVotes: 0,
        weekNumber: 12,
        createdAt: new Date()
      };
      
      setCurrentGame(mockPrioritizedStory as any);
      setRoute(AppRoute.GAME);
      setIsSearching(false);
    }, 1500);
  };

  const handleExploreRooms = () => {
    setRoute(AppRoute.EXPLORE_ROOMS);
  };

  return (
    <div className="px-6 flex flex-col h-full justify-center items-center text-center space-y-12 pt-10 pb-20 animate-in zoom-in duration-300">
      
      {showGuestAlert && (
        <div className="fixed inset-0 z-[100] bg-zinc-900/90 backdrop-blur-sm flex items-center justify-center p-8">
           <div className="bg-white rounded-[2.5rem] border-4 border-zinc-900 shadow-neo p-8 w-full max-w-sm">
              <h3 className="text-2xl font-black uppercase italic mb-4 tracking-tighter text-zinc-900">¡Solo Miembros! 🔒</h3>
              <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed mb-8">
                El modo invitado solo permite leer. ¡Crea una cuenta para participar en historias y ganar monedas!
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => setRoute(AppRoute.AUTH)}
                  className="w-full bg-primary text-white py-4 rounded-2xl border-2 border-zinc-900 shadow-neo-sm font-black uppercase text-xs active:translate-y-0.5"
                >
                  Registrarse ahora
                </button>
                <button 
                  onClick={() => setShowGuestAlert(false)}
                  className="w-full bg-zinc-100 text-zinc-400 py-3 rounded-2xl font-black uppercase text-[10px]"
                >
                  Quizás luego
                </button>
              </div>
           </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="size-24 bg-yellow-400 rounded-full border-4 border-zinc-900 shadow-neo mx-auto flex items-center justify-center mb-6 overflow-hidden">
          {isSearching ? (
             <div className="animate-spin size-full border-8 border-t-zinc-900 border-zinc-100/20 rounded-full"></div>
          ) : (
            <span className="material-symbols-outlined text-5xl font-black animate-bounce">auto_stories</span>
          )}
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter italic">
          {isSearching ? 'BUSCANDO SALA...' : '¿Cómo quieres escribir hoy?'}
        </h2>
        <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest px-10">
          {isSearching ? 'Estamos encontrando una historia que te necesita' : 'Únete a la comunidad y crea leyendas palabra por palabra'}
        </p>
      </div>

      <div className="w-full space-y-4">
        <button 
          onClick={handleQuickJoin}
          disabled={isSearching}
          className="w-full group relative overflow-hidden bg-primary p-8 rounded-[2.5rem] border-4 border-zinc-900 shadow-neo active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
        >
          <div className="relative z-10 flex flex-col items-center gap-2">
            <span className="text-3xl font-black text-white italic tracking-tighter uppercase">JUGAR YA</span>
            <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Favorito: Salas buscando gente</span>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-125 transition-transform">
             <span className="material-symbols-outlined text-8xl font-black text-white">bolt</span>
          </div>
        </button>

        <button 
          onClick={handleExploreRooms}
          disabled={isSearching}
          className="w-full bg-white p-6 rounded-[2rem] border-4 border-zinc-900 shadow-neo-sm active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-between px-10 disabled:opacity-50"
        >
          <span className="text-lg font-black uppercase tracking-tight italic">Explorar salas</span>
          <span className="material-symbols-outlined font-black">search</span>
        </button>

        <button 
          onClick={() => user?.isGuest ? setShowGuestAlert(true) : setRoute(AppRoute.CREATE_STORY)}
          disabled={isSearching}
          className="w-full bg-zinc-900 p-6 rounded-[2rem] border-4 border-zinc-900 shadow-neo-sm active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-between px-10 disabled:opacity-50"
        >
          <span className="text-lg font-black text-white uppercase tracking-tight italic">Crear mi propia historia</span>
          <span className="material-symbols-outlined text-white font-black text-2xl">add</span>
        </button>
      </div>
    </div>
  );
};
