
import React from 'react';
import { Story } from '../types';

interface RoomCardProps {
  room: Story;
  onJoin: (room: Story) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onJoin }) => {
  const playerProgress = (room.participants.length / (room.playerSlots || 5)) * 100;

  return (
    <div className="bg-white rounded-[2rem] border-4 border-zinc-900 shadow-neo overflow-hidden flex flex-col group animate-in slide-in-from-bottom-4">
      <div className="relative h-40 border-b-4 border-zinc-900">
        <img src={room.coverImageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" alt={room.title} />
        <div className="absolute top-4 left-4 bg-zinc-900 text-white text-[9px] font-black px-3 py-1 rounded-full border-2 border-white uppercase tracking-widest italic">
          {room.settings.theme}
        </div>
        <div className="absolute bottom-4 right-4 bg-mint text-zinc-900 text-[10px] font-black px-3 py-1 rounded-lg border-2 border-zinc-900 shadow-neo-sm">
          {room.words.length} PALABRAS
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-black italic uppercase text-zinc-900 leading-none truncate group-hover:text-primary transition-colors">
            {room.title}
          </h3>
          <div className="flex items-center gap-2 mt-3">
             <div className="flex-1 h-3 bg-zinc-100 rounded-full border-2 border-zinc-900 overflow-hidden">
                <div 
                  className="h-full bg-gold transition-all duration-1000" 
                  style={{ width: `${playerProgress}%` }}
                ></div>
             </div>
             <span className="text-[10px] font-black uppercase text-zinc-400">
                {room.participants.length}/{room.playerSlots || 5} JUGADORES
             </span>
          </div>
        </div>

        <button 
          onClick={() => onJoin(room)}
          className="w-full bg-mint text-zinc-900 py-4 rounded-2xl border-2 border-zinc-900 shadow-neo-sm font-black text-xs uppercase flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none transition-all"
        >
          <span className="material-symbols-outlined font-black">login</span>
          UNIRSE AHORA
        </button>
      </div>
    </div>
  );
};
