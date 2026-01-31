
import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../store';
import { AppRoute, StoryWord, Story } from '../types';
import { STORY_THEMES } from '../constants';
import { generateAIWord, generateStoryTitle } from '../utils/aiService';

type PracticeStep = 'CONFIG' | 'PLAYING' | 'RESULTS';

export const PracticeMode: React.FC = () => {
  const { user, setUser, setRoute, setCurrentGame } = useAppState();
  const [step, setStep] = useState<PracticeStep>('CONFIG');
  
  // Config
  const [config, setConfig] = useState({
    theme: STORY_THEMES[0].id,
    difficulty: 'Normal',
    maxLength: 30
  });

  // Game State
  const [history, setHistory] = useState<StoryWord[]>([]);
  const [input, setInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [finalStory, setFinalStory] = useState<Story | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, isAiThinking]);

  const startPractice = () => {
    setHistory([]);
    setStep('PLAYING');
  };

  const handleSend = async () => {
    if (!input.trim() || isAiThinking) return;

    const userWord = input.trim().split(' ')[0];
    const newUserWord: StoryWord = {
      word: userWord,
      uid: user?.uid || 'user',
      timestamp: new Date(),
      index: history.length
    };

    const newHistory = [...history, newUserWord];
    setHistory(newHistory);
    setInput('');

    if (newHistory.length >= config.maxLength) {
      finishGame(newHistory);
      return;
    }

    // Turno IA
    setIsAiThinking(true);
    const aiWord = await generateAIWord(newHistory.map(h => h.word), config.theme, config.difficulty);
    const newAiWord: StoryWord = {
      word: aiWord,
      uid: 'ai-bot',
      timestamp: new Date(),
      index: newHistory.length
    };
    
    const finalHistory = [...newHistory, newAiWord];
    setHistory(finalHistory);
    setIsAiThinking(false);

    if (finalHistory.length >= config.maxLength) {
      finishGame(finalHistory);
    }
  };

  const finishGame = async (gameHistory: StoryWord[]) => {
    setIsGeneratingTitle(true);
    setStep('RESULTS');
    
    const fullText = gameHistory.map(h => h.word).join(' ');
    const aiTitle = await generateStoryTitle(fullText);

    const practiceStory: Story = {
      id: 'practice-' + Date.now(),
      creatorUid: user?.uid || 'user',
      status: 'closed',
      words: gameHistory,
      participants: [user?.uid || 'user', 'ai-bot'],
      votedBy: [],
      participantWordCount: {},
      isPractice: true,
      title: aiTitle,
      coverImageUrl: `https://picsum.photos/seed/${config.theme}/600/400`,
      settings: {
        theme: config.theme,
        language: 'es',
        maxWords: config.maxLength,
        isPrivate: true,
        paceSeconds: 0,
        allowNSFW: false
      },
      currentTurnUid: '',
      turnEndsAt: new Date(),
      lastActivityAt: new Date(),
      totalVotes: 0,
      weekNumber: 0,
      createdAt: new Date()
    };

    setFinalStory(practiceStory);
    setIsGeneratingTitle(false);

    // Actualizar estadísticas del usuario
    if (user) {
      const currentStats = user.practiceStats || { totalPartidas: 0, mejorRacha: 0 };
      const updatedUser = {
        ...user,
        coins: user.coins + 3, // Recompensa por práctica
        practiceStats: {
          totalPartidas: currentStats.totalPartidas + 1,
          mejorRacha: Math.max(currentStats.mejorRacha, gameHistory.length / 2) // Asumiendo racha = palabras usuario
        }
      };
      setUser(updatedUser);
      localStorage.setItem('OWS_SESSION', JSON.stringify(updatedUser));
    }
  };

  if (step === 'CONFIG') {
    return (
      <div className="p-8 space-y-8 animate-in fade-in duration-500 pb-24">
        <div className="flex items-center gap-4">
          <button onClick={() => setRoute(AppRoute.PROFILE)} className="size-12 bg-white border-2 border-zinc-900 rounded-2xl flex items-center justify-center shadow-neo-sm active:translate-y-0.5 active:shadow-none">
            <span className="material-symbols-outlined font-black">arrow_back</span>
          </button>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">Entrenar con IA</h2>
        </div>

        <div className="bg-white border-4 border-zinc-900 rounded-[2.5rem] p-8 shadow-neo space-y-8">
          <div className="space-y-4">
            <label className="text-xs font-black uppercase text-zinc-400 tracking-widest">Elige Temática</label>
            <div className="grid grid-cols-2 gap-3">
              {STORY_THEMES.map(t => (
                <button 
                  key={t.id}
                  onClick={() => setConfig({...config, theme: t.id})}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 border-zinc-900 transition-all font-bold uppercase text-xs ${config.theme === t.id ? 'bg-primary text-white shadow-neo-sm' : 'bg-zinc-50 text-zinc-400 opacity-60'}`}
                >
                  <span>{t.emoji}</span> {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black uppercase text-zinc-400 tracking-widest">Dificultad IA</label>
            <div className="flex p-1 bg-zinc-100 rounded-2xl border-2 border-zinc-900 shadow-neo-sm">
              {['Fácil', 'Normal', 'Difícil'].map(d => (
                <button 
                  key={d}
                  onClick={() => setConfig({...config, difficulty: d})}
                  className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${config.difficulty === d ? 'bg-zinc-900 text-white' : 'text-zinc-400'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black uppercase text-zinc-400 tracking-widest">Longitud de Historia</label>
            <div className="flex p-1 bg-zinc-100 rounded-2xl border-2 border-zinc-900 shadow-neo-sm">
              {[20, 50, 100].map(l => (
                <button 
                  key={l}
                  onClick={() => setConfig({...config, maxLength: l})}
                  className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${config.maxLength === l ? 'bg-mint text-zinc-900' : 'text-zinc-400'}`}
                >
                  {l === 20 ? 'Corta' : l === 50 ? 'Media' : 'Larga'}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={startPractice}
            className="w-full bg-primary text-white py-5 rounded-2xl border-4 border-zinc-900 shadow-neo font-black uppercase text-xl active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined text-3xl font-black">smart_toy</span>
            EMPEZAR PRÁCTICA
          </button>
        </div>
      </div>
    );
  }

  if (step === 'PLAYING') {
    return (
      <div className="flex flex-col h-[calc(100vh-180px)] bg-gray-50 overflow-hidden relative">
        <header className="bg-white border-b-4 border-zinc-900 p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="size-10 bg-zinc-900 rounded-full flex items-center justify-center text-white">
               <span className="material-symbols-outlined">psychology</span>
            </div>
            <div>
              <h3 className="text-sm font-black uppercase italic leading-none">Modo Práctica</h3>
              <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mt-1">IA Nivel {config.difficulty}</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-mint rounded-full border-2 border-zinc-900 font-black text-[10px] uppercase">
             {history.length} / {config.maxLength}
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-4 no-scrollbar bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]">
          <div className="flex flex-wrap gap-x-2 gap-y-3 items-baseline">
            {history.length === 0 && (
               <p className="w-full text-center py-20 opacity-20 font-black uppercase text-xs tracking-widest italic">Tú empiezas la historia...</p>
            )}
            {history.map((item, idx) => (
              <span key={idx} className={`text-2xl font-bold ${item.uid === (user?.uid || 'user') ? 'text-primary' : 'text-zinc-900'}`}>
                {item.word}
              </span>
            ))}
            {isAiThinking && (
               <span className="text-zinc-300 animate-pulse text-2xl font-black italic">IA pensando...</span>
            )}
          </div>
        </div>

        <div className="p-4 bg-white border-t-4 border-zinc-900">
           <div className="flex gap-2">
             <input 
               disabled={isAiThinking}
               value={input}
               onChange={(e) => setInput(e.target.value.replace(/\s/g, '').substring(0, 15))}
               onKeyPress={(e) => e.key === 'Enter' && handleSend()}
               className="flex-1 h-16 bg-white border-4 border-zinc-900 rounded-2xl px-6 font-black shadow-neo-sm focus:outline-none focus:border-primary disabled:bg-zinc-50"
               placeholder="Escribe 1 palabra..."
             />
             <button 
               onClick={handleSend}
               disabled={!input.trim() || isAiThinking}
               className="size-16 bg-primary text-white rounded-2xl border-4 border-zinc-900 shadow-neo active:translate-y-1 active:shadow-none disabled:opacity-30 flex items-center justify-center"
             >
               <span className="material-symbols-outlined text-3xl font-black">send</span>
             </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto no-scrollbar animate-in zoom-in duration-500 pb-24">
      {isGeneratingTitle ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-6">
           <div className="size-24 border-8 border-t-primary border-zinc-100 rounded-full animate-spin"></div>
           <h2 className="text-2xl font-black uppercase italic tracking-tighter text-center">IA Analizando tu obra maestra...</h2>
           <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Generando título creativo</p>
        </div>
      ) : (
        <>
          <div className="relative h-64 border-b-4 border-zinc-900">
            <img src={finalStory?.coverImageUrl} className="w-full h-full object-cover" alt="Practice Results" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 flex flex-col justify-end p-8">
                <span className="bg-gold text-zinc-900 text-[10px] font-black px-3 py-1 rounded-full w-fit mb-2 border-2 border-zinc-900 shadow-neo-sm uppercase italic">Partida de Práctica Finalizada</span>
                <h2 className="text-3xl font-black text-white italic uppercase leading-none drop-shadow-xl">{finalStory?.title}</h2>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="bg-zinc-50 p-8 rounded-[2.5rem] border-4 border-zinc-900 shadow-neo relative">
               <span className="absolute -top-4 -left-4 size-16 opacity-10 material-symbols-outlined text-7xl text-primary">format_quote</span>
               <p className="text-xl font-medium leading-relaxed italic text-zinc-800">
                 {finalStory?.words.map(w => w.word).join(' ')}
               </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white border-2 border-zinc-900 p-4 rounded-2xl shadow-neo-sm flex flex-col items-center">
                  <span className="text-2xl font-black italic">{history.length}</span>
                  <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Palabras totales</span>
               </div>
               <div className="bg-white border-2 border-zinc-900 p-4 rounded-2xl shadow-neo-sm flex flex-col items-center">
                  <span className="text-2xl font-black italic text-primary">+3</span>
                  <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Monedas ganadas</span>
               </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button 
                onClick={() => setStep('CONFIG')}
                className="w-full bg-mint text-zinc-900 py-5 rounded-2xl border-4 border-zinc-900 font-black uppercase text-lg shadow-neo active:translate-y-1 active:shadow-none"
              >
                Jugar de Nuevo
              </button>
              <button 
                onClick={() => setRoute(AppRoute.HOME)}
                className="w-full bg-zinc-900 text-white py-5 rounded-2xl border-4 border-zinc-900 font-black uppercase text-lg shadow-neo active:translate-y-1 active:shadow-none"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
