
import React, { useState } from 'react';
import { useAppState } from '../store';
import { AppRoute, Story } from '../types';
import { STORY_THEMES } from '../constants';

export const CreateStory: React.FC = () => {
  const { setRoute, setCurrentGame, addAvailableRoom, user } = useAppState();
  
  const [isCustomTheme, setIsCustomTheme] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string>('https://picsum.photos/seed/default/600/400');
  const [config, setConfig] = useState({
    language: 'es' as 'es' | 'en',
    paceSeconds: 10,
    maxWords: 50,
    theme: 'humor',
    isPrivate: false,
    allowNSFW: false
  });

  const handleSelectTheme = (themeId: string) => {
    setIsCustomTheme(false);
    setConfig({ ...config, theme: themeId });
    // Sugerir portada basada en tema
    setCoverUrl(`https://picsum.photos/seed/${themeId}/600/400`);
  };

  const handlePickImage = () => {
    // Simulación de selector de galería
    const randomId = Math.floor(Math.random() * 1000);
    setCoverUrl(`https://picsum.photos/seed/${randomId}/600/400`);
  };

  const handleCreate = () => {
    if (!config.theme.trim()) {
      alert("Por favor, define una temática para tu historia.");
      return;
    }

    const newStory: Story = {
      id: Math.random().toString(36).substr(2, 9),
      creatorUid: user?.uid || 'me',
      status: 'active',
      words: [],
      participants: [user?.uid || 'me'],
      votedBy: [],
      participantWordCount: {},
      coverImageUrl: coverUrl,
      settings: config,
      currentTurnUid: user?.uid || 'me',
      turnEndsAt: new Date(Date.now() + config.paceSeconds * 1000),
      lastActivityAt: new Date(),
      totalVotes: 0,
      weekNumber: 12,
      createdAt: new Date(), // Campo created_at
      inviteCode: config.isPrivate ? Math.random().toString(36).substring(2, 8).toUpperCase() : undefined
    };

    addAvailableRoom(newStory); // Simula el ORDER BY DESC al insertarla en el pool
    setCurrentGame(newStory);
    setRoute(AppRoute.GAME);
  };

  return (
    <div className="px-6 space-y-8 mt-6 animate-in slide-in-from-right duration-300 pb-24">
      <div className="flex items-center gap-4">
        <button onClick={() => setRoute(AppRoute.HOME)} className="size-11 flex items-center justify-center bg-white border-2 border-zinc-900 rounded-full shadow-neo-sm active:translate-y-0.5 active:shadow-none">
          <span className="material-symbols-outlined font-black">arrow_back</span>
        </button>
        <h2 className="text-2xl font-black uppercase tracking-tighter">Nueva Historia</h2>
      </div>

      <div className="space-y-6">
        {/* Portada Selector */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">Portada de la Historia</label>
          <div 
            onClick={handlePickImage}
            className="relative h-40 w-full rounded-[2rem] border-4 border-zinc-900 overflow-hidden shadow-neo cursor-pointer group"
          >
            <img src={coverUrl} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-white text-4xl">image_search</span>
              <span className="text-white font-black text-xs uppercase mt-2">Cambiar imagen</span>
            </div>
            <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full border-2 border-zinc-900 shadow-neo-sm">
              <span className="text-[10px] font-black uppercase">Click para cambiar</span>
            </div>
          </div>
        </div>

        {/* Idioma y Ritmo */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">Idioma</label>
            <div className="flex p-1 bg-zinc-100 rounded-2xl border-2 border-zinc-900">
              <button 
                onClick={() => setConfig({...config, language: 'es'})}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${config.language === 'es' ? 'bg-primary text-white shadow-neo-sm' : 'text-zinc-500'}`}
              >ESPAÑOL</button>
              <button 
                onClick={() => setConfig({...config, language: 'en'})}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${config.language === 'en' ? 'bg-primary text-white shadow-neo-sm' : 'text-zinc-500'}`}
              >INGLÉS</button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">Ritmo</label>
            <div className="flex p-1 bg-zinc-100 rounded-2xl border-2 border-zinc-900">
              <button 
                onClick={() => setConfig({...config, paceSeconds: 10})}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${config.paceSeconds === 10 ? 'bg-mint text-zinc-900 shadow-neo-sm' : 'text-zinc-500'}`}
              >10S</button>
              <button 
                onClick={() => setConfig({...config, paceSeconds: 30})}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${config.paceSeconds === 30 ? 'bg-mint text-zinc-900 shadow-neo-sm' : 'text-zinc-500'}`}
              >30S</button>
            </div>
          </div>
        </div>

        {/* Temática */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">Temática</label>
          <div className="flex flex-wrap gap-2">
            {STORY_THEMES.map(t => (
              <button 
                key={t.id}
                onClick={() => handleSelectTheme(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 border-zinc-900 text-sm font-bold transition-all ${config.theme === t.id && !isCustomTheme ? t.color + ' ' + t.text + ' shadow-neo-sm' : 'bg-white text-zinc-400'}`}
              >
                <span>{t.emoji}</span> {t.label}
              </button>
            ))}
            <button 
              onClick={() => {
                setIsCustomTheme(true);
                if (!isCustomTheme) setConfig({ ...config, theme: '' });
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 border-zinc-900 text-sm font-bold transition-all ${isCustomTheme ? 'bg-indigo-500 text-white shadow-neo-sm' : 'bg-white text-zinc-400'}`}
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Personalizada
            </button>
          </div>
          {isCustomTheme && (
            <input 
              autoFocus
              type="text"
              placeholder="Ej: Odisea Espacial..."
              value={config.theme}
              onChange={(e) => setConfig({ ...config, theme: e.target.value })}
              className="w-full h-14 bg-white border-2 border-zinc-900 rounded-2xl px-5 font-bold shadow-neo-sm focus:ring-0"
            />
          )}
        </div>
      </div>

      <button 
        onClick={handleCreate}
        className="w-full bg-primary text-white font-black text-xl py-5 rounded-full border-4 border-zinc-900 shadow-neo active:translate-y-1 active:shadow-none transition-all uppercase"
      >
        ¡Iniciar Historia!
      </button>
    </div>
  );
};
