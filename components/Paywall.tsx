
import React, { useState } from 'react';
import { PersonaId } from '../types';

interface Props {
  personaId?: PersonaId;
  isPro?: boolean;
  onClose: () => void;
  onPurchase: () => void;
  t: any;
}

const Paywall: React.FC<Props> = ({ personaId, isPro, onClose, onPurchase, t }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWaitingForStripe, setIsWaitingForStripe] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const showGuruUnlock = !!personaId && isPro;
  const personaName = personaId ? t.personas[personaId]?.name : '';

  const handleInitialClick = () => {
    setIsProcessing(true);
    window.navigator.vibrate?.([50, 100, 50]);
    
    // Trigger external Stripe
    onPurchase();

    setTimeout(() => {
      setIsProcessing(false);
      setIsWaitingForStripe(true);
    }, 1500);
  };

  const handleVerification = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      window.navigator.vibrate?.([200, 50, 200]);
    }, 1200);
  };

  if (isSuccess) {
    return (
      <div className="modal-overlay !bg-[#FF5C00]">
        <div className="w-full max-w-lg bg-white p-10 sm:p-16 animate-modal relative flex flex-col items-center text-center shadow-[0_0_100px_rgba(255,255,255,0.3)]">
          <div className="mb-12 w-24 h-24 bg-[#FF5C00] flex items-center justify-center text-5xl text-white animate-bounce">
            🔥
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tighter leading-[0.85] text-black mb-8">
            {t.purchaseSuccessTitle}
          </h2>
          
          <div className="h-1 w-20 bg-black/10 mb-8" />
          
          <p className="text-[14px] sm:text-[16px] font-bold text-black/80 leading-relaxed mb-14 max-w-[320px]">
            {t.purchaseSuccessBody}
          </p>

          <button 
            onClick={onClose}
            className="w-full py-6 bg-black text-white font-black uppercase tracking-[0.6em] text-[12px] hover:bg-black/90 transition-all active:scale-95"
          >
            {t.respect}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="absolute inset-0" onClick={!isProcessing ? onClose : undefined} />
      
      <div className="w-full max-w-md bg-black border border-white/30 animate-modal relative overflow-hidden flex flex-col max-h-[92vh]">
        <div className="p-6 sm:p-12 flex flex-col h-full overflow-hidden">
          {isProcessing && (
             <div className="absolute inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center backdrop-blur-sm animate-in fade-in duration-300">
                <div className="w-full h-1 bg-white/10 absolute top-0 overflow-hidden">
                  <div className="h-full bg-[#FF5C00] animate-[loading_1.5s_infinite]" style={{ width: '40%' }} />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.8em] text-[#FF5C00] animate-pulse">PROCESSING</p>
             </div>
          )}

          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5C00]/20 rounded-full blur-3xl -translate-y-6 translate-x-6" />

          {isWaitingForStripe ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 py-10">
               <div className="text-5xl animate-pulse">💳</div>
               <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white/90">
                 {t.waitingPayment}
               </h3>
               <button 
                onClick={handleVerification}
                className="w-full py-7 bg-white text-black font-black uppercase tracking-[0.6em] text-[12px] hover:bg-[#FF5C00] hover:text-white transition-all shadow-xl active:scale-95"
               >
                 {t.verifyPayment}
               </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col items-center text-center py-6">
                <div className="mb-6 w-12 h-12 border-2 border-[#FF5C00] flex items-center justify-center text-2xl shrink-0">
                  {showGuruUnlock ? '💎' : '🔒'}
                </div>
                
                <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter leading-none mb-3">
                  {showGuruUnlock ? personaName : t.paywallTitle}
                </h2>
                
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#FF5C00] mb-2 italic">
                  {t.paywallDesc}
                </p>
                
                {personaId && !isPro && (
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-4 bg-white/5 px-3 py-1 border border-white/10 italic">
                    {t.paywallProRequired}
                  </p>
                )}

                <p className="text-[15px] font-black tracking-widest text-white/100 mb-10">
                  {showGuruUnlock ? t.paywallPriceGuru(personaName) : t.paywallPricePro}
                </p>

                <div className="w-full space-y-5 text-left mb-10">
                  {[t.paywallBenefit1, t.paywallBenefit2, t.paywallBenefit3].map((benefit, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-5 h-5 bg-[#FF5C00] shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-black">✓</div>
                      <p className="text-[12px] font-black uppercase tracking-widest text-white/90 leading-tight">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="shrink-0 space-y-4 pb-2">
                <button 
                  disabled={isProcessing}
                  onClick={handleInitialClick}
                  className="w-full py-6 bg-[#FF5C00] text-white font-black uppercase tracking-[0.4em] text-[12px] hover:bg-[#E04D00] transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
                >
                  {t.unlockBtn}
                </button>
                <button 
                  disabled={isProcessing}
                  onClick={onClose}
                  className="w-full py-3 text-[11px] font-black uppercase tracking-[0.4em] text-white/50 hover:text-white transition-colors italic"
                >
                  {t.close}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default Paywall;
