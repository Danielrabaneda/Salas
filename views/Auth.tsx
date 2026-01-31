
import React, { useState } from 'react';
import { useAppState } from '../store';
import { AppRoute, User } from '../types';

type AuthView = 'WELCOME' | 'LOGIN' | 'REGISTER';

export const Auth: React.FC = () => {
  const { setUser, setRoute } = useAppState();
  const [view, setView] = useState<AuthView>('WELCOME');
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const getStoredUsers = (): User[] => {
    const users = localStorage.getItem('OWS_USERS');
    return users ? JSON.parse(users) : [];
  };

  const saveUser = (newUser: User) => {
    const users = getStoredUsers();
    users.push(newUser);
    localStorage.setItem('OWS_USERS', JSON.stringify(users));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !email || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError("Formato de email inválido.");
      return;
    }

    const users = getStoredUsers();
    if (users.find(u => u.email === email)) {
      setError("Este email ya está registrado.");
      return;
    }
    if (users.find(u => u.displayName === username)) {
      setError("El nombre de usuario ya está en uso.");
      return;
    }

    const newUser: User = {
      uid: Math.random().toString(36).substr(2, 9),
      email,
      displayName: username,
      password,
      avatar: `https://picsum.photos/seed/${username}/200`,
      level: 1,
      coins: 100,
      isPremium: false,
      votedStories: [],
      notifications: [],
      unreadNotifications: 0,
      segment: 'casual',
      stats: {
        storiesCreated: 0,
        storiesParticipated: 0,
        totalWords: 0,
        topStories: 0,
        themeAffinity: {},
        preferredThemes: []
      },
      notificationSettings: {
        pushEnabled: true,
        dailyPushCount: 0
      },
      lastActiveAt: new Date(),
      achievements: [],
      createdAt: new Date()
    };

    saveUser(newUser);
    setUser(newUser);
    setRoute(AppRoute.EDIT_PROFILE); // Redirigir a configuración inicial
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const users = getStoredUsers();
    const foundUser = users.find(u => 
      (u.email === email || u.displayName === email) && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      setRoute(AppRoute.HOME);
    } else {
      setError("Credenciales incorrectas.");
    }
  };

  const handleGuestMode = () => {
    const guestUser: User = {
      uid: 'guest-' + Math.random().toString(36).substr(2, 5),
      email: 'guest@owstory.app',
      displayName: 'Invitado',
      avatar: 'https://picsum.photos/seed/guest/200',
      level: 1,
      coins: 0,
      isPremium: false,
      isGuest: true,
      votedStories: [],
      notifications: [],
      unreadNotifications: 0,
      segment: 'casual',
      stats: {
        storiesCreated: 0,
        storiesParticipated: 0,
        totalWords: 0,
        topStories: 0,
        themeAffinity: {},
        preferredThemes: []
      },
      notificationSettings: {
        pushEnabled: false,
        dailyPushCount: 0
      },
      lastActiveAt: new Date(),
      achievements: [],
      createdAt: new Date()
    };
    setUser(guestUser);
    setRoute(AppRoute.HOME);
  };

  return (
    <div className="flex flex-col min-h-full items-center justify-center px-8 py-12 animate-in fade-in duration-500">
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="size-24 bg-primary border-4 border-zinc-900 rounded-[2rem] shadow-neo flex items-center justify-center mb-6">
           <span className="material-symbols-outlined text-white text-5xl">edit_note</span>
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900 leading-tight font-fun">Una palabra para la historia</h1>
        <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mt-2">Crea historias épicas juntos</p>
      </div>

      {error && (
        <div className="w-full bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-2xl mb-6 text-xs font-bold uppercase flex items-center gap-2">
           <span className="material-symbols-outlined text-sm">error</span>
           {error}
        </div>
      )}

      {view === 'WELCOME' && (
        <div className="w-full space-y-4">
          <button 
            onClick={() => setView('LOGIN')}
            className="w-full bg-mint text-zinc-900 py-5 rounded-2xl border-4 border-zinc-900 shadow-neo font-black uppercase text-lg active:translate-y-1 active:shadow-none transition-all"
          >
            Iniciar Sesión
          </button>
          <button 
            onClick={() => setView('REGISTER')}
            className="w-full bg-white text-zinc-900 py-5 rounded-2xl border-4 border-zinc-900 shadow-neo font-black uppercase text-lg active:translate-y-1 active:shadow-none transition-all"
          >
            Registrarse
          </button>
          <button 
            onClick={handleGuestMode}
            className="w-full py-4 text-zinc-400 font-black uppercase text-xs hover:text-primary transition-colors"
          >
            Continuar como invitado
          </button>
        </div>
      )}

      {view === 'LOGIN' && (
        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">Email o Usuario</label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 bg-white border-4 border-zinc-900 rounded-2xl px-5 font-bold shadow-neo-sm focus:ring-0" 
              placeholder="pablo@ejemplo.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 bg-white border-4 border-zinc-900 rounded-2xl px-5 font-bold shadow-neo-sm focus:ring-0" 
              placeholder="••••••••"
            />
          </div>
          <button className="w-full bg-primary text-white py-5 rounded-2xl border-4 border-zinc-900 shadow-neo font-black uppercase text-lg active:translate-y-1 active:shadow-none transition-all">
            Entrar
          </button>
          <div className="flex flex-col items-center gap-4 mt-8">
            <button type="button" className="text-[10px] font-black uppercase text-zinc-400">¿Olvidaste la contraseña?</button>
            <button type="button" onClick={() => setView('REGISTER')} className="text-[10px] font-black uppercase text-primary">¿No tienes cuenta? Regístrate</button>
            <button type="button" onClick={() => setView('WELCOME')} className="text-[10px] font-black uppercase text-zinc-400">Volver</button>
          </div>
        </form>
      )}

      {view === 'REGISTER' && (
        <form onSubmit={handleRegister} className="w-full space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">Nombre de Usuario</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-14 bg-white border-4 border-zinc-900 rounded-2xl px-5 font-bold shadow-neo-sm focus:ring-0" 
              placeholder="MagoDePalabras"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 bg-white border-4 border-zinc-900 rounded-2xl px-5 font-bold shadow-neo-sm focus:ring-0" 
              placeholder="tu@email.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 bg-white border-4 border-zinc-900 rounded-2xl px-5 font-bold shadow-neo-sm focus:ring-0" 
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">Confirmar Contraseña</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-14 bg-white border-4 border-zinc-900 rounded-2xl px-5 font-bold shadow-neo-sm focus:ring-0" 
              placeholder="Repite la contraseña"
            />
          </div>
          <button className="w-full bg-primary text-white py-5 rounded-2xl border-4 border-zinc-900 shadow-neo font-black uppercase text-lg active:translate-y-1 active:shadow-none transition-all">
            Crear Cuenta
          </button>
          <div className="flex flex-col items-center gap-4 mt-8">
            <button type="button" onClick={() => setView('LOGIN')} className="text-[10px] font-black uppercase text-primary">¿Ya tienes cuenta? Entra aquí</button>
            <button type="button" onClick={() => setView('WELCOME')} className="text-[10px] font-black uppercase text-zinc-400">Volver</button>
          </div>
        </form>
      )}
    </div>
  );
};
