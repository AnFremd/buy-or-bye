"use client";
import React from 'react';

export default function Page() {
  return (
    <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900' }}>BUYorBYE</h1>
        <p style={{ opacity: 0.5 }}>Если ты это видишь, значит мы победили 404!</p>
        <button 
          onClick={() => alert('Работает!')}
          style={{ marginTop: '2rem', padding: '1rem 2rem', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Проверить клик
        </button>
      </div>
    </div>
  );
}
