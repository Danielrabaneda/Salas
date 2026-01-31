
import React from 'react';
import { useAppState } from '../store';

interface VoteButtonProps {
  storyId: string;
  votes: number;
  compact?: boolean;
  disabled?: boolean;
}

export const VoteButton: React.FC<VoteButtonProps> = ({ storyId, votes, compact, disabled }) => {
  const { voteStory, hasVotedStory, user } = useAppState();
  const alreadyVoted = hasVotedStory(storyId);
  const isGuest = user?.isGuest;

  if (compact) {
    return (
      <button 
        onClick={(e) => {
          e.stopPropagation();
          if (!alreadyVoted && !isGuest && !disabled) voteStory(storyId);
        }}
        disabled={alreadyVoted || isGuest || disabled}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-zinc-900 shadow-neo-sm transition-all active:translate-y-0.5 active:shadow-none
          ${alreadyVoted ? 'bg-mint text-zinc-900 border-zinc-900' : 'bg-gold text-zinc-900'}
          ${(isGuest || disabled) && !alreadyVoted ? 'opacity-50 grayscale' : ''}`}
      >
        <span className="material-symbols-outlined text-sm font-black fill-1">
          {alreadyVoted ? 'check_circle' : 'favorite'}
        </span>
        <span className="text-[10px] font-black uppercase tracking-tighter">
          {alreadyVoted ? 'Votado' : votes}
        </span>
      </button>
    );
  }

  return (
    <button 
      onClick={() => {
        if (!alreadyVoted && !isGuest && !disabled) voteStory(storyId);
      }}
      disabled={alreadyVoted || isGuest || disabled}
      className={`w-full group relative overflow-hidden flex flex-col items-center justify-center p-6 rounded-[2rem] border-4 border-zinc-900 shadow-neo transition-all active:translate-y-1 active:shadow-none
        ${alreadyVoted ? 'bg-mint text-zinc-900' : 'bg-gold text-zinc-900'}
        ${(isGuest || disabled) && !alreadyVoted ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={`material-symbols-outlined text-3xl font-black transition-transform group-active:scale-125 ${alreadyVoted ? 'fill-1' : ''}`}>
          {alreadyVoted ? 'verified' : 'favorite'}
        </span>
        <span className="text-xl font-black uppercase italic tracking-tighter">
          {alreadyVoted ? 'Ya Votaste' : 'Votar esta historia'}
        </span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
        {votes + (alreadyVoted ? 0 : 0)} votos totales • {alreadyVoted ? '¡Gracias!' : '+5 monedas por votar'}
      </p>
      
      {/* Partículas visuales simuladas al votar (efecto CSS) */}
      {!alreadyVoted && !isGuest && (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-active:opacity-100 flex items-center justify-center">
           <span className="absolute animate-ping text-2xl">✨</span>
           <span className="absolute animate-ping delay-75 text-xl translate-x-10 -translate-y-10">💰</span>
        </div>
      )}
    </button>
  );
};
