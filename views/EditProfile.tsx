
import React, { useState, useRef } from 'react';
import { useAppState } from '../store';
import { AppRoute, User } from '../types';
import { STORY_THEMES } from '../constants';

export const EditProfile: React.FC = () => {
  const { user, setUser, setRoute } = useAppState();
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [favTheme, setFavTheme] = useState(user?.stats.preferredThemes[0] || 'humor');
  const [language, setLanguage] = useState(user?.notificationSettings ? 'es' : 'es'); // Simplificado
  const [isPublic, setIsPublic] = useState(user?.isPublic ?? true);
  
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("No se pudo acceder a la cámara.");
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setAvatar(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!displayName.trim()) {
      alert("El nombre de usuario es obligatorio.");
      return;
    }

    if (user) {
      const updatedUser: User = {
        ...user,
        displayName,
        avatar,
        bio,
        isPublic,
        stats: {
          ...user.stats,
          preferredThemes: [favTheme, ...user.stats.preferredThemes.filter(t => t !== favTheme)]
        }
      };
      setUser(updatedUser);
      setRoute(AppRoute.PROFILE);
    }
  };

  return (
    <div className="px-6 py-8 space-y-8 animate-in slide-in-from-right duration-300 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setRoute(AppRoute.PROFILE)} className="size-11 flex items-center justify-center bg-white border-2 border-zinc-900 rounded-full shadow-neo-sm">
            <span className="material-symbols-outlined font-black">arrow_back</span>
          </button>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">Editar Perfil</h2>
        </div>
        <button onClick={() => setRoute(AppRoute.PROFILE)} className="text-zinc-400">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="size-40 rounded-full bg-white border-4 border-zinc-900 shadow-neo overflow-hidden">
            <img src={avatar} className="w-full h-full object-cover" alt="Avatar" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-primary text-white size-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
             <span className="material-symbols-outlined text-xl">photo_camera</span>
          </div>
        </div>

        <div className="flex gap-3 w-full max-w-xs">
          <button 
            onClick={handleStartCamera}
            className="flex-1 bg-zinc-900 text-white py-3 rounded-2xl border-2 border-zinc-900 shadow-neo-sm font-black text-[10px] uppercase flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">camera_alt</span>
            Cámara
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-white text-zinc-900 py-3 rounded-2xl border-2 border-zinc-900 shadow-neo-sm font-black text-[10px] uppercase flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">image</span>
            Galería
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </div>

      {/* Basic Info */}
      <div className="space-y-6">
        <h3 className="text-xs font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">person</span>
          Información Básica
        </h3>
        
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">Nombre de Usuario *</label>
          <input 
            type="text" 
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full h-14 bg-white border-4 border-zinc-900 rounded-2xl px-5 font-bold shadow-neo-sm focus:ring-0" 
            placeholder="pablo_writer"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">Biografía (opcional)</label>
          <textarea 
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value.substring(0, 150))}
            className="w-full bg-white border-4 border-zinc-900 rounded-2xl p-5 font-bold shadow-neo-sm focus:ring-0 resize-none" 
            placeholder="Escritor de historias locas..."
          />
          <p className="text-[8px] font-bold text-zinc-400 uppercase text-right">{bio.length}/150 caracteres</p>
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-6">
        <h3 className="text-xs font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">palette</span>
          Preferencias
        </h3>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">Temática favorita</label>
          <div className="flex flex-wrap gap-2">
            {STORY_THEMES.map(t => (
              <button 
                key={t.id}
                onClick={() => setFavTheme(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 border-zinc-900 text-[10px] font-black uppercase transition-all
                  ${favTheme === t.id ? `${t.color} ${t.text} shadow-neo-sm` : 'bg-white text-zinc-400'}`}
              >
                <span>{t.emoji}</span> {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">Idioma preferido</label>
          <div className="flex p-1 bg-zinc-100 rounded-2xl border-2 border-zinc-900">
            <button 
              onClick={() => setLanguage('es')}
              className={`flex-1 py-2 text-[10px] font-black rounded-xl transition-all uppercase ${language === 'es' ? 'bg-primary text-white shadow-neo-sm border-2 border-zinc-900' : 'text-zinc-500'}`}
            >Español</button>
            <button 
              onClick={() => setLanguage('en')}
              className={`flex-1 py-2 text-[10px] font-black rounded-xl transition-all uppercase ${language === 'en' ? 'bg-primary text-white shadow-neo-sm border-2 border-zinc-900' : 'text-zinc-500'}`}
            >Inglés</button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest px-1">Perfil público</label>
          <div className="space-y-3">
            <button 
              onClick={() => setIsPublic(true)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 border-zinc-900 transition-all ${isPublic ? 'bg-mint text-zinc-900 shadow-neo-sm' : 'bg-white text-zinc-400'}`}
            >
              <span className="text-xs font-black uppercase">Sí, que otros me encuentren</span>
              <span className="material-symbols-outlined">{isPublic ? 'radio_button_checked' : 'radio_button_unchecked'}</span>
            </button>
            <button 
              onClick={() => setIsPublic(false)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 border-zinc-900 transition-all ${!isPublic ? 'bg-zinc-100 text-zinc-900 shadow-neo-sm' : 'bg-white text-zinc-400'}`}
            >
              <span className="text-xs font-black uppercase">No, mantener privado</span>
              <span className="material-symbols-outlined">{!isPublic ? 'radio_button_checked' : 'radio_button_unchecked'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6">
        <button 
          onClick={() => setRoute(AppRoute.PROFILE)}
          className="flex-1 bg-white text-zinc-400 py-5 rounded-[2rem] border-4 border-zinc-900 font-black uppercase text-xs"
        >
          Cancelar
        </button>
        <button 
          onClick={handleSave}
          className="flex-2 bg-primary text-white py-5 rounded-[2rem] border-4 border-zinc-900 shadow-neo font-black uppercase text-xs active:translate-y-1 active:shadow-none"
        >
          Guardar Cambios
        </button>
      </div>

      {/* Camera Modal Overlay */}
      {showCamera && (
        <div className="fixed inset-0 z-[100] bg-zinc-900 flex flex-col items-center justify-center p-6">
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden bg-black">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute inset-x-0 bottom-8 flex justify-center gap-8 items-center">
              <button 
                onClick={stopCamera}
                className="size-14 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center border-2 border-white/40"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <button 
                onClick={capturePhoto}
                className="size-20 bg-white rounded-full border-8 border-primary shadow-xl active:scale-90 transition-transform flex items-center justify-center"
              >
                <div className="size-10 bg-primary rounded-full"></div>
              </button>
              <div className="size-14 invisible"></div>
            </div>
          </div>
          <p className="mt-8 text-white text-[10px] font-black uppercase tracking-[0.2em] italic animate-pulse">
            Encuadra tu sonrisa...
          </p>
        </div>
      )}
    </div>
  );
};
