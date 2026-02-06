import React, { useState, useEffect } from 'react';

interface Props {
  personaName: string;
  onReport: () => void;
  t: any;
}

const FeedbackBlock: React.FC<Props> = ({ personaName, onReport, t }) => {
  const [status, setStatus] = useState<'none' | 'liked' | 'disliked' | 'reported'>('none');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleLike = () => {
    window.navigator.vibrate?.(10);
    setStatus('liked');
    setShowToast(true);
  };

  const handleDislike = () => {
    window.navigator.vibrate?.([20, 10, 20]);
    setStatus('disliked');
  };

  const handleReport = () => {
    const reportId = Date.now().toString(36).toUpperCase();
    console.log(`[REPORTED] Content from ${personaName}. Report ID: ${reportId}`);
    window.navigator.vibrate?.([50, 100]);
    setStatus('reported');
    onReport();
  };

  if (status === 'reported') return null;

  return (
    <div className="mt-6 flex flex-col items-center space-y-4 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <button 
          onClick={handleLike}
          className={`w-12 h-12 flex items-center justify-center border transition-all active:scale-90 ${status === 'liked' ? 'bg-green-500 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'border-white/30 text-white/80 hover:text-white hover:border-white/50 bg-white/5'}`}
        >
          👍
        </button>
        <button 
          onClick={handleDislike}
          className={`w-12 h-12 flex items-center justify-center border transition-all active:scale-90 ${status === 'disliked' ? 'bg-red-500 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'border-white/30 text-white/80 hover:text-white hover:border-white/50 bg-white/5'}`}
        >
          👎
        </button>
        <button 
          onClick={handleReport}
          className={`w-12 h-12 flex items-center justify-center border transition-all active:scale-90 border-white/30 text-white/80 hover:text-red-500 hover:border-red-500/50 bg-white/5`}
          title="Report Content"
        >
          🚩
        </button>
      </div>

      <div className="h-6 flex items-center">
        {status === 'liked' && showToast && (
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500 animate-in slide-in-from-bottom-2">
            {t.feedbackThanks}
          </span>
        )}
        {status === 'disliked' && (
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 text-center animate-in slide-in-from-bottom-2">
            {t.feedbackDislike(personaName)}
          </span>
        )}
      </div>

      <p className="text-[9px] font-bold text-center text-white/50 uppercase tracking-widest max-w-[280px] leading-relaxed italic">
        {t.aiDisclaimer}
      </p>
    </div>
  );
};

export default FeedbackBlock;