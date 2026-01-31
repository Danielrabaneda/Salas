
import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../store';
import { StoryWord, AppRoute } from '../types';
import { VoteButton } from '../components/VoteButton';
import { generateStoryTitle } from '../utils/aiService';

interface Participant {
  uid: string;
  displayName: string;
  avatar: string;
  reliability: number;
  isOnline: boolean;
}

export const Game: React.FC = () => {
  const { user, currentGame, setCurrentGame, setRoute, addNotification } = useAppState();
  const [wordInput, setWordInput] = useState('');
  
  const settings = currentGame?.settings;
  const defaultPace = settings?.paceSeconds ?? 10;
  const maxWords = settings?.maxWords ?? 50;
  
  const [timeLeft, setTimeLeft] = useState(defaultPace);
  const [isCritical, setIsCritical] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [showFinTooltip, setShowFinTooltip] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  
  const [participants, setParticipants] = useState<Participant[]>(() => {
    const me = { 
      uid: user?.uid || 'user-123', 
      displayName: user?.displayName || 'Tú', 
      avatar: user?.avatar || 'https://picsum.photos/seed/mago/200', 
      reliability: 3, 
      isOnline: true 
    };
    
    if (currentGame) {
      const isCreator = currentGame.creatorUid === (user?.uid || 'user-123');
      if ((currentGame.words?.length || 0) < 3 && isCreator) {
         return [me];
      }
      return [
        { uid: 'host-1', displayName: 'Anfitrión', avatar: 'https://picsum.photos/seed/1/100', reliability: 3, isOnline: true },
        me,
        { uid: 'user-3', displayName: 'RexWriter', avatar: 'https://picsum.photos/seed/3/100', reliability: 2, isOnline: true },
      ];
    }
    return [me];
  });

  const [turnIndex, setTurnIndex] = useState(0);
  const activePlayer = participants[turnIndex];
  
  const isMyTurn = participants.length === 1 || activePlayer?.uid === (user?.uid || 'user-123');

  // Efecto para notificar turno
  useEffect(() => {
    if (isMyTurn && currentGame?.status === 'active' && history.length > 0) {
      addNotification({
        type: 'turn',
        title: '¡ES TU TURNO!',
        message: `Te toca en "${currentGame.title || settings?.theme || 'Historia'}"`,
        priority: 'high',
        icon: '🎮',
        actionUrl: AppRoute.GAME
      });
    }
  }, [isMyTurn]);

  const [history, setHistory] = useState<StoryWord[]>(() => {
    return (currentGame && (currentGame.words?.length || 0) > 0) ? currentGame.words : [];
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  const isCreator = currentGame?.creatorUid === (user?.uid || 'user-123');
  const wordsLeft = maxWords - (history?.length || 0);

  const isSoloCreator = isCreator && participants.length === 1 && (history?.length || 0) < 3;

  const handleShareInvite = () => {
    const isPrivate = settings?.isPrivate;
    const themeName = settings?.theme || 'Historia';
    const msg = isPrivate 
      ? `¡Te invito a mi historia PRIVADA en Una palabra para la historia! Código: ${currentGame?.inviteCode} 🤫 Entra aquí: https://onewordstory.app/join/${currentGame?.id}`
      : `¡Únete a mi nueva historia "${themeName}"! Estamos empezando ✍️ https://onewordstory.app/join/${currentGame?.id}`;
    
    navigator.clipboard.writeText(msg);
    setShowToast("¡Enlace de invitación copiado! Envíalo a tus amigos.");
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleMarcarFin = () => {
    if (!isCreator) {
      setShowToast("Solo el creador puede cerrar la historia.");
      setTimeout(() => setShowToast(null), 3000);
      return;
    }
    setShowFinTooltip(true);
  };

  const confirmFin = async () => {
    setShowFinTooltip(false);
    setIsGeneratingTitle(true);
    
    const fullText = history.map(w => w.word).join(' ');
    const aiTitle = await generateStoryTitle(fullText);

    if (currentGame) {
      const updatedGame = {
        ...currentGame,
        status: 'closed' as const,
        words: history,
        title: aiTitle
      };
      setCurrentGame(updatedGame);
      
      addNotification({
        type: 'story_complete',
        title: '¡HISTORIA COMPLETADA!',
        message: `"${aiTitle}" ha finalizado. ¡Mira el resultado!`,
        priority: 'medium',
        icon: '🎉',
        actionUrl: AppRoute.STORY_DETAIL
      });
    }
    
    setIsGeneratingTitle(false);
    setShowToast("¡Historia finalizada con éxito! ✨");
    setTimeout(() => setShowToast(null), 3000);
  };

  useEffect(() => {
    let timer: any;
    if (currentGame?.status === 'active' && timeLeft > 0 && participants.length > 1) {
      setIsCritical(timeLeft <= 3);
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && participants.length > 1 && currentGame?.status === 'active') {
      handleTurnLoss();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, participants.length, currentGame?.status]);

  const handleTurnLoss = () => {
    const playerLost = participants[turnIndex]?.displayName || 'Jugador';
    setShowToast(`${playerLost} perdió el turno por tiempo.`);
    setTimeout(() => setShowToast(null), 3000);
    nextTurn();
  };

  const nextTurn = () => {
    setTurnIndex((prev) => (prev + 1) % participants.length);
    setTimeLeft(defaultPace);
    setWordInput('');
  };

  const handleSend = () => {
    if (!wordInput.trim() || !isMyTurn) return;
    const newWord: StoryWord = {
      word: wordInput.trim().split(' ')[0],
      uid: user?.uid || 'user-123',
      timestamp: new Date(),
      index: history.length,
    };
    setHistory([...history, newWord]);
    
    if (participants.length > 1) {
      nextTurn();
    } else {
      setWordInput('');
      setTimeLeft(defaultPace);
    }
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, currentGame?.status]);

  if (currentGame?.status === 'closed') {
    const fullText = history.map(w => w.word).join(' ');
    
    if (isGeneratingTitle) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-6 bg-white h-full">
           <div className="size-20 border-8 border-t-primary border-zinc-100 rounded-full animate-spin"></div>
           <h2 className="text-xl font-black uppercase italic tracking-tighter text-center">IA redactando el título perfecto...</h2>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-white overflow-y-auto no-scrollbar animate-in fade-in zoom-in duration-500 pb-24">
        <div className="relative h-64 border-b-4 border-zinc-900">
           <img src={currentGame.coverImageUrl} className="w-full h-full object-cover" alt="Result" />
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 flex flex-col justify-end p-8">
              <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full w-fit mb-2 border-2 border-zinc-900 shadow-neo-sm uppercase italic">¡Historia Completada!</span>
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-black text-white italic uppercase leading-none drop-shadow-lg">{currentGame.title || settings?.theme || 'Aventura Épica'}</h2>
              </div>
              <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest mt-1 italic">✨ Título sugerido por IA</p>
           </div>
        </div>

        <div className="p-8 space-y-8">
           <div className="bg-zinc-50 p-8 rounded-[2.5rem] border-4 border-zinc-900 shadow-neo relative overflow-hidden">
              <div className="absolute top-4 right-6 opacity-10">
                <span className="material-symbols-outlined text-7xl">format_quote</span>
              </div>
              <p className="text-xl font-medium leading-relaxed text-zinc-800 italic first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:float-left first-letter:mr-2">
                {fullText || "Parece que esta historia quedó en silencio..."}
              </p>
           </div>

           <div className="space-y-4">
              <h3 className="text-center text-[10px] font-black uppercase text-zinc-400 tracking-widest">¿Te gustó el resultado?</h3>
              <VoteButton 
                storyId={currentGame.id} 
                votes={currentGame.totalVotes || 0} 
                disabled={isCreator} 
              />
              {isCreator && (
                <p className="text-center text-[9px] font-bold text-zinc-400 uppercase italic">Eres el autor, no puedes votar tu propia obra.</p>
              )}
           </div>

           <div className="flex gap-4">
              <button 
                onClick={() => setRoute(AppRoute.RANKING)}
                className="flex-1 bg-zinc-900 text-white py-4 rounded-2xl border-2 border-zinc-900 font-black uppercase text-xs shadow-neo-sm active:translate-y-0.5 active:shadow-none"
              >
                Ranking
              </button>
              <button 
                onClick={() => setRoute(AppRoute.HOME)}
                className="flex-1 bg-white text-zinc-900 py-4 rounded-2xl border-2 border-zinc-900 font-black uppercase text-xs shadow-neo-sm active:translate-y-0.5 active:shadow-none"
              >
                Volver a Inicio
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-gray-50 overflow-hidden relative">
      
      {showFinTooltip && (
        <div className="absolute inset-0 z-[60] bg-zinc-900/90 backdrop-blur-sm flex items-center justify-center p-8">
          <div className="bg-white rounded-[2rem] p-8 border-4 border-zinc-900 shadow-neo w-full animate-in zoom-in duration-200">
             <div className="size-16 bg-primary rounded-2xl border-2 border-zinc-900 shadow-neo-sm flex items-center justify-center text-white mb-4">
                <span className="material-symbols-outlined text-3xl">flag</span>
             </div>
             <h4 className="text-2xl font-black italic uppercase mb-2">¿Finalizar historia?</h4>
             <p className="text-xs font-bold text-zinc-500 mb-6 uppercase tracking-tight leading-relaxed">
               Al marcar FIN, la historia se cierra permanentemente y entra en el ranking semanal.
             </p>
             <div className="flex gap-3">
                <button onClick={() => setShowFinTooltip(false)} className="flex-1 py-4 rounded-2xl border-2 border-zinc-900 font-black text-xs uppercase">Cancelar</button>
                <button onClick={confirmFin} className="flex-1 py-4 bg-primary text-white rounded-2xl border-2 border-zinc-900 shadow-neo-sm font-black text-xs uppercase">Sí, Cerrar</button>
             </div>
          </div>
        </div>
      )}

      {/* Portada y Meta-Ayuda */}
      <div className="relative h-28 w-full border-b-4 border-zinc-900">
        <img 
          src={currentGame?.coverImageUrl || 'https://picsum.photos/seed/default/600/400'} 
          className="w-full h-full object-cover" 
          alt="Cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4 justify-between">
          <div className="flex flex-col gap-1">
            <span className="bg-zinc-900 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase w-fit">
              {settings?.theme || 'HISTORIA'}
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">
              {wordsLeft} palabras restantes
            </span>
          </div>
          <button 
            onClick={handleMarcarFin}
            className={`px-4 py-1.5 rounded-full border-2 border-zinc-900 shadow-neo-sm text-[10px] font-black uppercase flex items-center gap-1 transition-all active:translate-y-0.5 active:shadow-none
              ${isCreator ? 'bg-primary text-white' : 'bg-zinc-200 text-zinc-400 opacity-60 cursor-not-allowed'}`}
          >
            Fin
          </button>
        </div>
      </div>

      {/* Cola de Turnos */}
      <div className="bg-white pt-4 pb-2 border-b-2 border-zinc-100 flex justify-center gap-1 overflow-hidden px-4 shrink-0">
        {participants.map((p, i) => {
          const isCurrent = i === turnIndex;
          const isMe = p.uid === (user?.uid || 'user-123');
          return (
            <div key={p.uid} className={`flex flex-col items-center transition-all ${isCurrent ? 'scale-110 opacity-100' : 'scale-90 opacity-40'}`}>
              <div className={`size-12 rounded-full border-2 border-zinc-900 overflow-hidden ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                <img src={p.avatar} className="size-full object-cover" alt={p.displayName} />
              </div>
              <span className="text-[8px] font-black mt-1 uppercase truncate w-14 text-center">{isMe ? 'Tú' : p.displayName}</span>
            </div>
          );
        })}
        {participants.length === 1 && (
           <div className="flex flex-col items-center opacity-30 animate-pulse">
             <div className="size-12 rounded-full border-2 border-dashed border-zinc-400 flex items-center justify-center">
               <span className="material-symbols-outlined text-zinc-400">group_add</span>
             </div>
             <span className="text-[8px] font-black mt-1 uppercase tracking-tighter">Esperando...</span>
           </div>
        )}
      </div>

      {/* Área de Lectura */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]">
        {showToast && (
          <div className="fixed top-44 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white px-6 py-2.5 rounded-full border-2 border-white shadow-2xl flex items-center gap-2 animate-in slide-in-from-top duration-300">
            <span className="text-xs font-black uppercase tracking-tight italic">{showToast}</span>
          </div>
        )}

        {/* Panel de Invitación Estilo Neo-Brutalista */}
        {isSoloCreator && (
          <div className="bg-yellow-300 border-4 border-zinc-900 p-6 rounded-[2rem] shadow-neo mb-6 animate-in zoom-in duration-300">
             <h4 className="text-lg font-black italic uppercase leading-tight mb-2">¡Estás escribiendo solo! 🐿️</h4>
             <p className="text-[10px] font-bold text-zinc-800 uppercase tracking-tight mb-4 leading-relaxed">
               Las mejores historias nacen del caos compartido. Invita a alguien para que el juego sea épico.
             </p>
             <button 
               onClick={handleShareInvite}
               className="w-full bg-mint text-zinc-900 py-4 rounded-2xl border-2 border-zinc-900 shadow-neo-sm font-black text-xs uppercase flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none transition-all"
             >
               <span className="material-symbols-outlined font-black">share</span>
               📱 INVITAR AMIGOS AHORA
             </button>
          </div>
        )}

        <div className="flex flex-wrap gap-x-2 gap-y-3 items-baseline">
          {history.length === 0 && !isSoloCreator && (
             <p className="w-full text-center py-10 opacity-20 font-black uppercase text-xs tracking-[0.2em] italic">Escribe la primera palabra...</p>
          )}
          {history.map((item, idx) => (
            <span key={idx} className={`text-xl font-bold ${item.uid === (user?.uid || 'user-123') ? 'text-primary' : 'text-zinc-900'}`}>
              {item.word}
            </span>
          ))}
        </div>
      </div>

      {/* Input y Micro-Ayudas */}
      <div className="p-4 bg-white border-t-4 border-zinc-900">
        <div className="flex items-center justify-between mb-3 px-1">
           <div className="flex flex-col">
              <h3 className={`text-lg font-black italic leading-none uppercase ${isMyTurn ? 'text-primary' : 'text-zinc-300'}`}>
                 {isMyTurn ? 'TU TURNO' : 'ESPERA...'}
              </h3>
              <p className={`text-[8px] font-black uppercase tracking-widest mt-1 ${isCritical ? 'text-red-500 animate-pulse' : 'text-zinc-400'}`}>
                {participants.length > 1 ? (isCritical ? '¡CORRE! TIEMPO LÍMITE' : `Te quedan ${timeLeft}s`) : 'Escribe sin prisa hasta que alguien entre'}
              </p>
           </div>
           {participants.length > 1 && (
             <div className={`px-4 py-2 rounded-xl border-2 border-zinc-900 font-black flex items-center gap-2 transition-all shadow-neo-sm ${isCritical ? 'bg-red-500 text-white scale-105' : 'bg-yellow-300 text-zinc-900'}`}>
               <span className="material-symbols-outlined text-base font-black">timer</span>
               <span className="text-sm">{timeLeft}s</span>
             </div>
           )}
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input 
              disabled={!isMyTurn}
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value.replace(/\s/g, '').substring(0, 20))}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="w-full h-14 rounded-2xl px-5 font-black border-2 border-zinc-900 shadow-neo-sm disabled:bg-zinc-50 focus:outline-none focus:border-primary"
              placeholder={isMyTurn ? "Escribe 1 palabra..." : "Espera tu turno"}
            />
          </div>
          <button 
            onClick={handleSend}
            disabled={!wordInput.trim() || !isMyTurn}
            className="h-14 px-6 bg-mint rounded-2xl border-2 border-zinc-900 shadow-neo active:translate-y-1 active:shadow-none disabled:opacity-30"
          >
            <span className="material-symbols-outlined font-black">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
