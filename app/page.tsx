"use client";
import React, { useState } from 'react';
import { ClerkProvider, SignInButton, UserButton, useUser, useAuth } from '@clerk/nextjs';

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
              <button style={{ backgroundColor: 'white', color: 'black', padding: '0.6rem 1.2rem', borderRadius: '30px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Войти</button>
            </SignInButton>
          )}
        </div>
      </header>
      <main style={{ maxWidth: '420px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="number" placeholder="Стоимость товара" value={price} onChange={(e) => setPrice(e.target.value)} style={{ backgroundColor: '#111', border: '1px solid #222', color: 'white', padding: '1.2rem', borderRadius: '16px', fontSize: '1rem', outline: 'none' }} />
          <input type="number" placeholder="Твоя ставка в час" value={hourly} onChange={(e) => setHourly(e.target.value)} style={{ backgroundColor: '#111', border: '1px solid #222', color: 'white', padding: '1.2rem', borderRadius: '16px', fontSize: '1rem', outline: 'none' }} />
          <button onClick={calculate} style={{ backgroundColor: 'white', color: 'black', padding: '1.2rem', borderRadius: '16px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>Рассчитать</button>
        </div>
        {result && (
          <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#0a0a0a', borderRadius: '24px', border: '1px solid #1a1a1a', textAlign: 'left' }}>
            <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>{getTimeString(result.h, result.m)}</p>
          </div>
        )}
      </main>
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
