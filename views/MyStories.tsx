
import React, { useState } from 'react';
import { useAppState } from '../store';
import { AppRoute, Story } from '../types';

export const MyStories: React.FC = () => {
  const { setRoute, user, setCurrentGame } = useAppState();
  const [activeTab, setActiveTab] = useState<'active' | 'closed' | 'won'>('active');

  const myStoriesList = [
    { 
      id: 'm1', 
      title: 'La Odisea del Espacio', 
      status: 'active', 
      words: Array(12).fill({ word: 'Space', uid: 'other', timestamp: new Date(), index: 0 }), 
      coverImageUrl: 'https://picsum.photos/seed/space/400/300', 
      lastActivity: 'Hace 2 min',
      creatorUid: user?.uid || 'user-123',
      participants: [user?.uid || 'user-123'],
      totalVotes: 0,
      settings: { language: 'es', theme: 'Terror', maxWords: 50, isPrivate: false, paceSeconds: 10, allowNSFW: false }
    },
    { 
      id: 'm2', 
      title: 'El gato detective', 
      status: 'closed', 
      words: Array(50).fill({}), 
      coverImageUrl: 'https://picsum.photos/seed/cat/400/300', 
      lastActivity: 'Ayer', 
      rankingPosition: 3,
      totalVotes: 120,
      settings: { language: 'es', theme: 'Humor', maxWords: 50, isPrivate: false, paceSeconds: 10, allowNSFW: false }
    },
    { 
      id: 'm3', 
      title: 'Cenas peligrosas', 
      status: 'closed', 
      words: Array(45).fill({}), 
      coverImageUrl: 'https://picsum.photos/seed/dinner/400/300', 
      lastActivity: 'Hace 3 días',
      totalVotes: 45,
      settings: { language: 'es', theme: 'Salseo', maxWords: 50, isPrivate: false, paceSeconds: 10, allowNSFW: false }
    },
    { 
      id: 'm4', 
      title: 'El campeón eterno', 
      status: 'closed', 
      words: Array(100).fill({}), 
      coverImageUrl: 'https://picsum.photos/seed/gold/400/300', 
      lastActivity: 'Semana pasada', 
      rankingPosition: 1,
      totalVotes: 1450,
      settings: { language: 'es', theme: 'Humor', maxWords: 100, isPrivate: false, paceSeconds: 15, allowNSFW: false }
    }
  ];

  const filtered = myStoriesList.filter(s => {
    if (activeTab === 'active') return s.status === 'active';
    if (activeTab === 'closed') return s.status === 'closed';
    if (activeTab === 'won') return s.status === 'closed' && s.rankingPosition && s.rankingPosition <= 10;
    return true;
  });

  const handleAction = (story: any) => {
    if (story.status === 'active') {
      setCurrentGame(story as any);
      setRoute(AppRoute.GAME);
    } else {
      setCurrentGame(story as any);
      setRoute(AppRoute.STORY_DETAIL);
    }
  };

  return (
    <div className="px-6 space-y-8 mt-6 animate-in slide-in-from-right duration-300 pb-24">
      <div className="flex items-center gap-4">
        <button onClick={() => setRoute(AppRoute.PROFILE)} className="size-11 flex items-center justify-center bg-white border-2 border-zinc-900 rounded-full shadow-neo-sm active:translate-y-0.5 active:shadow-none">
          <span className="material-symbols-outlined font-black">arrow_back</span>
        </button>
        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-zinc-900">Mis Historias</h2>
      </div>

      <nav className="flex p-1 bg-zinc-100 rounded-2xl border-2 border-zinc-900 shadow-neo-sm">
        {[
          { id: 'active', label: 'Activas' },
          { id: 'closed', label: 'Terminadas' },
          { id: 'won', label: 'Ganadas' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-neo-sm border-2 border-zinc-900' : 'text-zinc-400'}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="space-y-6">
        {filtered.length > 0 ? filtered.map(story => (
          <div key={story.id} className="bg-white rounded-[2rem] border-4 border-zinc-900 shadow-neo overflow-hidden flex h-36 relative">
             <div className="w-1/3 bg-cover bg-center border-r-4 border-zinc-900" style={{ backgroundImage: `url(${story.coverImageUrl})` }}>
                {story.rankingPosition && (
                  <div className="bg-gold border-2 border-zinc-900 text-[10px] font-black p-1 absolute m-2 rounded-lg shadow-neo-sm">
                    #{story.rankingPosition}
                  </div>
                )}
             </div>
             <div className="w-2/3 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-black text-sm text-zinc-900 leading-tight uppercase line-clamp-2 italic">{story.title}</h3>
                    {story.status === 'closed' && (
                      <div className="flex items-center gap-1 bg-gold/20 px-2 py-0.5 rounded-full border border-gold/40">
                         <span className="material-symbols-outlined text-[10px] text-zinc-900 fill-1">favorite</span>
                         <span className="text-[9px] font-black text-zinc-900">{story.totalVotes}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[9px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">{story.words.length} PALABRAS • {story.lastActivity}</p>
                </div>
                <button 
                  onClick={() => handleAction(story)}
                  className={`w-full py-2 rounded-xl border-2 border-zinc-900 font-black text-[10px] uppercase shadow-neo-sm active:translate-y-0.5 active:shadow-none ${story.status === 'active' ? 'bg-mint text-zinc-900' : 'bg-white text-primary'}`}
                >
                  {story.status === 'active' ? 'Volver a la historia' : 'Leer historia'}
                </button>
             </div>
          </div>
        )) : (
          <div className="py-20 text-center flex flex-col items-center opacity-30 grayscale">
            <span className="material-symbols-outlined text-6xl mb-4">history_edu</span>
            <p className="font-black uppercase tracking-widest text-xs italic">No hay nada por aquí...</p>
          </div>
        )}
      </div>
    </div>
  );
};
