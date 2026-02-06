
import React, { useEffect } from 'react';

interface Props {
  tier: 'shake' | 'coffee' | 'tomyam';
  onClose: () => void;
  t: any;
}

const AppreciationModal: React.FC<Props> = ({ tier, onClose, t }) => {
  const themes = {
    shake: {
      bg: 'bg-[#FFD700]',
      accent: 'text-[#FF5C00]',
      icon: '🥭',
      title: t.thanksShake,
      sub: t.thanksSub,
      animation: 'animate-bounce'
    },
    coffee: {
      bg: 'bg-[#F5F5DC]',
      accent: 'text-[#4B3621]',
      icon: '☕️',
      title: t.thanksCoffee,
      sub: t.thanksSub,
      animation: 'animate-pulse'
    },
    tomyam: {
      bg: 'bg-[#FF4500]',
      accent: 'text-white',
      icon: '🍲',
      title: t.thanksTomYam,
      sub: t.thanksSub,
      animation: 'animate-[spin_4s_linear_infinite]'
    }
  };

  const theme = themes[tier];

  useEffect(() => {
    window.navigator.vibrate?.([100, 50, 100]);
  }, []);

  return (
    <div className="modal-overlay !p-0 !bg-black/90">
      <div 
        className={`w-full h-full flex flex-col items-center justify-center p-10 text-center animate-in zoom-in duration-500 ${theme.bg}`}
        onClick={onClose}
      >
        <div className={`text-[120px] sm:text-[180px] mb-12 drop-shadow-2xl ${theme.animation}`}>
          {theme.icon}
        </div>
        
        <h2 className={`text-5xl sm:text-7xl font-black uppercase italic tracking-tighter leading-[0.85] mb-8 ${theme.accent}`}>
          {theme.title}
        </h2>
        
        <div className={`h-1 w-24 mb-10 opacity-30 ${theme.accent === 'text-white' ? 'bg-white' : 'bg-black'}`} />
        
        <p className={`text-[15px] font-bold uppercase tracking-widest max-w-[280px] leading-relaxed mb-16 ${theme.accent}`}>
          {theme.sub}
        </p>

        <button 
          onClick={onClose}
          className={`px-12 py-6 font-black uppercase tracking-[0.6em] text-[12px] border-4 transition-all active:scale-95 ${theme.accent === 'text-white' ? 'border-white text-white hover:bg-white hover:text-[#FF4500]' : 'border-black text-black hover:bg-black hover:text-white'}`}
        >
          {t.respect}
        </button>

        {/* Thematic Particles - Simplified */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <div className="absolute top-10 left-10 text-4xl rotate-12">{theme.icon}</div>
          <div className="absolute bottom-20 right-10 text-5xl -rotate-12">{theme.icon}</div>
          <div className="absolute top-1/2 right-1/4 text-3xl rotate-45">{theme.icon}</div>
        </div>
      </div>
    </div>
  );
};

export default AppreciationModal;
