"use client";
import React, { useState } from 'react';
import { 
  ClerkProvider, 
  SignInButton, 
  UserButton, 
  useUser, 
  useAuth 
} from '@clerk/nextjs';

const AppContent = () => {
  const { userId } = useAuth();
  const [price, setPrice] = useState('');
  const [hourly, setHourly] = useState('');
  const [result, setResult] = useState<{h: number, m: number} | null>(null);

  const calculate = () => {
    const p = parseFloat(price);
    const h = parseFloat(hourly);
    if (p > 0 && h > 0) {
      const totalMinutes = (p / h) * 60;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = Math.round(totalMinutes % 60);
      setResult({ h: hours, m: minutes });
    }
  };

  const getTimeString = (h: number, m: number) => {
    const hStr = h === 1 ? 'час' : (h >= 2 && h <= 4 ? 'часа' : 'часов');
    const mStr = m === 1 ? 'минута' : (m >= 2 && m <= 4 ? 'минуты' : 'минут');
    return `Эта вещь стоит тебе ${h} ${hStr} и ${m} ${mStr} твоей жизни.`;
  };

  return (
    <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-1px' }}>BUYorBYE</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <UserButton afterSignOutUrl="/" />
          {!userId && (
            <SignInButton mode="modal">
              <button style={{ backgroundColor: 'white', color: 'black', padding: '0.6rem 1.2rem', borderRadius: '30px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                Войти
              </button>
            </SignInButton>
          )}
        </div>
      </header>

      <main style={{ maxWidth: '420px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Узнай реальную стоимость вещи в часах твоей жизни.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="number" placeholder="Стоимость товара" 
            value={price} onChange={(e) => setPrice(e.target.value)}
            style={{ backgroundColor: '#111', border: '1px solid #222', color: 'white', padding: '1.2rem', borderRadius: '16px', fontSize: '1rem', outline: 'none' }}
          />
          <input 
            type="number" placeholder="Твоя ставка в час" 
            value={hourly} onChange={(e) => setHourly(e.target.value)}
            style={{ backgroundColor: '#111', border: '1px solid #222', color: 'white', padding: '1.2rem', borderRadius: '16px', fontSize: '1rem', outline: 'none' }}
          />
          <button 
            onClick={calculate} 
            style={{ backgroundColor: 'white', color: 'black', padding: '1.2rem', borderRadius: '16px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '1.1rem', marginTop: '1rem' }}
          >
            Рассчитать и Прожарить
          </button>
        </div>

        {result && (
          <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#0a0a0a', borderRadius: '24px', border: '1px solid #1a1a1a', textAlign: 'left' }}>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.4', fontWeight: '500' }}>{getTimeString(result.h, result.m)}</p>
            <div style={{ marginTop: '1.5rem', borderLeft: '2px solid white', paddingLeft: '1rem' }}>
              {!userId ? (
                <p style={{ color: '#444', fontStyle: 'italic', fontSize: '0.9rem' }}>Войди, чтобы ИИ прожарил эту покупку.</p>
              ) : (
                <p style={{ color: '#ccc', fontStyle: 'italic' }}>"О боже, ты серьезно? Эти кроссовки не сделают тебя счастливее, они просто съедят твой рабочий вторник. Положи на место!"</p>
              )}
            </div>
          </div>
        )}
      </main>

      <footer style={{ marginTop: '6rem', opacity: '0.3', fontSize: '0.7rem', textAlign: 'center' }}>
        <p>Поддержка: buyorbye.help@gmail.com</p>
        <p style={{ marginTop: '0.5rem' }}>© 2026 Buy or Bye. Не является финансовой рекомендацией.</p>
      </footer>
    </div>
  );
};

export default function Root() {
  return (
    <ClerkProvider publishableKey="pk_test_aGFwcHktYnVsbGRvZy05Ny5jbGVyay5hY2NvdW50cy5kZXYk">
      <AppContent />
    </ClerkProvider>
  );
}
