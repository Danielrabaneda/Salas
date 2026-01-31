
import React, { useState } from 'react';
import { useAppState } from '../store';
import { AppRoute, Story } from '../types';
import { STORY_THEMES } from '../constants';
import { RoomCard } from '../components/RoomCard';

export const ExploreRooms: React.FC = () => {
  const { setRoute, setCurrentGame, availableRooms } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  const handleJoin = (room: Story) => {
    setCurrentGame(room);
    setRoute(AppRoute.GAME);
  };

  // Aplicar ORDER BY created_at DESC y filtros
  const filteredRooms = availableRooms
    .filter(room => {
      const matchesSearch = room.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTheme = !activeTheme || room.settings.theme.toLowerCase() === activeTheme.toLowerCase();
      return matchesSearch && matchesTheme;
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="px-6 space-y-8 mt-4 animate-in fade-in duration-500 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setRoute(AppRoute.PLAY)} 
          className="size-11 flex items-center justify-center bg-white border-2 border-zinc-900 rounded-full shadow-neo-sm active:translate-y-0.5 active:shadow-none"
        >
          <span className="material-symbols-outlined font-black">arrow_back</span>
        </button>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">Explorar Salas</h2>
          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Busca tu próxima historia</p>
        </div>
      </div>

      {/* Buscador */}
      <div className="relative group">
        <input 
          type="text" 
          placeholder="Buscar por título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-14 bg-white border-4 border-zinc-900 rounded-2xl px-12 font-bold shadow-neo-sm focus:ring-0 focus:border-primary transition-all"
        />
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-black group-focus-within:text-primary transition-colors">
          search
        </span>
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900"
          >
            <span className="material-symbols-outlined text-sm font-black">close</span>
          </button>
        )}
      </div>

      {/* Filtros de Temática */}
      <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar -mx-6 px-6">
        <button 
          onClick={() => setActiveTheme(null)}
          className={`shrink-0 px-6 py-2.5 rounded-full font-black text-[10px] uppercase border-2 border-zinc-900 shadow-neo-sm transition-all
            ${!activeTheme ? 'bg-primary text-white' : 'bg-white text-zinc-400 opacity-60'}`}
        >
          Todas
        </button>
        {STORY_THEMES.map((theme) => (
          <button 
            key={theme.id}
            onClick={() => setActiveTheme(activeTheme === theme.id ? null : theme.id)}
            className={`shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-[10px] uppercase border-2 border-zinc-900 shadow-neo-sm transition-all
              ${activeTheme === theme.id ? `${theme.color} ${theme.text}` : 'bg-white text-zinc-400 opacity-60'}`}
          >
            <span>{theme.emoji}</span> {theme.label}
          </button>
        ))}
      </div>

      {/* Listado de Salas */}
      <div className="grid gap-8">
        {filteredRooms.length > 0 ? (
          filteredRooms.map(room => (
            <RoomCard key={room.id} room={room} onJoin={handleJoin} />
          ))
        ) : (
          <div className="py-20 text-center flex flex-col items-center opacity-30 grayscale space-y-4">
             <div className="size-24 bg-zinc-100 rounded-full flex items-center justify-center border-4 border-dashed border-zinc-300">
               <span className="material-symbols-outlined text-5xl">sentiment_dissatisfied</span>
             </div>
             <p className="font-black uppercase tracking-widest text-xs italic">No encontramos salas con esos filtros</p>
             <button 
              onClick={() => {setSearchTerm(''); setActiveTheme(null);}}
              className="text-primary font-black uppercase text-[10px] underline"
             >
               Limpiar filtros
             </button>
          </div>
        )}
      </div>

      {/* Contador Flotante (Opcional) */}
      <div className="fixed bottom-24 right-6 pointer-events-none">
         <div className="bg-zinc-900 text-white px-4 py-2 rounded-2xl border-2 border-white shadow-2xl flex items-center gap-2 animate-bounce">
            <span className="size-2 bg-green-500 rounded-full"></span>
            <span className="text-[9px] font-black uppercase tracking-widest">
              {availableRooms.length} SALAS DISPONIBLES
            </span>
         </div>
      </div>
    </div>
  );
};
