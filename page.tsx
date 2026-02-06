import React, { useState, useEffect } from 'react';
import { 
  ClerkProvider, 
  SignInButton, 
  UserButton, 
  useUser, 
  useAuth 
} from '@clerk/nextjs';

// --- Types & Constants ---
const EMAIL = "buyorbye.help@gmail.com";
const SECRET_PRO_CODE = "DESIGNER2026";

// --- Multi-language Strings ---
const strings = {
  en: {
    title: "Buy or Bye",
    subtitle: "Calculate the real cost of your purchase in hours of your life.",
    inputLabel: "Price of the item",
    hourlyLabel: "Your hourly rate",
    calculate: "Calculate & Roast",
    report: "Report Content",
    reported: "Content hidden and sent for moderation",
    support: "Support",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
    deleteAccount: "Delete Account",
    restore: "Restore Purchases",
    proNeeded: "Login to see the Roast!",
    login: "Sign In",
    timeResult: (h: number, m: number) => `This item costs you ${h}h ${m}m of your life.`
  },
  ru: {
    title: "Buy or Bye",
    subtitle: "Узнай реальную стоимость вещи в часах твоей жизни.",
    inputLabel: "Стоимость товара",
    hourlyLabel: "Твоя ставка в час",
    calculate: "Рассчитать и Прожарить",
    report: "Пожаловаться",
    reported: "Контент скрыт и отправлен на модерацию",
    support: "Поддержка",
    privacy: "Приватность",
    terms: "Правила",
    deleteAccount: "Удалить аккаунт",
    restore: "Восстановить покупки",
    proNeeded: "Войди, чтобы увидеть прожарку!",
    login: "Войти",
    timeResult: (h: number, m: number) => {
      const hStr = h === 1 ? 'час' : (h >= 2 && h <= 4 ? 'часа' : 'часов');
      const mStr = m === 1 ? 'минута' : (m >= 2 && m <= 4 ? 'минуты' : 'минут');
      return `Эта вещь стоит тебе ${h} ${hStr} и ${m} ${mStr} твоей жизни.`;
    }
  }
};

// --- Main Application Component ---
const AppContent = () => {
  const { user } = useUser();
  const { isLoaded, userId } = useAuth();
  const [lang, setLang] = useState<'ru' | 'en'>('ru');
  const [price, setPrice] = useState('');
  const [hourly, setHourly] = useState('');
  const [result, setResult] = useState<{h: number, m: number} | null>(null);
  const [roast, setRoast] = useState<string | null>(null);
  const [isReported, setIsReported] = useState(false);

  const t = strings[lang];

  const handleCalculate = () => {
    // Secret Bypass for testing
    if (price === SECRET_PRO_CODE) {
      alert("Pro Access Granted (Mock)");
      return;
    }

    const p = parseFloat(price);
    const h = parseFloat(hourly);
    if (p > 0 && h > 0) {
      const totalMinutes = (p / h) * 60;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = Math.round(totalMinutes % 60);
      setResult({ h: hours, m: minutes });
      setIsReported(false);
      
      // Roast generation mock (for MVP)
      if (userId) {
        setRoast("О боже, ты серьезно? Эти кроссовки не сделают твою жизнь лучше, они просто съедят твой рабочий вторник. Остановись!");
      } else {
        setRoast(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold tracking-tighter">BUYorBYE</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')} className="text-sm opacity-60">
            {lang.toUpperCase()}
          </button>
          <UserButton afterSignOutUrl="/" />
          {!userId && isLoaded && (
            <SignInButton mode="modal">
              <button className="bg-white text-black px-4 py-1 rounded-full text-sm font-medium">
                {t.login}
              </button>
            </SignInButton>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto space-y-8">
        <div className="text-center">
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        <div className="space-y-4">
          <input 
            type="number" 
            placeholder={t.inputLabel}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-white transition-all"
          />
          <input 
            type="number" 
            placeholder={t.hourlyLabel}
            value={hourly}
            onChange={(e) => setHourly(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-white transition-all"
          />
          <button 
            onClick={handleCalculate}
            className="w-full bg-white text-black p-4 rounded-2xl font-bold hover:bg-zinc-200 transition-colors"
          >
            {t.calculate}
          </button>
        </div>

        {result && (
          <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 animate-in fade-in slide-in-from-bottom-4">
            <p className="text-xl font-medium mb-4">{t.timeResult(result.h, result.m)}</p>
            
            {!userId ? (
              <p className="text-yellow-500 text-sm italic">{t.proNeeded}</p>
            ) : isReported ? (
              <p className="text-red-400 text-sm italic">{t.reported}</p>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-300 border-l-2 border-white pl-4 italic">
                  "{roast}"
                </p>
                <button 
                  onClick={() => setIsReported(true)}
                  className="text-xs opacity-40 hover:opacity-100 flex items-center gap-1"
                  aria-label={t.report}
                >
                  🚩 {t.report}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="mt-20 text-center space-y-4 opacity-40 text-xs">
        <div className="flex justify-center gap-6">
          <a href="#" className="hover:underline">{t.privacy}</a>
          <a href="#" className="hover:underline">{t.terms}</a>
          <a href={`mailto:${EMAIL}`} className="hover:underline">{t.support}</a>
        </div>
        <p>© 2026 Buy or Bye. {EMAIL}</p>
        <p className="max-w-xs mx-auto text-[10px]">AI content. Not financial advice. Designed for financial consciousness.</p>
        {userId && (
          <button onClick={() => alert("Contact support to delete data")} className="text-red-800 hover:text-red-500">
            {t.deleteAccount}
          </button>
        )}
      </footer>
    </div>
  );
};

export default function Root() {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <AppContent />
    </ClerkProvider>
  );
}
