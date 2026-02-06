
import React from 'react';
import { Calculation } from '../types';

interface Props {
  calculation: Calculation;
  t: any;
}

const ShareCard: React.FC<Props> = ({ calculation, t }) => {
  return (
    <div className="aspect-square w-full bg-white text-black p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-[0_0_120px_rgba(255,92,0,0.15)] border border-black/5">
      {/* Brand Corner */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-black rotate-45 translate-x-14 -translate-y-14 flex items-end justify-center pb-2 z-20">
         <span className="text-white text-[10px] font-black uppercase -rotate-45 tracking-widest italic">
           {t.appTitle === 'Надо или нет?' ? 'Н/Н' : 'B/B'}
         </span>
      </div>
      
      {/* Top Section */}
      <div className="relative z-10 flex flex-col">
        <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-black/40 mb-8 border-b border-black/5 pb-4 italic">{t.auditResult}</h4>
        
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">{t.subject}</p>
          <p className="text-3xl font-black uppercase leading-tight tracking-tighter break-all italic">{calculation.name}</p>
        </div>
        
        <div className="space-y-2 mt-6">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">{t.cost}</p>
          <p className="text-2xl font-black uppercase leading-none tracking-tight">{calculation.price.toLocaleString()} <span className="text-[10px]">{t.units}</span></p>
        </div>
      </div>

      {/* Middle/Result Section */}
      <div className="relative z-10 text-right mt-auto pb-20 sm:pb-24">
        <div className="flex flex-col items-end">
          <p className="text-[100px] sm:text-[120px] font-black leading-[0.7] tracking-tighter italic text-[#FF5C00]">
            {calculation.hoursNeeded.toFixed(1)}
          </p>
          <p className="text-lg font-black uppercase tracking-[0.4em] mt-2 italic">{t.hours} <span className="opacity-40">{t.wasted}</span></p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-6 left-8 right-8 flex justify-between items-center text-[8px] font-black uppercase tracking-[0.6em] opacity-40 italic pointer-events-none z-10">
        <div className="max-w-[150px]">{t.timeRefundable}</div>
        <div className="tracking-[1em]">LC-PRO-SYS</div>
      </div>
    </div>
  );
};

export default ShareCard;
