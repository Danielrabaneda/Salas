
import React from 'react';

export const Store: React.FC = () => {
  return (
    <div className="px-6 space-y-8 mt-4 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase tracking-tighter">Tienda</h2>
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
          <span className="material-symbols-outlined text-primary text-lg fill-1">monetization_on</span>
          <span className="text-sm font-black text-primary">1.240</span>
        </div>
      </div>

      {/* Premium Banner */}
      <section className="bg-white rounded-[2rem] p-7 border-2 border-zinc-100 shadow-sm relative overflow-hidden group">
        <div className="absolute -right-8 -top-8 size-40 bg-primary/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-[9px] font-black uppercase tracking-widest rounded-full mb-3">Suscripción Premium</span>
          <h3 className="text-3xl font-black italic tracking-tighter text-zinc-900 leading-none mb-6">HAZTE LEYENDA</h3>
          
          <ul className="space-y-4 mb-8">
            {['Sin Anuncios', 'Salas Privadas', 'Temas Exclusivos'].map((feat, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm text-primary font-bold">check</span>
                </div>
                <span className="text-sm font-bold text-zinc-600">{feat}</span>
              </li>
            ))}
          </ul>

          <button className="w-full bg-primary py-4 rounded-full text-white font-black text-lg shadow-[0_4px_0_0_#d45959] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2">
            MEJORAR AHORA
            <span className="material-symbols-outlined font-black">arrow_forward</span>
          </button>
          <p className="text-center text-zinc-400 text-[9px] mt-4 font-bold uppercase tracking-widest">4,99 € / mes • Cancela cuando quieras</p>
        </div>
      </section>

      {/* Coin Packs */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-2">
          <h3 className="text-xl font-black">Packs de Monedas</h3>
          <span className="text-primary text-xs font-bold uppercase italic">Ofertas</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: 'Pack Novato', coins: 100, price: '0,99 €', color: 'bg-emerald-50 text-emerald-500', icon: 'potted_plant' },
            { name: 'Escritor Pro', coins: 500, price: '3,99 €', color: 'bg-pink-50 text-pink-500', icon: 'edit_square', popular: true }
          ].map((pack, i) => (
            <div key={i} className={`p-4 rounded-2xl flex flex-col items-center text-center border-2 shadow-sm relative ${pack.popular ? 'bg-white border-primary/30' : 'bg-zinc-50 border-zinc-100'}`}>
              {pack.popular && (
                <div className="absolute -top-px -right-px bg-primary text-white text-[8px] font-black px-2 py-1 rounded-bl-lg uppercase">Popular</div>
              )}
              <div className={`size-16 rounded-full flex items-center justify-center mb-4 ${pack.color} ring-4 ring-white`}>
                <span className="material-symbols-outlined text-3xl fill-1">{pack.icon}</span>
              </div>
              <h4 className="font-bold text-zinc-900 text-sm">{pack.name}</h4>
              <p className="text-zinc-400 text-[10px] font-bold mb-4 uppercase tracking-tighter">{pack.coins} Monedas</p>
              <button className="w-full py-2.5 bg-zinc-900 text-white rounded-full font-black text-xs shadow-[0_2px_0_0_rgba(0,0,0,0.5)] active:translate-y-0.5 active:shadow-none transition-all">
                {pack.price}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
