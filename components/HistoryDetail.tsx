import React from 'react';
import { Calculation } from '../types';

interface Props {
  calculation: Calculation;
  onClose: () => void;
  t: any;
  hoursLabel: (val: number) => string;
}

const HistoryDetail: React.FC<Props> = ({ calculation, onClose, t, hoursLabel }) => {
  const handleShare = () => {
    const shareText = t.shareTemplate(calculation.name, calculation.hoursNeeded.toFixed(1), calculation.roast || "...");
    if (navigator.share) {
      navigator.share({ title: 'LifeCost', text: shareText }).catch(() => {
        navigator.clipboard.writeText(shareText);
        alert(t.copied);
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert(t.copied);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="absolute inset-0 bg-black/95 animate-backdrop" onClick={onClose} />
      
      <div className="w-full max-w-xl bg-black border border-white/10 p-6 sm:p-12 animate-modal relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#FF5C00]" />
        
        <div className="flex justify-between items-start mb-8 shrink-0">
          <div className="space-y-1">
            <h5 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#FF5C00] italic">{t.auditTitle}</h5>
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40 italic">{t.idLabel}: {calculation.id.slice(-6)}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 border border-white/10 flex items-center justify-center text-2xl font-light hover:bg-white hover:text-black transition-all">×</button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <div className="mb-10">
            <span className="text-[9px] font-black uppercase tracking-[0.6em] text-white/30 mb-3 block italic">{t.subject}:</span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter leading-[0.9] break-words">
              {calculation.name}
            </h2>
          </div>

          <div className="mb-12 relative">
            <p className="text-[9px] font-black uppercase tracking-[0.6em] text-white/30 mb-4 italic">{t.lifeDebt}:</p>
            <div className="flex items-end gap-3 flex-wrap">
              <span className={`font-black text-[#FF5C00] leading-[0.75] tracking-tighter italic ${calculation.hoursNeeded > 99 ? 'text-[60px] sm:text-[100px]' : 'text-[80px] sm:text-[120px]'}`}>
                {calculation.hoursNeeded.toFixed(1)}
              </span>
              <span className="text-base font-black uppercase tracking-[0.4em] italic text-white/40 mb-2">{hoursLabel(calculation.hoursNeeded)}</span>
            </div>
          </div>

          {calculation.roast && (
            <div className="mb-12 py-4 border-l-4 border-[#FF5C00] pl-8 bg-transparent">
              <p className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter leading-[1.2] text-white/100">
                "{calculation.roast}"
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-8 border-t border-white/10 flex shrink-0">
          <button onClick={handleShare} className="w-full py-5 bg-[#FF5C00] text-white font-black uppercase tracking-[0.5em] text-[10px] hover:bg-[#E04D00] transition-all active:scale-95 flex items-center justify-center gap-3">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            {t.share}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetail;