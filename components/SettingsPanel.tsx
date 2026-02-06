import React, { useState } from 'react';
import { UserProfile, Language } from '../types';
import { useUser } from '@clerk/clerk-react';

interface Props {
  isOpen: boolean; onClose: () => void; profile: UserProfile; onSave: (profile: UserProfile) => void;
  onLogout: () => void; onPaywall: () => void; onTip: () => void; t: any;
}

const SettingsPanel: React.FC<Props> = ({ isOpen, onClose, profile, onSave, onLogout, onPaywall, t }) => {
  const { user } = useUser();
  const [salary, setSalary] = useState(profile.monthlySalary.toString());
  const [hours, setHours] = useState(profile.weeklyHours.toString());
  const [legalView, setLegalView] = useState<'terms' | 'privacy' | null>(null);

  if (!isOpen) return null;

  const handleDeleteAccount = async () => {
    if (confirm(t.deleteConfirm)) {
      try {
        if (user) await user.delete();
        localStorage.clear(); window.location.reload();
      } catch (err) { alert("Deletion failed. Log in again."); }
    }
  };

  const handleSupport = () => { window.location.href = `mailto:buyorbye.help@gmail.com?subject=Support [${profile.language}]`; };

  return (
    <div className="modal-overlay">
      <div className="absolute inset-0 bg-black/95" onClick={onClose} />
      <div className="w-full max-w-lg bg-black border border-white/10 animate-modal relative flex flex-col h-[90dvh] overflow-hidden">
        
        {legalView && (
          <div className="absolute inset-0 z-[110] bg-black p-8 flex flex-col animate-in slide-in-from-right">
            <div className="flex justify-between items-center mb-6">
              <h5 className="text-[12px] font-black tracking-widest text-[#FF5C00] uppercase">{legalView === 'terms' ? t.terms : t.privacy}</h5>
              <button onClick={() => setLegalView(null)} className="text-3xl opacity-60">×</button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar text-[11px] font-mono leading-relaxed text-white/70 whitespace-pre-wrap pb-10">
              {legalView === 'terms' ? t.legalTerms : t.legalPrivacy}
            </div>
            <button onClick={() => setLegalView(null)} className="w-full py-5 border border-white/10 text-[10px] font-black uppercase tracking-widest">{t.close}</button>
          </div>
        )}

        <div className="p-8 flex justify-between items-center border-b border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-widest text-[#FF5C00] uppercase">{t.statusTitle}</span>
            <span className="text-lg font-black italic tracking-tighter uppercase">{profile.isPro ? t.proStatus : t.freeMode}</span>
          </div>
          <button onClick={onClose} className="text-4xl font-light opacity-50">×</button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-12">
          <section className="space-y-8">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black tracking-widest text-white/40 uppercase mb-2 block">{t.monthlyIncome}</label>
                <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full bg-transparent text-5xl font-black outline-none tracking-tighter border-b border-white/10 focus:border-[#FF5C00] transition-colors pb-2" />
              </div>
              <div>
                <label className="text-[10px] font-black tracking-widest text-white/40 uppercase mb-2 block">{t.weeklyHours}</label>
                <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full bg-transparent text-5xl font-black outline-none tracking-tighter border-b border-white/10 focus:border-[#FF5C00] transition-colors pb-2" />
              </div>
            </div>
            <button onClick={() => onSave({ ...profile, monthlySalary: parseFloat(salary), weeklyHours: parseFloat(hours) })} className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-[11px] active:scale-95">{t.saveChanges}</button>
          </section>

          <section className="space-y-8 border-t border-white/5 pt-8">
            <h6 className="text-[10px] font-black tracking-widest text-white/40 uppercase">{t.dangerZone}</h6>
            <div className="flex flex-col gap-6">
              <button onClick={handleSupport} className="w-full py-5 border border-white/10 text-white/80 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3">📧 {t.contactSupport}</button>
              <div className="flex gap-8 opacity-40 px-2">
                <button onClick={() => setLegalView('terms')} className="text-[10px] font-bold uppercase underline underline-offset-4">{t.terms}</button>
                <button onClick={() => setLegalView('privacy')} className="text-[10px] font-bold uppercase underline underline-offset-4">{t.privacy}</button>
              </div>
              <div className="flex flex-col gap-3">
                <button onClick={onLogout} className="text-white hover:text-white/70 font-bold uppercase tracking-widest text-[10px] border-b border-white/10 self-start">{t.resetData}</button>
                <button onClick={handleDeleteAccount} className="text-red-500 hover:text-red-400 font-bold uppercase tracking-widest text-[10px] border-b border-red-500/10 self-start">{t.deleteAccount}</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;