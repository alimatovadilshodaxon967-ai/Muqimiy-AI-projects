'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, AgeGroup } from '@/types';

interface KioskContextType {
  user: UserProfile | null;
  setUserProfile: (name: string, age: number) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearSession: () => void;
  terminalId: string;
  isDemoMode: boolean;
  setDemoMode: (val: boolean) => void;
  language: 'UZ' | 'RU' | 'EN';
  setLanguage: (lang: 'UZ' | 'RU' | 'EN') => void;
  activeDirection: string | null;
  setActiveDirection: (dir: string | null) => void;
  sessionTimeLeft: number;
  resetSessionTimer: () => void;
}

const KioskContext = createContext<KioskContextType | undefined>(undefined);

export function getAgeGroup(age: number): AgeGroup {
  if (age <= 12) return '7-12';
  if (age <= 17) return '13-17';
  if (age <= 24) return '18-24';
  if (age <= 35) return '25-35';
  if (age <= 50) return '36-50';
  return '50+';
}

const DEFAULT_TIMEOUT = 300; // 5 minutes

export const KioskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [terminalId] = useState<string>('Terminal 1');
  const [isDemoMode, setDemoMode] = useState<boolean>(true);
  const [language, setLanguage] = useState<'UZ' | 'RU' | 'EN'>('UZ');
  const [activeDirection, setActiveDirection] = useState<string | null>(null);
  const [sessionTimeLeft, setSessionTimeLeft] = useState<number>(DEFAULT_TIMEOUT);

  const resetSessionTimer = useCallback(() => {
    setSessionTimeLeft(DEFAULT_TIMEOUT);
  }, []);

  const setUserProfile = (name: string, age: number) => {
    const ageGroup = getAgeGroup(age);
    const profile: UserProfile = { name, age, ageGroup };
    setUser(profile);
    resetSessionTimer();
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('aql_user', JSON.stringify(profile));
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('aql_user', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearSession = useCallback(() => {
    setUser(null);
    setActiveDirection(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('aql_user');
      sessionStorage.removeItem('aql_chat_history');
    }
    setSessionTimeLeft(DEFAULT_TIMEOUT);
  }, []);

  // Sync session storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('aql_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  // Timer Countdown
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      setSessionTimeLeft((prev) => {
        if (prev <= 1) {
          clearSession();
          return DEFAULT_TIMEOUT;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [user, clearSession]);

  // Touch listener to reset timer on user interaction
  useEffect(() => {
    const handleTouch = () => {
      resetSessionTimer();
    };
    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('click', handleTouch, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('click', handleTouch);
    };
  }, [resetSessionTimer]);

  return (
    <KioskContext.Provider
      value={{
        user,
        setUserProfile,
        updateProfile,
        clearSession,
        terminalId,
        isDemoMode,
        setDemoMode,
        language,
        setLanguage,
        activeDirection,
        setActiveDirection,
        sessionTimeLeft,
        resetSessionTimer,
      }}
    >
      {children}
    </KioskContext.Provider>
  );
};

export const useKiosk = () => {
  const context = useContext(KioskContext);
  if (!context) {
    throw new Error('useKiosk must be used within KioskProvider');
  }
  return context;
};
