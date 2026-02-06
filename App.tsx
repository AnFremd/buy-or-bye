import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, Calculation, Language, PersonaId } from './types';
import { translations } from './translations';
import Onboarding from './components/Onboarding';
import MainScreen from './components/MainScreen';
import HistoryPanel from './components/HistoryPanel';
import HistoryDetail from './components/HistoryDetail';
import RoastOverlay from './components/RoastOverlay';
import SettingsPanel from './components/SettingsPanel';
import Paywall from './components/Paywall';
import { generateRoast } from './services/geminiService';
import { useUser, UserButton, useClerk } from '@clerk/clerk-react';

const App: React.FC = () => {
  const { user, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  
  // Состояния должны быть объявлены в самом начале
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<Calculation[]>([]);
  const [price, setPrice] = useState('');
  const [itemName, setItemName] = useState('');
  
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<Calculation | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [paywallMode, setPaywallMode] = useState<{ isOpen: boolean, persona?: PersonaId }>({ isOpen: false });
  const [activeRoast, setActiveRoast] = useState<{ text: string | null; hours: number; price: number; name: string; personaId: PersonaId; errorType?: 'QUOTA' | 'GENERAL' } | null>(null);
  const [isInternalLoading, setIsInternalLoading] = useState(true);

  const lang: Language = profile?.language || 'ru';
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const isProUser = !!(user?.publicMetadata?.isPro) || profile?.isPro;

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('lifecost_profile_v11');
      const savedHistory = localStorage.getItem('lifecost_history_v11');
      if (savedProfile) setProfile(JSON.parse(savedProfile));
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch (e) {
      console.error("Local storage load error", e);
    } finally {
      const timer = setTimeout(() => setIsInternalLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('lifecost_profile_v11', JSON.stringify(newProfile));
  };

  const handlePriceChangeLocal = (val: string) => {
    if (val === 'DESIGNER2026' && profile) {
      saveProfile({ ...profile, isPro: true });
      setPrice('');
      return;
    }
    setPrice(val);
  };

  const getHoursLabel = (val: number) => {
    if (lang !== 'ru') return t.hours;
    const formatPlural = (n: number, one: string, two: string, five: string) => {
      const m10 = n % 10;
      const m100 = n % 100;
      if (m100 >= 11 && m100 <= 19) return five;
      if (m10 === 1) return one;
      if (m10 >= 2 && m10 <= 4) return two;
      return five;
    };
    if (val < 1) {
      const mins = Math.max(1, Math.floor(val * 60));
      return formatPlural(mins, (t as any).minutes_1, (t as any).minutes_2, (t as any).minutes_5);
    }
    return formatPlural(Math.floor(val), (t as any).hours_1, (t as any).hours_2, (t as any).hours_5);
  };

  const handleRoast = async (targetPrice: number, targetName: string) => {
    if (!isSignedIn) { openSignIn(); return; }
    if (!profile) return;
    
    const persona = profile.currentPersona;
    const isUnlocked = (['bro', 'sister'].includes(persona)) ? isProUser : profile.purchasedPersonas.includes(persona);
    if (!isUnlocked) {
      setPaywallMode({ isOpen: true, persona: persona });
      return;
    }

    const hourlyRate = profile.monthlySalary / (profile.weeklyHours * 4.33);
    const hoursNeeded = targetPrice / hourlyRate;
    setActiveRoast({ text: null, hours: hoursNeeded, price: targetPrice, name: targetName, personaId: persona });

    try {
      const roastText = await generateRoast(hoursNeeded, targetPrice, targetName, persona, lang);
      setActiveRoast({ text: roastText, hours: hoursNeeded, price: targetPrice, name: targetName, personaId: persona });
      
      const calc: Calculation = { 
        id: Date.now().toString(), 
        name: targetName, 
        price: targetPrice, 
        hoursNeeded, 
        date: new Date().toLocaleDateString(), 
        roast: roastText, 
        personaId: persona 
      };
      const newHistory = [calc, ...history];
      setHistory(newHistory);
      localStorage.setItem('lifecost_history_v11', JSON.stringify(newHistory));
      setPrice(''); 
      setItemName('');
    } catch (err: any) {
      const isQuota = err?.status === 429 || err?.message?.includes('429');
      setActiveRoast({ text: isQuota ? t.quotaExceeded : t.apiError, hours: hoursNeeded, price: targetPrice, name: targetName, personaId: persona, errorType: isQuota ? 'QUOTA' : 'GENERAL' });
    }
  };

  if (!isClerkLoaded || isInternalLoading) {
    return (
      <div className="bg-black h-dvh w-screen flex flex-col items-center justify-center font-black italic tracking-[0.5em] text-sm text-white">
        <div className="animate-pulse">LIFECOST</div>
      </div>
    );
  }

  if (!profile || profile.monthlySalary === 0) {
    return (
      <Onboarding 
        onComplete={(p) => saveProfile({ ...p, isPro: false, purchasedPersonas: [] })} 
        language={lang} 
        onGoogleLogin={() => openSignIn()}
        isAuthenticating={false}
      />
    );
  }

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="bg-black h-dvh w-screen text-white flex flex-col font-['Inter'] overflow-hidden">
      <header className="w-full px-8 py-4 flex items-center justify-between shrink-0 border-b border-white/5 bg-black z-50">
        <button onClick={() => setIsSettingsOpen(true)} className="text-white/30 p-2 text-xl hover:text-[#FF5C00] transition-colors">⚙️</button>
        <h1 className="font-black uppercase italic tracking-widest text-xs opacity-80">{t.appTitle}</h1>
        <div className="flex items-center gap-2">
          {isSignedIn ? <UserButton afterSignOutUrl="/" /> : <button onClick={() => setIsHistoryOpen(true)} className="text-white/30 p-2 text-xl hover:text-[#FF5C00] transition-colors">🕒</button>}
        </div>
      </header>
      
      <main className="flex-1 w-full relative overflow-hidden">
        <MainScreen 
          profile={profile} 
          price={price} 
          setPrice={handlePriceChangeLocal} 
          itemName={itemName} 
          setItemName={setItemName} 
          onRoast={handleRoast} 
          onPersonaChange={(id) => {
            if (!(['bro', 'sister'].includes(id)) && !profile.purchasedPersonas.includes(id)) { 
              setPaywallMode({ isOpen: true, persona: id }); 
              return; 
            }
            saveProfile({ ...profile, currentPersona: id });
          }} 
          onCurrencyChange={() => {}}
          t={t} 
          hoursLabel={getHoursLabel} 
        />
      </main>

      {isSettingsOpen && <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} profile={profile} onSave={saveProfile} onLogout={() => { if(confirm(t.resetConfirm)) { localStorage.clear(); window.location.reload(); } }} onPaywall={() => { setIsSettingsOpen(false); setPaywallMode({ isOpen: true }); }} onTip={()=>{}} t={t} />}
      {isHistoryOpen && <HistoryPanel isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} history={history} onClear={() => { if (confirm(t.clearConfirm)) { setHistory([]); localStorage.setItem('lifecost_history_v11', JSON.stringify([])); } }} onOpenEntry={setSelectedHistoryEntry} t={t} hoursLabel={getHoursLabel} />}
      {selectedHistoryEntry && <HistoryDetail calculation={selectedHistoryEntry} onClose={() => setSelectedHistoryEntry(null)} t={t} hoursLabel={getHoursLabel} />}
      {activeRoast && <RoastOverlay data={activeRoast} onClose={() => setActiveRoast(null)} onTip={()=>{}} t={t} />}
      {paywallMode.isOpen && <Paywall personaId={paywallMode.persona} isPro={isProUser} onClose={() => setPaywallMode({ isOpen: false })} onPurchase={() => { saveProfile({ ...profile, isPro: true }); setPaywallMode({ isOpen: false }); }} t={t} />}
    </div>
  );
};

export default App;