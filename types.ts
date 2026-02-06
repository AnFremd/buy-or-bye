
export type Language = 'ru' | 'en' | 'th' | 'zh' | 'hi' | 'ar' | 'fr' | 'it';

export type PersonaId = 'bro' | 'sister' | 'ceo' | 'nomad' | 'mom' | 'crypto';

export interface UserProfile {
  monthlySalary: number;
  weeklyHours: number;
  language: Language;
  currentPersona: PersonaId;
  isPro: boolean; // Unlocks Roast for Bro & Sister ($2.99)
  purchasedPersonas: PersonaId[]; // Unlocks specific gurus ($1.99 each)
  email?: string;
}

export interface Calculation {
  id: string;
  name: string;
  price: number;
  hoursNeeded: number;
  date: string;
  roast?: string;
  personaId?: PersonaId;
}
