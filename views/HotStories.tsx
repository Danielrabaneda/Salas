
import React from 'react';
import { useAppState } from '../store';
import { AppRoute } from '../types';

export const HotStories: React.FC = () => {
  const { setRoute } = useAppState();

  const stories = Array.from({ length: 10 }).map((_, i) => ({
    id: `hot-${i}`,
    title: i % 2 === 0 ? 'Misterio en el código fuente' : 'La rebelión de las IA domésticas',
    words: 100 + i * 5,
    players: 5 + i,
    category: 'Oficina',
    img: `https://picsum.photos/seed/hot${i}/400/300`
  }));

  return (
    <div className="px-6 space-y-6 pt-6 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4">
        <button onClick={() => setRoute(AppRoute.HOME)} className="size-11 flex items-center justify-center bg-white border-2 border-zinc-900 rounded-full shadow-neo-sm active:translate-y-0.5 active:shadow-none">
          <span className="material-symbols-outlined font-black">arrow_back</span>
        </button>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">Historias Calientes</h2>
          <p className="text-[10px] font-black text-primary uppercase tracking-widest">Las más activas ahora mismo</p>
        </div>
      </div>

      <div className="grid gap-6 pb-24">
        {stories.map((story) => (
          <div key={story.id} className="bg-white rounded-[2rem] border-4 border-zinc-900 shadow-neo overflow-hidden">
            <div className="h-48 bg-cover bg-center border-b-4 border-zinc-900" style={{ backgroundImage: `url(${story.img})` }}>
              <div className="bg-primary text-white text-[10px] font-black px-4 py-1.5 absolute m-4 rounded-full border-2 border-zinc-900 shadow-neo-sm uppercase">
                {story.category}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-black text-zinc-900 mb-4">{story.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-sm font-black">group</span>
                    <span className="text-xs font-black text-zinc-900 uppercase">{story.players}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-zinc-400 text-sm font-black">edit_note</span>
                    <span className="text-xs font-black text-zinc-900 uppercase">{story.words} palabras</span>
                  </div>
                </div>
                <button 
                  onClick={() => setRoute(AppRoute.GAME)}
                  className="bg-mint text-zinc-900 font-black px-8 py-2.5 rounded-full border-2 border-zinc-900 shadow-neo-sm active:translate-y-0.5 active:shadow-none uppercase tracking-tighter"
                >
                  Entrar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
