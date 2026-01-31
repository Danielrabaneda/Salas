
import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../store';
import { AppNotification, AppRoute } from '../types';

export const NotificationBell: React.FC = () => {
  const [showPanel, setShowPanel] = useState(false);
  const { user, markAsRead, markAllAsRead, setRoute, deleteNotification } = useAppState();
  const panelRef = useRef<HTMLDivElement>(null);

  const hasUnread = (user?.unreadNotifications || 0) > 0;

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowPanel(false);
      }
    };
    if (showPanel) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPanel]);

  const handleNotificationClick = (notif: AppNotification) => {
    markAsRead(notif.id);
    if (notif.actionUrl) {
      setRoute(notif.actionUrl);
    }
    setShowPanel(false);
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (diff < 1) return 'Ahora';
    if (diff < 60) return `${diff} min`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return d.toLocaleDateString();
  };

  return (
    <div className="relative" ref={panelRef}>
      <button 
        onClick={() => setShowPanel(!showPanel)}
        className={`size-11 flex items-center justify-center bg-white rounded-full border-2 border-zinc-900 shadow-neo-sm relative transition-all active:translate-y-0.5 active:shadow-none
          ${hasUnread ? 'text-red-500' : 'text-zinc-900'}`}
      >
        <span className={`material-symbols-outlined text-xl ${hasUnread ? 'bell-notification' : ''}`}>
          notifications
        </span>
        {hasUnread && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-full size-5 flex items-center justify-center border-2 border-white animate-in zoom-in">
            {user?.unreadNotifications}
          </span>
        )}
      </button>

      {showPanel && (
        <div className="absolute right-0 top-14 w-80 md:w-96 bg-white rounded-[2rem] border-4 border-zinc-900 shadow-neo z-[100] animate-in slide-in-from-top-4 duration-200 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b-2 border-zinc-100 bg-zinc-50">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-zinc-400">mail</span>
              Notificaciones
            </h3>
            <div className="flex items-center gap-2">
              {hasUnread && (
                <button 
                  onClick={markAllAsRead}
                  className="text-[9px] font-black text-primary uppercase underline"
                >
                  Marcar todas
                </button>
              )}
              <button onClick={() => setShowPanel(false)} className="material-symbols-outlined text-zinc-400 text-xl">
                close
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto no-scrollbar">
            {user?.notifications && user.notifications.length > 0 ? (
              user.notifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-5 flex gap-4 items-start border-b border-zinc-100 transition-colors cursor-pointer relative group
                    ${notif.read ? 'bg-white opacity-60' : 'bg-white'}`}
                >
                  {!notif.read && (
                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 size-1.5 bg-primary rounded-full"></div>
                  )}
                  <div className="size-10 shrink-0 bg-zinc-50 rounded-xl border-2 border-zinc-900 flex items-center justify-center text-xl shadow-neo-sm group-active:translate-y-0.5">
                    {notif.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="font-black text-[11px] uppercase truncate tracking-tight text-zinc-900">
                        {notif.title}
                      </h4>
                      <span className="text-[8px] font-bold text-zinc-400 uppercase shrink-0">
                        {formatTime(notif.timestamp)}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-zinc-500 leading-snug">
                      {notif.message}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {notif.type === 'invitation' && (
                        <>
                          <button className="px-3 py-1 bg-mint text-zinc-900 border border-zinc-900 rounded-lg text-[8px] font-black uppercase shadow-neo-sm">Aceptar</button>
                          <button className="px-3 py-1 bg-white text-zinc-400 border border-zinc-200 rounded-lg text-[8px] font-black uppercase">Rechazar</button>
                        </>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-300 hover:text-red-500 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="py-16 text-center flex flex-col items-center opacity-20 grayscale">
                <span className="material-symbols-outlined text-5xl mb-2">notifications_off</span>
                <p className="font-black uppercase text-[10px] tracking-widest">Nada nuevo por aquí</p>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-zinc-50 border-t-2 border-zinc-100">
             <button className="w-full text-center text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-900 transition-colors">
               Ver historial completo
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
