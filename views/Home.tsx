
import React, { useState } from 'react';
import { useAppState } from '../store';
import { AppRoute } from '../types';
import { STORY_THEMES } from '../constants';

export const Home: React.FC = () => {
  const { setRoute, setCurrentGame } = useAppState();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const hotStories = [
    { id: '1', title: 'La ardilla que sabía demasiado...', theme: 'humor', words: 84, players: 15, coverImageUrl: 'https://picsum.photos/seed/10/400/300', createdAt: new Date(Date.now() - 500000) },
    { id: '2', title: 'La pizza que conquistó Madrid', theme: 'salseo', words: 120, players: 2, needsPlayers: true, playerSlots: 5, coverImageUrl: 'https://picsum.photos/seed/20/400/300', createdAt: new Date() },
    { id: '3', title: 'El código maldito del becario', theme: 'oficina', words: 45, players: 1, needsPlayers: true, playerSlots: 3, coverImageUrl: 'https://picsum.photos/seed/30/400/300', createdAt: new Date(Date.now() - 1000000) },
    { id: '4', title: 'Voces en el servidor', theme: 'terror', words: 12, players: 24, coverImageUrl: 'https://picsum.photos/seed/40/400/300', createdAt: new Date(Date.now() - 200000) },
  ];

  const handleJoinStory = (story: any) => {
    const initialWords = [
      { word: 'Había', uid: 'system', timestamp: new Date(), index: 0 },
      { word: 'una', uid: 'system', timestamp: new Date(), index: 1 },
      { word: 'extraña', uid: 'system', timestamp: new Date(), index: 2 },
      { word: 'situación', uid: 'system', timestamp: new Date(), index: 3 },
      { word: 'cuando', uid: 'system', timestamp: new Date(), index: 4 }
    ];

    const mockStory: any = {
      id: story.id,
      title: story.title,
      creatorUid: 'other-user-uid',
      status: 'active',
      words: initialWords,
      participants: ['other-user-uid', 'another-player-id'],
      votedBy: [],
      participantWordCount: {},
      coverImageUrl: story.coverImageUrl,
      settings: {
        theme: story.theme,
        language: 'es',
        paceSeconds: 15,
        maxWords: 100,
        isPrivate: false,
        allowNSFW: false
      },
      currentTurnUid: 'another-player-id',
      turnEndsAt: new Date(Date.now() + 15000),
      lastActivityAt: new Date(),
      totalVotes: 0,
      weekNumber: 12,
      createdAt: story.createdAt
    };

    setCurrentGame(mockStory);
    setRoute(AppRoute.GAME);
  };

  // Aplicar ORDER BY created_at DESC
  const filteredStories = (selectedTheme 
    ? hotStories.filter(s => s.theme === selectedTheme)
    : hotStories).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="px-4 space-y-8 mt-4 animate-in fade-in duration-500 pb-20">
      <section>
        <div className="relative overflow-hidden bg-white rounded-[2.5rem] p-8 border-4 border-zinc-900 shadow-neo text-center">
            <h2 className="text-4xl font-black text-zinc-900 leading-[0.9] tracking-tighter uppercase mb-6 italic">
              LA HISTORIA <br/>TE NECESITA.
            </h2>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setRoute(AppRoute.PLAY)}
                className="w-full bg-mint text-zinc-900 font-black text-2xl py-5 rounded-2xl border-4 border-zinc-900 shadow-neo-sm active:translate-y-1 active:shadow-none transition-all uppercase"
              >
                ¡JUGAR YA!
              </button>
              <button 
                onClick={() => setRoute(AppRoute.CREATE_STORY)}
                className="w-full bg-zinc-900 text-white font-black text-sm py-4 rounded-2xl border-2 border-zinc-900 shadow-neo-sm active:translate-y-1 active:shadow-none transition-all uppercase flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">add_circle</span>
                Crear Mi Sala
              </button>
            </div>
        </div>
      </section>

      {/* Nueva Sección Explicativa */}
      <section className="py-8 px-6 text-center bg-gradient-to-b from-transparent to-indigo-50/50 rounded-[2.5rem] border-2 border-dashed border-zinc-200">
        <h3 className="text-2xl font-black text-zinc-900 mb-4 italic uppercase tracking-tighter">
          ¿Cómo funciona?
        </h3>
        
        <p className="text-sm font-medium leading-relaxed text-zinc-600 mb-8 max-w-[280px] mx-auto">
          Únete a salas de juego donde <strong className="text-zinc-900">una palabra cada vez</strong> construye historias increíbles. 
          Colabora con otros en tiempo real, vota y gana monedas.
        </p>
        
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-zinc-900 rounded-xl text-[10px] font-black uppercase shadow-neo-sm">
            <span>🎮</span> Juega en tiempo real
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-zinc-900 rounded-xl text-[10px] font-black uppercase shadow-neo-sm">
            <span>⭐</span> Vota historias
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-zinc-900 rounded-xl text-[10px] font-black uppercase shadow-neo-sm">
            <span>🪙</span> Gana monedas
          </div>
        </div>
        
        <button
          onClick={() => setRoute(AppRoute.PLAY)}
          className="px-10 py-4 bg-zinc-900 text-white border-2 border-zinc-900 rounded-2xl text-sm font-black uppercase italic tracking-widest shadow-neo active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 mx-auto"
        >
          Explorar Salas
          <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
        </button>
      </section>

      <section>
        <div className="flex items-center justify-between px-2 mb-4">
          <h2 className="text-2xl font-black text-zinc-900 flex items-center gap-2 italic uppercase">
            <span className="text-indigo-500 material-symbols-outlined font-bold">explore</span>
            Temáticas
          </h2>
        </div>
        <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar -mx-4 px-4">
          {STORY_THEMES.map((theme) => (
            <button 
              key={theme.id} 
              onClick={() => setSelectedTheme(selectedTheme === theme.id ? null : theme.id)}
              className={`shrink-0 flex items-center gap-2 px-6 py-3 rounded-full font-bold border-2 border-zinc-900 transition-all shadow-neo-sm
                ${selectedTheme === theme.id ? `${theme.color} ${theme.text}` : 'bg-white text-zinc-400 opacity-60'}`}
            >
              <span>{theme.emoji}</span> {theme.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between px-2 mb-4">
          <h2 className="text-2xl font-black text-zinc-900 flex items-center gap-2 italic uppercase">
            <span className="text-primary material-symbols-outlined font-bold">local_fire_department</span>
            Populares
          </h2>
          <button onClick={() => setRoute(AppRoute.HOT_STORIES)} className="text-primary font-bold text-sm underline uppercase tracking-tighter">Ver Todo</button>
        </div>

        <div className="space-y-4">
          {filteredStories.map((story) => (
            <div key={story.id} className="bg-white rounded-2xl border-4 border-zinc-900 shadow-neo overflow-hidden flex h-32 relative">
              {story.needsPlayers && story.players < 3 && (
                <div className="absolute top-2 left-2 z-10 bg-yellow-300 border-2 border-zinc-900 px-2 py-0.5 rounded-full shadow-neo-sm flex items-center gap-1">
                  <span className="text-[7px] font-black uppercase text-zinc-900 tracking-tighter italic">🔍 BUSCANDO {(story.playerSlots || 3) - story.players} MÁS</span>
                </div>
              )}
              <div className="w-1/3 bg-cover bg-center border-r-4 border-zinc-900" style={{ backgroundImage: `url(${story.coverImageUrl})` }}></div>
              <div className="w-2/3 p-4 flex flex-col justify-between">
                <h3 className="font-bold text-sm text-zinc-900 leading-tight line-clamp-2 italic uppercase">{story.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{story.players} JUGANDO</span>
                  <button 
                    onClick={() => handleJoinStory(story)}
                    className="bg-primary text-white text-[9px] font-black px-4 py-1.5 rounded-full border-2 border-zinc-900 shadow-neo-sm active:translate-y-0.5 active:shadow-none"
                  >
                    ENTRAR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
