
import React, { useState } from 'react';
import { useAppState } from '../store';
import { AppRoute } from '../types';

export const Profile: React.FC = () => {
  const { user, setRoute, logout } = useAppState();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  const activeStories = [
    { id: 's1', title: 'La Odisea del Espacio', players: 4, cover: 'https://picsum.photos/seed/space/100' },
    { id: 's2', title: 'Cenas Peligrosas', players: 2, cover: 'https://picsum.photos/seed/dinner/100' }
  ];

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleLogout = () => {
    logout();
  };

  const medals = [
    { label: 'Giro Legendario', emoji: '🌀', progress: 80, val: '8/10 Giros', color: 'from-purple-500 to-indigo-600' },
    { label: 'Escritor Veloz', emoji: '🔥', progress: 45, val: '45/100 Palabras', color: 'from-amber-400 to-red-500' },
    { label: 'Colaborador', emoji: '🤝', progress: 100, val: '¡CONSEGUIDO!', color: 'from-green-400 to-teal-500', done: true },
    { label: 'Mente Brillante', emoji: '🧠', progress: 0, val: 'BLOQUEADO', color: 'from-zinc-200 to-zinc-300', locked: true }
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-32">
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900 text-white px-6 py-3 rounded-2xl border-2 border-white shadow-2xl flex items-center gap-2 animate-in slide-in-from-top">
          <span className="material-symbols-outlined text-mint text-sm">check_circle</span>
          <span className="text-xs font-black uppercase tracking-tight">{showToast}</span>
        </div>
      )}

      <header className="flex flex-col items-center px-6 pt-10 pb-6">
        <div className="relative">
          <div className="size-36 rounded-full bg-gradient-to-tr from-primary via-vibrant-pink to-vibrant-blue p-1 shadow-2xl">
            <div className="size-full rounded-full bg-white border-4 border-white overflow-hidden relative">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${user?.avatar})` }}></div>
            </div>
          </div>
          <div className="absolute -bottom-1 right-0 bg-primary text-white text-xs font-black px-4 py-1.5 rounded-full border-4 border-white shadow-lg">
            Nivel {user?.level}
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <h2 className="text-3xl font-black tracking-tight mb-1">{user?.displayName} {user?.isGuest && '(Invitado)'}</h2>
          <p className="text-primary font-bold tracking-wide uppercase text-[10px]">{user?.bio || 'Arquitecto de Historias'}</p>
        </div>

        <div className="flex gap-3 mt-8 w-full px-6">
          <button 
            onClick={() => setRoute(AppRoute.EDIT_PROFILE)}
            disabled={user?.isGuest}
            className="flex-1 px-4 py-3 bg-zinc-900 text-white text-xs font-black rounded-2xl shadow-neo-sm active:translate-y-0.5 active:shadow-none transition-all uppercase disabled:opacity-50"
          >
            Editar Perfil
          </button>
          <button 
            onClick={() => setRoute(AppRoute.MY_STORIES)}
            className="flex-1 px-4 py-3 bg-mint text-zinc-900 text-xs font-black rounded-2xl border-2 border-zinc-900 shadow-neo-sm active:translate-y-0.5 active:shadow-none transition-all uppercase"
          >
            Mis Historias
          </button>
        </div>
      </header>

      {/* NUEVA SECCIÓN: ENTRENAR CON IA */}
      <section className="px-6 py-4 space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl font-black uppercase tracking-tighter italic">🎯 Entrenar</h3>
        </div>
        <div className="bg-white border-4 border-zinc-900 rounded-[2.5rem] p-6 shadow-neo overflow-hidden relative group">
           <div className="absolute -right-12 -top-12 size-40 bg-mint/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
           <div className="relative z-10">
              <h4 className="text-xl font-black uppercase italic leading-none mb-2">Practicar Solo</h4>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed mb-6 max-w-[200px]">
                Juega contra la IA para mejorar tu fluidez narrativa y ganar monedas extra.
              </p>
              
              <div className="flex items-center gap-6 mb-8">
                 <div className="flex flex-col">
                    <span className="text-lg font-black italic">{user?.practiceStats?.totalPartidas || 0}</span>
                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none mt-1">Sesiones</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-lg font-black italic text-primary">{user?.practiceStats?.mejorRacha || 0}</span>
                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none mt-1">Mejor Racha</span>
                 </div>
              </div>

              <button 
                onClick={() => setRoute(AppRoute.PRACTICE)}
                className="w-full bg-mint text-zinc-900 py-4 rounded-2xl border-2 border-zinc-900 shadow-neo-sm font-black text-xs uppercase flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none transition-all"
              >
                <span className="material-symbols-outlined font-black">smart_toy</span>
                EMPEZAR ENTRENAMIENTO
              </button>
           </div>
        </div>
      </section>

      {/* Comunidad y Cierre Sesión */}
      <section className="px-6 py-4 space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl font-black uppercase tracking-tighter">Comunidad</h3>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <button 
            onClick={() => user?.isGuest ? setRoute(AppRoute.AUTH) : setShowInviteModal(true)}
            className="w-full bg-white p-5 rounded-3xl border-4 border-zinc-900 shadow-neo flex items-center justify-between group active:translate-y-1 active:shadow-none transition-all"
          >
            <div className="text-left">
              <h4 className="text-lg font-black uppercase italic leading-none">Invitar a mi historia</h4>
              <p className="text-[9px] font-bold text-zinc-400 uppercase mt-1 tracking-widest">{user?.isGuest ? 'Regístrate para invitar' : 'Trae a tus amigos a tus partidas'}</p>
            </div>
            <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border-2 border-transparent group-hover:border-primary transition-all">
              <span className="material-symbols-outlined font-black">group_add</span>
            </div>
          </button>

          <button 
            onClick={handleLogout}
            className="w-full bg-red-50 p-4 rounded-2xl border-2 border-red-500 flex items-center justify-center gap-2 group active:translate-y-0.5 transition-all mt-4"
          >
            <span className="material-symbols-outlined text-red-500">logout</span>
            <span className="text-red-500 font-black uppercase text-xs">Cerrar Sesión</span>
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-6 grid grid-cols-3 gap-3">
        {[
          { label: 'Participadas', val: user?.stats.storiesParticipated || 0 },
          { label: 'Monedas', val: user?.coins || 0 },
          { label: 'Top 10', val: user?.stats.topStories || 0 }
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-50 border-2 border-zinc-900 rounded-3xl p-4 flex flex-col items-center justify-center text-center shadow-neo-sm">
            <span className="text-xl font-black italic">{stat.val}</span>
            <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none mt-1">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Achievements placeholder */}
      <section className="px-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black uppercase tracking-tighter">Logros</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {medals.map((m, i) => (
            <div key={i} className={`p-5 rounded-[2rem] flex flex-col items-center border-2 border-zinc-900 shadow-neo-sm relative overflow-hidden transition-all active:scale-95 ${m.locked ? 'opacity-50 bg-zinc-50' : 'bg-white'}`}>
              <div className={`size-14 rounded-2xl bg-gradient-to-br ${m.color} mb-3 flex items-center justify-center text-2xl shadow-lg border-2 border-zinc-900`}>
                {m.locked ? '🔒' : m.emoji}
              </div>
              <h4 className="font-black text-[10px] uppercase mb-1 text-center text-zinc-800 leading-tight">{m.label}</h4>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
