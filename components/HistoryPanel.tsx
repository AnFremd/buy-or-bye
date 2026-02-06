import React from 'react';
import { Calculation } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  history: Calculation[];
  onClear: () => void;
  onOpenEntry: (calc: Calculation) => void;
  t: any;
  hoursLabel: (val: number) => string;
}

const HistoryPanel: React.FC<Props> = ({ isOpen, onClose, history, onClear, onOpenEntry, t, hoursLabel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="w-full max-w-2xl bg-black border border-white/30 animate-modal relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Accent Line */}
        <div className="h-1.5 w-full bg-[#FF5C00] shrink-0" />

        <div className="p-6 sm:p-14 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-start mb-10 shrink-0">
            <div>
              <h5 className="text-[12px] font-black uppercase tracking-[0.6em] text-[#FF5C00] italic">{t.archive}</h5>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70 italic">{t.archiveSub}</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 border border-white/30 flex items-center justify-center text-3xl font-light hover:bg-white hover:text-black transition-all">×</button>
          </div>

          {/* List Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
            {history.length === 0 ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-white/30">
                <span className="text-7xl font-black italic opacity-20">NULL</span>
                <p className="text-[11px] font-black tracking-[1em] uppercase mt-6 text-white/60">{t.debtFree}</p>
              </div>
            ) : (
              history.map((calc) => (
                <div 
                  key={calc.id}
                  className="group flex items-center gap-6 py-8 border-b border-white/10 hover:bg-white/[0.08] transition-all cursor-pointer px-4"
                  onClick={() => onOpenEntry(calc)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black tracking-[0.4em] text-[#FF5C00] mb-3 uppercase opacity-90">{calc.date}</div>
                    <h4 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tighter truncate group-hover:text-[#FF5C00] transition-colors leading-none">
                      {calc.name}
                    </h4>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-4xl sm:text-5xl font-black italic leading-none">{calc.hoursNeeded.toFixed(1)}</div>
                    <div className="text-[10px] font-black tracking-widest text-white/60 mt-2 uppercase">{hoursLabel(calc.hoursNeeded)}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="mt-8 pt-8 border-t border-white/30 flex justify-start items-center shrink-0">
            <button onClick={onClear} className="text-[11px] font-black uppercase tracking-[0.5em] text-white/70 hover:text-red-500 transition-colors italic py-2">{t.clearHistory}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;