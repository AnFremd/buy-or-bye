import React, { useMemo } from 'react';
import { UserProfile, PersonaId } from '../types';

interface Props {
  profile: UserProfile;
  price: string;
  setPrice: (val: string) => void;
  itemName: string;
  setItemName: (val: string) => void;
  onRoast: (price: number, name: string) => void;
  onPersonaChange: (id: PersonaId) => void;
  onCurrencyChange: (c: any) => void;
  t: any;
  hoursLabel: (val: number) => string;
}

const MainScreen: React.FC<Props> = ({ profile, price, setPrice, itemName, setItemName, onRoast, onPersonaChange, t, hoursLabel }) => {
  const hourlyRate = useMemo(() => {
    const rate = profile.monthlySalary / (Math.max(profile.weeklyHours, 1) * 4.33);
    return rate > 0 ? rate : 1;
  }, [profile]);

  const lifeHours = useMemo(() => {
    const val = parseFloat(price);
    if (isNaN(val) || val <= 0) return 0;
    return val / hourlyRate;
  }, [price, hourlyRate]);

  const personas: { id: PersonaId; icon: string; isBasic?: boolean }[] = [
    { id: 'bro', icon: '🤘', isBasic: true },
    { id: 'sister', icon: '💅', isBasic: true },
    { id: 'ceo', icon: '💼' },
    { id: 'nomad', icon: '🥥' },
    { id: 'mom', icon: '👵' },
    { id: 'crypto', icon: '🚀' }
  ];

  const isRoastUnlockedForCurrent = useMemo(() => {
    if (profile.isPro && (profile.currentPersona === 'bro' || profile.currentPersona === 'sister')) return true;
    return profile.purchasedPersonas.includes(profile.currentPersona);
  }, [profile]);

  const handlePriceChange = (val: string) => {
    const cleanVal = val.replace(/[^0-9.]/g, '');
    if (cleanVal.length < 12) setPrice(cleanVal);
  };

  const isButtonEnabled = lifeHours > 0;

  return (
    <div className="w-full h-full flex flex-col bg-black overflow-hidden relative">
      <div className="w-full max-w-lg mx-auto px-5 sm:px-8 flex flex-col h-full justify-between py-6">
        
        <div className="h-4 sm:h-8 shrink-0" />
        
        <div className="flex-1 flex flex-col justify-center items-center min-h-0">
          <div className="w-full flex flex-col items-center">
            
            <div className="w-full mb-3 sm:mb-6">
              <input 
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder={t.buyingPrompt}
                className="w-full bg-transparent text-center font-black uppercase tracking-[0.5em] outline-none placeholder:text-white/20 focus:text-[#FF5C00] transition-all text-[11px] h-10 border-b border-white/5"
              />
            </div>

            <input 
              type="text"
              value={price}
              onChange={(e) => handlePriceChange(e.target.value)}
              className={`w-full bg-transparent text-center font-black leading-none outline-none tracking-tighter transition-all duration-300 ${price.length > 5 ? 'text-7xl sm:text-8xl' : 'text-8xl sm:text-[120px]'}`}
              placeholder="0"
            />
            
            <div className="mt-10 sm:mt-16 flex flex-col items-center">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 mb-3 italic">{t.lifeDebt}</p>
              <div className="flex flex-col items-center">
                <span className={`font-black text-[#FF5C00] leading-none transition-all duration-300 ${lifeHours > 999 ? 'text-7xl sm:text-8xl' : 'text-8xl sm:text-[110px]'} tracking-tighter`}>
                  {lifeHours.toFixed(1)}
                </span>
                <span className="text-[11px] font-black uppercase tracking-[0.8em] text-white/40 mt-5">{hoursLabel(lifeHours)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full shrink-0 flex flex-col items-center gap-6 sm:gap-8 pb-4 pt-8">
          <div className="flex flex-col items-center gap-4 w-full">
            <span className="text-[#FF5C00] text-[10px] font-black uppercase tracking-[0.5em] opacity-90">
              {t.personas[profile.currentPersona].name}
            </span>
            
            <div className="grid grid-cols-6 gap-2 w-full p-2.5 bg-white/5 rounded-[24px] border border-white/10 shadow-inner">
              {personas.map((p) => {
                const isLocked = !p.isBasic && !profile.purchasedPersonas.includes(p.id);
                const isActive = profile.currentPersona === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onPersonaChange(p.id)}
                    className={`aspect-square flex items-center justify-center rounded-[18px] text-xl xs:text-2xl transition-all duration-300 relative ${isActive ? 'bg-[#FF5C00] grayscale-0 scale-105 shadow-2xl shadow-[#FF5C00]/40' : 'bg-white/5 grayscale opacity-30 hover:opacity-100 hover:bg-white/10'}`}
                  >
                    {p.icon}
                    {isLocked && (
                      <div className="absolute top-1 right-1 text-[10px] leading-none pointer-events-none filter drop-shadow-md">
                        🔒
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <button 
            onClick={() => isButtonEnabled && onRoast(parseFloat(price), itemName || t.unnamed)}
            disabled={!isButtonEnabled}
            className={`w-full py-6 font-black uppercase tracking-[0.6em] text-[12px] transition-all duration-300 flex items-center justify-center gap-4 active:scale-[0.98] rounded-none ${isButtonEnabled ? 'bg-[#FF5C00] text-white hover:bg-[#E04D00] shadow-xl shadow-[#FF5C00]/20' : 'bg-white/5 text-white/10 cursor-not-allowed'}`}
          >
            {!isRoastUnlockedForCurrent && isButtonEnabled && <span className="text-base">🔒</span>}
            {t.roastBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;