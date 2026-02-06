
import React, { useState } from 'react';
import { UserProfile, Language } from '../types';
import { translations } from '../translations';

interface Props {
  onComplete: (profile: UserProfile) => void;
  onGoogleLogin: () => void;
  language: Language;
  isAuthenticating: boolean;
}

const Onboarding: React.FC<Props> = ({ onComplete, onGoogleLogin, language, isAuthenticating }) => {
  const [lang, setLang] = useState<Language>(language);
  const [showLangGrid, setShowLangGrid] = useState(false);
  const [salary, setSalary] = useState('');
  const [hours, setHours] = useState('40');
  const [legalView, setLegalView] = useState<'terms' | 'privacy' | null>(null);

  const t = translations[lang];
  const isRtl = lang === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (salary && hours) {
      onComplete({
        monthlySalary: parseFloat(salary),
        weeklyHours: parseFloat(hours),
        language: lang,
        currentPersona: 'bro',
        isPro: false,
        purchasedPersonas: []
      });
    }
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'ru', label: 'РУССКИЙ' },
    { code: 'en', label: 'ENGLISH' },
    { code: 'fr', label: 'FRANÇAIS' },
    { code: 'it', label: 'ITALIANO' },
    { code: 'th', label: 'ไทย' },
    { code: 'zh', label: '中文' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'ar', label: 'العربية' }
  ];

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'} 
      className="bg-black h-screen w-screen flex flex-col items-center selection:bg-[#FF5C00] overflow-hidden relative"
    >
      {/* Legal Content Overlay */}
      {legalView && (
        <div className="fixed inset-0 z-[110] bg-black p-8 sm:p-12 flex flex-col animate-in slide-in-from-right duration-500">
          <div className="flex justify-between items-center mb-10">
            <h5 className="text-[12px] font-black uppercase tracking-[0.5em] text-[#FF5C00]">
              {legalView === 'terms' ? t.terms : t.privacy}
            </h5>
            <button 
              onClick={() => setLegalView(null)} 
              className="w-12 h-12 flex items-center justify-center text-4xl font-light opacity-60 hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
            <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-white/80 tracking-tight">
              {legalView === 'terms' ? t.legalTerms : t.legalPrivacy}
            </pre>
          </div>
          <button 
            onClick={() => setLegalView(null)}
            className="w-full py-6 border border-white/20 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all mt-4"
          >
            {t.close}
          </button>
        </div>
      )}

      {/* Main Content Area - Scrollable */}
      <div className="w-full h-full overflow-y-auto custom-scrollbar flex flex-col items-center">
        <div className="w-full max-w-sm flex flex-col items-center p-6 min-h-full">
          
          {/* Language Selection Trigger */}
          {!showLangGrid ? (
            <button 
              onClick={() => setShowLangGrid(true)}
              className="mt-8 mb-12 text-[12px] font-black uppercase tracking-[0.5em] text-white/70 hover:text-[#FF5C00] transition-colors py-3 border-b border-white/20"
            >
              {lang.toUpperCase()} • {t.changeLang}
            </button>
          ) : (
            <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center p-10 animate-in fade-in duration-300">
               <div className="w-full max-w-xs space-y-12">
                 <div className="text-center">
                   <h3 className="text-[12px] font-black uppercase tracking-[0.8em] text-[#FF5C00] mb-4">{t.langLabel}</h3>
                   <div className="h-0.5 w-16 bg-[#FF5C00] mx-auto" />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                   {languages.map((l) => (
                     <button 
                       key={l.code}
                       onClick={() => { setLang(l.code); setShowLangGrid(false); }} 
                       className={`py-7 border font-black tracking-[0.2em] text-[11px] uppercase transition-all flex flex-col items-center gap-1.5 ${lang === l.code ? 'border-[#FF5C00] text-[#FF5C00] bg-[#FF5C00]/10' : 'border-white/20 text-white/60 hover:text-white hover:border-white/40'}`}
                     >
                       <span className="opacity-70 text-[8px]">{l.code.toUpperCase()}</span>
                       {l.label}
                     </button>
                   ))}
                 </div>
                 <button 
                  onClick={() => setShowLangGrid(false)} 
                  className="w-full py-5 text-[11px] font-black text-white/60 uppercase tracking-[0.6em] hover:text-white transition-colors"
                 >
                   {t.close}
                 </button>
               </div>
            </div>
          )}

          <div className="mb-12 text-center shrink-0 animate-in slide-in-from-top duration-700">
            <h2 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tighter leading-[0.9] mb-5 whitespace-pre-line">
              {t.onboardingTitle}
            </h2>
            <p className="text-[12px] font-black uppercase tracking-[0.6em] text-white/70 italic">{t.onboardingSub}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="w-full space-y-12 shrink-0 animate-in fade-in duration-1000">
            <div className="group text-left border-b-2 border-white/20 focus-within:border-[#FF5C00] transition-all pb-3">
              <label className="block text-[12px] font-black uppercase tracking-[0.4em] text-white/70 mb-3 group-focus-within:text-[#FF5C00] transition-colors italic">{t.monthlyIncome}</label>
              <input 
                autoFocus
                type="number" 
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full bg-transparent text-center text-5xl font-black outline-none placeholder:text-white/20 tracking-tighter text-white"
                placeholder="000"
                required
              />
            </div>

            <div className="group text-left border-b-2 border-white/20 focus-within:border-[#FF5C00] transition-all pb-3">
              <label className="block text-[12px] font-black uppercase tracking-[0.4em] text-white/70 mb-3 group-focus-within:text-[#FF5C00] transition-colors italic">{t.weeklyHours}</label>
              <input 
                type="number" 
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full bg-transparent text-center text-5xl font-black outline-none placeholder:text-white/20 tracking-tighter text-white"
                placeholder="40"
                required
              />
            </div>

            <div className="flex flex-col gap-4 pt-6">
              <button 
                type="submit"
                className="w-full bg-[#FF5C00] text-white py-6 font-black uppercase tracking-[0.5em] text-[13px] hover:bg-[#E04D00] transition-all active:scale-95 shadow-2xl shadow-[#FF5C00]/30"
              >
                {t.startBtn}
              </button>
            </div>
          </form>

          {/* Legal Footer Links */}
          <footer className="mt-auto pt-12 pb-8 flex gap-8 animate-in fade-in duration-1000 delay-500">
            <button 
              onClick={() => setLegalView('terms')}
              className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 hover:text-white transition-colors border-b border-transparent hover:border-white/40 pb-1 italic"
            >
              {t.terms}
            </button>
            <button 
              onClick={() => setLegalView('privacy')}
              className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 hover:text-white transition-colors border-b border-transparent hover:border-white/40 pb-1 italic"
            >
              {t.privacy}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
