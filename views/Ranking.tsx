
import React, { useState } from 'react';
import { useAppState } from '../store';
import { AppRoute } from '../types';
import { VoteButton } from '../components/VoteButton';

export const Ranking: React.FC = () => {
  const { setRoute, setCurrentGame, user } = useAppState();
  const [activeFilter, setActiveFilter] = useState<'week' | 'history'>('week');

  const rankingData = [
    { id: 'r1', title: 'El burrito volador', votes: 2450, pos: 1, cover: 'https://picsum.photos/seed/burrito/400/300', creatorUid: 'other' },
    { id: 'r2', title: 'Luna de queso neón', votes: 1980, pos: 2, cover: 'https://picsum.photos/seed/moon/400/300', creatorUid: 'other' },
    { id: 'r3', title: 'Escape del teclado', votes: 1400, pos: 3, cover: 'https://picsum.photos/seed/keyboard/400/300', creatorUid: 'other' },
    { id: 'r4', title: 'Un bug con sentimientos', votes: 890, pos: 4, cover: 'https://picsum.photos/seed/bug/400/300', creatorUid: 'other' },
  ];

  const handleRead = (story: any) => {
    setCurrentGame({ 
      ...story, 
      words: [], 
      status: 'closed', 
      totalVotes: story.votes, 
      rankingPosition: story.pos, 
      coverImageUrl: story.cover,
      settings: { language: 'es', theme: 'General', maxWords: 100, isPrivate: false, paceSeconds: 10, allowNSFW: false }
    } as any);
    setRoute(AppRoute.STORY_DETAIL);
  };

  return (
    <div className="px-6 space-y-8 mt-4 animate-in fade-in duration-500 pb-24">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black tracking-tighter uppercase italic">Ranking Global</h2>
        <div className="flex items-center justify-center gap-1">
          <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Competición en vivo</span>
        </div>
      </div>

      <nav className="flex p-1 bg-zinc-100 rounded-2xl border-2 border-zinc-900">
        <button 
          onClick={() => setActiveFilter('week')}
          className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${activeFilter === 'week' ? 'bg-primary text-white shadow-neo-sm border-2 border-zinc-900' : 'text-zinc-400'}`}
        >Esta Semana</button>
        <button 
          onClick={() => setActiveFilter('history')}
          className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${activeFilter === 'history' ? 'bg-primary text-white shadow-neo-sm border-2 border-zinc-900' : 'text-zinc-400'}`}
        >Histórico</button>
      </nav>

      <div className="space-y-6">
        {rankingData.map((story) => (
          <div key={story.id} className="relative pt-4">
            <div className={`absolute top-0 left-6 z-20 px-4 py-1 rounded-full border-2 border-zinc-900 shadow-neo-sm font-black text-[10px] uppercase italic 
              ${story.pos === 1 ? 'bg-gold' : story.pos === 2 ? 'bg-zinc-200' : story.pos === 3 ? 'bg-orange-300' : 'bg-white'}`}>
              #{story.pos} GLOBAL
            </div>
            <div className="bg-white rounded-[2.5rem] overflow-hidden border-4 border-zinc-900 shadow-neo">
               <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${story.cover})` }}></div>
               <div className="p-6 flex items-center justify-between">
                  <div className="flex flex-col">
                    <h3 className="font-black text-lg text-zinc-900 italic uppercase leading-none truncate max-w-[160px]">{story.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                       <VoteButton 
                         storyId={story.id} 
                         votes={story.votes} 
                         compact 
                         disabled={story.creatorUid === user?.uid}
                       />
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRead(story)}
                    className="size-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-neo-sm active:translate-y-0.5 active:shadow-none"
                  >
                    <span className="material-symbols-outlined text-2xl">auto_stories</span>
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
