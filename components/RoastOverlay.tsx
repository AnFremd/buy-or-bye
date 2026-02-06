import React, { useState } from 'react';
import { PersonaId } from '../types';
import FeedbackBlock from './FeedbackBlock';

interface Props {
  data: { text: string | null; hours: number; price: number; name: string; personaId: PersonaId; errorType?: 'QUOTA' | 'GENERAL' };
  onClose: () => void;
  onTip: (tier: any) => void;
  t: any;
}

const RoastOverlay: React.FC<Props> = ({ data, onClose, t }) => {
  const [isReported, setIsReported] = useState(false);
  const isLoading = data.text === null;
  const isError = !!data.errorType;

  const themes: Record<PersonaId | 'free', { color: string; font: string }> = {
    bro: { color: '#FF5C00', font: 'font-black italic uppercase tracking-tighter' },
    sister: { color: '#FF4EAB', font: 'font-serif italic font-black' },
    ceo: { color: '#FFFFFF', font: 'font-mono uppercase font-bold' },
    nomad: { color: '#00FFC2', font: 'font-serif italic font-bold' },
    mom: { color: '#FFD700', font: 'font-sans font-black uppercase' },
    crypto: { color: '#00FF41', font: 'font-mono uppercase font-black' },
    free: { color: '#FF5C00', font: 'font-sans font-black italic uppercase' }
  };

  const theme = themes[data.personaId] || themes.free;
  const personaName = t.personas[data.personaId]?.name || t.unnamed;

  return (
    <div className="modal-overlay">
      <div className="absolute inset-0 bg-black/90" onClick={onClose} />
      <div className="w-full max-w-lg bg-black border border-white/10 animate-modal relative flex flex-col max-h-[90dvh] overflow-hidden shadow-2xl" style={{ borderTop: `4px solid ${isError ? '#ef4444' : (isReported ? '#333' : theme.color)}` }}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-xl shrink-0" style={{ borderColor: isError ? '#ef4444' : (isReported ? '#333' : theme.color) }}>
                {isError ? '⚠️' : (isReported ? '🚩' : t.personas[data.personaId]?.icon)}
              </div>
              <div>
                <h5 className="text-[9px] font-black uppercase tracking-[0.4em]" style={{ color: isError ? '#ef4444' : (isReported ? '#666' : theme.color) }}>
                  {isReported ? t.report : t.guruVerdict}
                </h5>
                <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">{personaName}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/30 hover:text-white p-2 text-2xl">×</button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 mb-4">
            <div className="min-h-[120px] flex flex-col justify-center">
              {isLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-0.5 w-full bg-white/5" />
                  <div className="h-0.5 w-2/3 bg-white/5" />
                  <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">{t.thinking}</p>
                </div>
              ) : isReported ? (
                <div className="text-center py-6 animate-in fade-in">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-white/60 leading-relaxed italic px-4">
                    {t.feedbackReported}
                  </p>
                </div>
              ) : (
                <p className={`text-2xl sm:text-3xl leading-tight ${isError ? 'text-red-500 font-bold' : 'text-white ' + theme.font}`}>
                  {isError ? data.text : `"${data.text}"`}
                </p>
              )}
            </div>
            {!isLoading && !isError && !isReported && <FeedbackBlock personaName={personaName} onReport={() => setIsReported(true)} t={t} />}
          </div>

          {!isLoading && (
            <div className="shrink-0 border-t border-white/5 pt-4">
              <button onClick={onClose} className="w-full py-4 bg-white text-black font-black text-[11px] uppercase tracking-[0.5em] active:scale-95">{t.close}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoastOverlay;