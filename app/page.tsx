"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useUser, UserButton, useClerk } from '@clerk/nextjs';

// --- TYPES ---
type Language = 'ru' | 'en' | 'th' | 'zh' | 'hi' | 'ar' | 'fr' | 'it';
type PersonaId = 'bro' | 'sister' | 'ceo' | 'nomad' | 'mom' | 'crypto';

interface UserProfile {
  monthlySalary: number;
  weeklyHours: number;
  language: Language;
  currentPersona: PersonaId;
  isPro: boolean;
  purchasedPersonas: PersonaId[];
}

interface Calculation {
  id: string;
  name: string;
  price: number;
  hoursNeeded: number;
  date: string;
  roast?: string;
  personaId?: PersonaId;
}

// --- TRANSLATIONS ---
const EN = {
  appTitle: 'Buy or Bye?',
  onboardingTitle: 'HOW MUCH IS\nYOUR TIME?',
  onboardingSub: 'Financial Awareness Utility',
  monthlyIncome: 'Monthly Income',
  weeklyHours: 'Work Hours / Week',
  startBtn: 'START CALCULATION',
  buyingPrompt: 'WHAT ARE YOU BUYING?',
  lifeDebt: 'LIFE COST',
  hours: 'HOURS',
  hours_1: 'HOUR',
  hours_2: 'HOURS',
  hours_5: 'HOURS',
  minutes_1: 'MINUTE',
  minutes_2: 'MINUTES',
  minutes_5: 'MINUTES',
  roastBtn: 'ROAST',
  archive: 'ARCHIVE',
  archiveSub: 'Time spending ledger',
  clearHistory: 'Clear',
  debtFree: 'HISTORY EMPTY',
  units: '',
  share: 'SHARE',
  close: 'CLOSE',
  guruVerdict: 'GURU VERDICT',
  respect: 'RESPECT',
  saveChanges: 'SAVE',
  resetData: 'RESET ALL DATA',
  resetConfirm: 'Reset profile?',
  clearConfirm: 'Clear all history?',
  langLabel: 'Language',
  changeLang: 'CHANGE LANGUAGE',
  timeRefundable: 'TIME IS NON-REFUNDABLE',
  subject: 'Subject',
  unnamed: 'UNNAMED',
  thinking: 'GURU IS THINKING...',
  copied: 'Copied to clipboard',
  report: 'REPORT',
  paywallTitle: 'PERSONAS',
  paywallDesc: 'GURU ACCESS',
  paywallPricePro: '$2.99 — Bro & Sister Roasts',
  paywallPriceGuru: (name: string) => `$1.99 — Unlock ${name}`,
  paywallProRequired: 'Unlock Base Access first ($2.99)',
  paywallBenefit1: 'Unlimited purchase audits',
  paywallBenefit2: 'Sharp financial humor',
  paywallBenefit3: 'Dynamic UI skins',
  unlockBtn: 'UNLOCK',
  quotaExceeded: 'GURU IS EXHAUSTED. GIVE HIM A MINUTE.',
  apiError: 'GURU IS MEDITATING. TRY AGAIN LATER.',
  statusTitle: 'ACCESS CONTROL',
  configTitle: 'SETTINGS',
  proStatus: 'LIFETIME PRO',
  freeMode: 'DEMO MODE',
  dangerZone: 'DANGER ZONE',
  contactSupport: 'CONTACT SUPPORT',
  deleteAccount: 'Delete Account',
  deleteConfirm: 'Permanently delete data?',
  aiDisclaimer: 'AI content. Not financial advice.',
  feedbackThanks: 'Thanks!',
  feedbackDislike: (name: string) => `We'll improve ${name}.`,
  feedbackReported: 'THANKS. CONTENT HIDDEN.',
  purchaseSuccessTitle: 'NOW YOU ARE THE BOSS!',
  purchaseSuccessBody: 'Pro mode activated.',
  terms: 'Terms',
  privacy: 'Privacy',
  idLabel: 'ID',
  auditTitle: 'FINANCIAL AUDIT',
  wasted: 'WASTED',
  shareTemplate: (name: string, hours: string, roast: string) => 
    `💀 My purchase "${name}" costs ${hours} hours of my life.\n\n💬 GURU: "${roast}"`,
  personas: {
    bro: { name: 'Bro', icon: '🤘' },
    sister: { name: 'Sister', icon: '💅' },
    ceo: { name: 'CEO', icon: '💼' },
    nomad: { name: 'Nomad', icon: '🥥' },
    mom: { name: 'Mom', icon: '👵' },
    crypto: { name: 'Crypto Bro', icon: '🚀' }
  },
  legalTerms: `1. AI CONTENT: For entertainment only. 2. NO REFUNDS. 3. AS-IS.`,
  legalPrivacy: `1. DATA: LocalStorage + Clerk. 2. COOKIES: Technical only.`
};

const RU = {
  ...EN,
  appTitle: 'Надо или нет?',
  onboardingTitle: 'СКОЛЬКО СТОИТ\nВАШЕ ВРЕМЯ?',
  onboardingSub: 'Утилита финансовой осознанности',
  monthlyIncome: 'Месячный доход',
  weeklyHours: 'Часов в неделю',
  startBtn: 'НАЧАТЬ РАСЧЕТ',
  buyingPrompt: 'ЧТО ПОКУПАЕМ?',
  lifeDebt: 'ЦЕНА ЖИЗНИ',
  hours: 'ЧАСОВ',
  hours_1: 'ЧАС',
  hours_2: 'ЧАСА',
  hours_5: 'ЧАСОВ',
  minutes_1: 'МИНУТА',
  minutes_2: 'МИНУТЫ',
  minutes_5: 'МИНУТ',
  roastBtn: 'ПРОЖАРКА',
  archive: 'АРХИВ',
  archiveSub: 'История трат времени',
  clearHistory: 'Очистить',
  debtFree: 'ИСТОРИЯ ПУСТА',
  share: 'ПОДЕЛИТЬСЯ',
  close: 'ЗАКРЫТЬ',
  guruVerdict: 'ВЕРДИКТ ГУРУ',
  respect: 'ПРИНЯТО',
  saveChanges: 'СОХРАНИТЬ',
  resetData: 'СБРОСИТЬ ВСЕ ДАННЫЕ',
  resetConfirm: 'Сбросить профиль?',
  clearConfirm: 'Удалить всю историю?',
  langLabel: 'Язык',
  changeLang: 'ИЗМЕНИТЬ ЯЗЫК',
  timeRefundable: 'ВРЕМЯ ВОЗВРАТУ НЕ ПОДЛЕЖИТ',
  subject: 'Объект',
  unnamed: 'БЕЗ НАЗВАНИЯ',
  thinking: 'ГУРУ ДУМАЕТ...',
  copied: 'Скопировано',
  report: 'ПОЖАЛОВАТЬСЯ',
  paywallTitle: 'ПЕРСОНАЖИ',
  paywallDesc: 'ДОСТУП К ГУРУ',
  paywallPricePro: '$2.99 — Прожарка от Бро и Систер',
  paywallPriceGuru: (name: string) => `$1.99 — Прожарка от «${name}»`,
  paywallProRequired: 'Сначала разблокируйте базовый доступ ($2.99)',
  paywallBenefit1: 'Безлимитная прожарка покупок',
  paywallBenefit2: 'Острый финансовый юмор',
  paywallBenefit3: 'Смена стиля интерфейса',
  unlockBtn: 'РАЗБЛОКИРОВАТЬ',
  quotaExceeded: 'ГУРУ ПЕРЕУТОМИЛСЯ.',
  apiError: 'ОШИБКА API.',
  statusTitle: 'КОНТРОЛЬ ДОСТУПА',
  configTitle: 'НАСТРОЙКИ',
  proStatus: 'ПОЖИЗНЕННЫЙ PRO',
  freeMode: 'ДЕМО РЕЖИМ',
  dangerZone: 'ОПАСНАЯ ЗОНА',
  contactSupport: 'СВЯЗЬ С ПОДДЕРЖКОЙ',
  deleteAccount: 'Удалить аккаунт',
  deleteConfirm: 'Удалить все данные?',
  aiDisclaimer: 'Контент создан ИИ.',
  feedbackThanks: 'Спасибо!',
  feedbackDislike: (name: string) => `Улучшим ответы ${name}.`,
  feedbackReported: 'КОНТЕНТ СКРЫТ.',
  purchaseSuccessTitle: 'ТЕПЕРЬ ТЫ — БОСС!',
  purchaseSuccessBody: 'Pro-режим активирован.',
  terms: 'Условия',
  privacy: 'Приватность',
  idLabel: 'ID',
  auditTitle: 'ФИНАНСОВЫЙ АУДИТ',
  wasted: 'ПОТРАЧЕНО',
  shareTemplate: (name: string, hours: string, roast: string) => 
    `💀 Моя покупка «${name}» стоит ${hours} ч. моей жизни.\n\n💬 ГУРУ: «${roast}»`,
  personas: {
    bro: { name: 'Бро', icon: '🤘' },
    sister: { name: 'Систер', icon: '💅' },
    ceo: { name: 'CEO', icon: '💼' },
    nomad: { name: 'Номад', icon: '🥥' },
    mom: { name: 'Мама', icon: '👵' },
    crypto: { name: 'Крипто Бро', icon: '🚀' }
  }
};

const translations: Record<Language, typeof EN> = { ru: RU, en: EN, th: EN, zh: EN, hi: EN, ar: EN, fr: EN, it: EN };

// --- GEMINI SERVICE ---
const generateRoast = async (hours: number, price: number, itemName: string, personaId: PersonaId, lang: Language): Promise<string> => {
  // Fixed to use process.env.API_KEY exclusively as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const langNames: Record<Language, string> = { ru: 'RUSSIAN', en: 'ENGLISH', th: 'THAI', zh: 'CHINESE', hi: 'HINDI', ar: 'ARABIC', fr: 'FRENCH', it: 'ITALIAN' };
  const prompt = `Item: "${itemName}". Cost in Hours: ${hours.toFixed(1)}. Brief 1-sentence roast for person: ${personaId}. RESPOND ONLY IN ${langNames[lang]}.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { temperature: 0.9, maxOutputTokens: 100 },
  });
  return response.text.replace(/^"|"$/g, '').trim();
};

// --- SUB-COMPONENTS ---

const Modal: React.FC<{ children: React.ReactNode; onClose: () => void; border?: string }> = ({ children, onClose, border }) => (
  <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
    <div className="absolute inset-0" onClick={onClose} />
    <div className={`w-full max-w-lg bg-black border border-white/10 relative animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh] shadow-2xl`} style={{ borderTop: border ? `4px solid ${border}` : '1px solid rgba(255,255,255,0.1)' }}>
      {children}
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
export default function BuyOrByePage() {
  const { user, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<Calculation[]>([]);
  const [price, setPrice] = useState('');
  const [itemName, setItemName] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<Calculation | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [paywallMode, setPaywallMode] = useState<{ isOpen: boolean, persona?: PersonaId }>({ isOpen: false });
  const [activeRoast, setActiveRoast] = useState<{ text: string | null; hours: number; price: number; name: string; personaId: PersonaId; errorType?: 'QUOTA' | 'GENERAL' } | null>(null);
  const [isReady, setIsReady] = useState(false);

  const lang: Language = profile?.language || 'ru';
  const t = translations[lang];
  const isRtl = lang === 'ar';
  const isProUser = !!(user?.publicMetadata?.isPro) || profile?.isPro;

  useEffect(() => {
    const savedProfile = localStorage.getItem('lifecost_profile_v12');
    const savedHistory = localStorage.getItem('lifecost_history_v12');
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    setIsReady(true);
  }, []);

  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('lifecost_profile_v12', JSON.stringify(newProfile));
  };

  const getHoursLabel = (val: number) => {
    if (lang !== 'ru') return t.hours;
    const formatPlural = (n: number, one: string, two: string, five: string) => {
      const m10 = n % 10; const m100 = n % 100;
      if (m100 >= 11 && m100 <= 19) return five;
      if (m10 === 1) return one;
      if (m10 >= 2 && m10 <= 4) return two;
      return five;
    };
    if (val < 1) return t.minutes_5;
    return formatPlural(Math.floor(val), t.hours_1, t.hours_2, t.hours_5);
  };

  const handleRoast = async (targetPrice: number, targetName: string) => {
    if (!isSignedIn) { openSignIn(); return; }
    if (!profile) return;
    const persona = profile.currentPersona;
    const isUnlocked = ['bro', 'sister'].includes(persona) ? isProUser : profile.purchasedPersonas.includes(persona);
    if (!isUnlocked) { setPaywallMode({ isOpen: true, persona }); return; }

    const hourlyRate = profile.monthlySalary / (profile.weeklyHours * 4.33);
    const hoursNeeded = targetPrice / hourlyRate;
    setActiveRoast({ text: null, hours: hoursNeeded, price: targetPrice, name: targetName, personaId: persona });

    try {
      const roastText = await generateRoast(hoursNeeded, targetPrice, targetName, persona, lang);
      setActiveRoast({ text: roastText, hours: hoursNeeded, price: targetPrice, name: targetName, personaId: persona });
      const calc: Calculation = { id: Date.now().toString(), name: targetName, price: targetPrice, hoursNeeded, date: new Date().toLocaleDateString(), roast: roastText, personaId: persona };
      const newHistory = [calc, ...history];
      setHistory(newHistory);
      localStorage.setItem('lifecost_history_v12', JSON.stringify(newHistory));
      setPrice(''); setItemName('');
    } catch (err) {
      setActiveRoast({ text: t.apiError, hours: hoursNeeded, price: targetPrice, name: targetName, personaId: persona, errorType: 'GENERAL' });
    }
  };

  if (!isClerkLoaded || !isReady) return <div className="bg-black h-screen flex items-center justify-center font-black italic tracking-widest text-white">LIFECOST</div>;

  if (!profile || profile.monthlySalary === 0) {
    return (
      <div className="bg-black h-screen w-screen flex flex-col items-center justify-center p-8 overflow-y-auto">
        <h2 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tighter leading-none mb-10 text-center">{t.onboardingTitle}</h2>
        <form className="w-full max-w-sm space-y-8" onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          saveProfile({ monthlySalary: Number(fd.get('salary')), weeklyHours: Number(fd.get('hours')), language: 'ru', currentPersona: 'bro', isPro: false, purchasedPersonas: [] });
        }}>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2 block">{t.monthlyIncome}</label>
            <input name="salary" type="number" required className="w-full bg-transparent border-b-2 border-white/20 p-4 text-4xl font-black outline-none focus:border-[#FF5C00]" placeholder="0" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2 block">{t.weeklyHours}</label>
            <input name="hours" type="number" required defaultValue="40" className="w-full bg-transparent border-b-2 border-white/20 p-4 text-4xl font-black outline-none focus:border-[#FF5C00]" />
          </div>
          <button type="submit" className="w-full py-6 bg-[#FF5C00] font-black uppercase tracking-[0.5em] text-[12px]">{t.startBtn}</button>
        </form>
      </div>
    );
  }

  const hourlyRate = profile.monthlySalary / (profile.weeklyHours * 4.33);
  const lifeHours = parseFloat(price) / hourlyRate || 0;

  return (
    <div className="bg-black h-screen w-screen text-white flex flex-col font-['Inter'] overflow-hidden selection:bg-[#FF5C00]">
      <header className="px-8 py-5 flex items-center justify-between border-b border-white/5 shrink-0 z-50">
        <button onClick={() => setIsSettingsOpen(true)} className="text-xl opacity-40 hover:opacity-100 transition-opacity">⚙️</button>
        <h1 className="font-black uppercase italic tracking-[0.3em] text-[10px] opacity-60">{t.appTitle}</h1>
        <div className="flex items-center gap-4">
          {isSignedIn ? <UserButton afterSignOutUrl="/" /> : <button onClick={() => setIsHistoryOpen(true)} className="text-xl opacity-40">🕒</button>}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 relative max-w-lg mx-auto w-full">
        <input 
          value={itemName} 
          onChange={(e) => setItemName(e.target.value)} 
          placeholder={t.buyingPrompt} 
          className="w-full bg-transparent text-center font-black uppercase tracking-widest text-[11px] mb-8 outline-none border-b border-white/5 pb-2" 
        />
        <input 
          value={price} 
          onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ''))} 
          className="w-full bg-transparent text-center font-black text-8xl sm:text-9xl outline-none tracking-tighter" 
          placeholder="0" 
        />
        <div className="mt-16 flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/30 mb-2">{t.lifeDebt}</span>
          <span className="text-8xl sm:text-[110px] font-black text-[#FF5C00] tracking-tighter leading-none italic">{lifeHours.toFixed(1)}</span>
          <span className="text-[11px] font-black uppercase tracking-[0.8em] text-white/30 mt-4">{getHoursLabel(lifeHours)}</span>
        </div>
      </main>

      <footer className="p-8 space-y-6 max-w-lg mx-auto w-full shrink-0">
        <div className="flex flex-col items-center gap-4">
          <span className="text-[#FF5C00] text-[9px] font-black uppercase tracking-widest">{t.personas[profile.currentPersona].name}</span>
          <div className="grid grid-cols-6 gap-2 w-full p-2 bg-white/5 rounded-3xl border border-white/10">
            {(['bro', 'sister', 'ceo', 'nomad', 'mom', 'crypto'] as PersonaId[]).map(id => (
              <button key={id} onClick={() => saveProfile({...profile, currentPersona: id})} className={`aspect-square flex items-center justify-center rounded-2xl text-xl transition-all ${profile.currentPersona === id ? 'bg-[#FF5C00] grayscale-0 scale-105' : 'bg-white/5 grayscale opacity-30'}`}>
                {t.personas[id].icon}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => handleRoast(parseFloat(price), itemName || t.unnamed)} disabled={lifeHours <= 0} className={`w-full py-6 font-black uppercase tracking-[0.5em] text-[12px] transition-all ${lifeHours > 0 ? 'bg-[#FF5C00] shadow-xl' : 'bg-white/5 text-white/10'}`}>
          {t.roastBtn}
        </button>
      </footer>

      {isSettingsOpen && (
        <Modal onClose={() => setIsSettingsOpen(false)}>
          <div className="p-10 space-y-12 h-full overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">{t.configTitle}</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="text-3xl opacity-40">×</button>
            </div>
            <div className="space-y-6">
               <div>
                 <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">{t.monthlyIncome}</label>
                 <input type="number" defaultValue={profile.monthlySalary} onBlur={(e) => saveProfile({...profile, monthlySalary: Number(e.target.value)})} className="w-full bg-transparent border-b border-white/10 p-3 text-4xl font-black outline-none" />
               </div>
               <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-red-500 text-[10px] font-black uppercase tracking-widest border-b border-red-500/20 pb-1">{t.resetData}</button>
            </div>
          </div>
        </Modal>
      )}

      {activeRoast && (
        <Modal onClose={() => setActiveRoast(null)} border={activeRoast.errorType ? '#ef4444' : '#FF5C00'}>
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 border border-white/10 flex items-center justify-center text-3xl mb-6">
              {activeRoast.errorType ? '⚠️' : t.personas[activeRoast.personaId].icon}
            </div>
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF5C00] mb-4">{t.guruVerdict}</h5>
            <p className="text-2xl sm:text-3xl font-black uppercase italic leading-tight mb-10">
              {activeRoast.text === null ? t.thinking : `"${activeRoast.text}"`}
            </p>
            <button onClick={() => setActiveRoast(null)} className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-[11px]">{t.close}</button>
          </div>
        </Modal>
      )}

      {paywallMode.isOpen && (
        <Modal onClose={() => setPaywallMode({ isOpen: false })}>
          <div className="p-10 flex flex-col items-center text-center">
            <div className="text-4xl mb-6">🔒</div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">{t.paywallTitle}</h2>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#FF5C00] mb-8">{t.paywallDesc}</p>
            <div className="w-full space-y-4 mb-10 text-left">
              {[t.paywallBenefit1, t.paywallBenefit2, t.paywallBenefit3].map(b => (
                <div key={b} className="flex gap-3 items-center text-[11px] font-black uppercase tracking-widest opacity-80">
                  <span className="text-[#FF5C00]">✓</span> {b}
                </div>
              ))}
            </div>
            <button onClick={() => { saveProfile({...profile, isPro: true}); setPaywallMode({ isOpen: false }); }} className="w-full py-6 bg-[#FF5C00] font-black uppercase tracking-widest text-[12px] shadow-2xl">{t.unlockBtn}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
