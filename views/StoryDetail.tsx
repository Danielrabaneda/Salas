
import React from 'react';
import { useAppState } from '../store';
import { AppRoute } from '../types';
import { VoteButton } from '../components/VoteButton';

export const StoryDetail: React.FC = () => {
  const { setRoute, currentGame, user } = useAppState();

  const fullStoryText = currentGame?.words.length 
    ? currentGame.words.map(w => w.word).join(' ') 
    : "Había una vez un pequeño robot que soñaba con pintar cielos de color neón. Cada día, buscaba píxeles perdidos entre los cables oxidados del viejo almacén, hasta que un día encontró la luz definitiva.";

  return (
    <div className="animate-in fade-in duration-500 pb-24">
      {/* Portada Header */}
      <div className="relative h-64 w-full border-b-4 border-zinc-900">
        <img 
          src={currentGame?.coverImageUrl || 'https://picsum.photos/seed/read/600/400'} 
          className="w-full h-full object-cover" 
          alt="Story"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent to-transparent flex flex-col justify-end p-8">
           <button 
             onClick={() => setRoute(AppRoute.MY_STORIES)}
             className="absolute top-6 left-6 size-10 bg-white border-2 border-zinc-900 rounded-full flex items-center justify-center shadow-neo-sm active:translate-y-0.5 active:shadow-none"
           >
             <span className="material-symbols-outlined font-black">arrow_back</span>
           </button>
           <h2 className="text-white text-3xl font-black italic uppercase tracking-tighter leading-none mb-2 drop-shadow-lg">
             {currentGame?.title || currentGame?.settings?.theme || "Historia Épica"}
           </h2>
           <div className="flex gap-4">
              <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full border-2 border-zinc-900 shadow-neo-sm uppercase italic">#{currentGame?.rankingPosition || 'TOP'}</span>
              <span className="bg-mint text-zinc-900 text-[10px] font-black px-3 py-1 rounded-full border-2 border-zinc-900 shadow-neo-sm uppercase italic">{currentGame?.totalVotes || 0} VOTOS</span>
           </div>
        </div>
      </div>

      <div className="px-8 pt-10 space-y-8">
        {/* Contenido de la historia */}
        <div className="relative p-8 bg-zinc-50 rounded-[2.5rem] border-4 border-zinc-900 shadow-neo-sm overflow-hidden">
           <div className="absolute -top-4 -left-4 size-20 opacity-10">
              <span className="material-symbols-outlined text-8xl">format_quote</span>
           </div>
           <p className="text-xl font-body font-medium leading-relaxed text-zinc-800 first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:float-left first-letter:mr-3 italic">
             {fullStoryText}
           </p>
        </div>

        {/* Sistema de Votación */}
        <div className="space-y-4">
           <VoteButton 
             storyId={currentGame?.id || ''} 
             votes={currentGame?.totalVotes || 0} 
             disabled={currentGame?.creatorUid === user?.uid}
           />
           {currentGame?.creatorUid === user?.uid && (
             <p className="text-center text-[9px] font-black text-zinc-400 uppercase tracking-widest italic">Esta es tu historia, no puedes votarla.</p>
           )}
        </div>

        {/* Autores */}
        <section className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Co-autores del éxito</h3>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="size-12 rounded-full border-2 border-zinc-900 overflow-hidden shadow-neo-sm bg-white p-0.5">
                <img src={`https://picsum.photos/seed/user${i}/100`} className="rounded-full" alt="Author" />
              </div>
            ))}
            <div className="size-12 rounded-full border-2 border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 font-black text-xs">
              +{Math.floor(Math.random() * 5)}
            </div>
          </div>
        </section>

        {/* Acciones */}
        <div className="flex gap-4 pt-4">
           <button 
             onClick={() => {
               navigator.clipboard.writeText(`¡Mira esta historia en Una palabra para la historia! https://onewordstory.app/read/${currentGame?.id}`);
               alert("¡Enlace copiado!");
             }}
             className="flex-1 bg-zinc-900 text-white py-5 rounded-full font-black uppercase shadow-neo active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
           >
              <span className="material-symbols-outlined">share</span> Compartir
           </button>
        </div>
      </div>
    </div>
  );
};