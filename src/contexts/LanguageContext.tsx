import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  translations: Record<string, any>;
  t: (key: string, options?: any) => string;
  error: string | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const supportedLanguages = ['en', 'hi', 'ta'];

  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);

  // Load translation JSON files
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${language}.json`);
        if (!response.ok) throw new Error(`Failed to load translations for ${language}`);
        const data = await response.json();
        setTranslations(data);
        setError(null);
      } catch (err) {
        console.error(`Could not load translations for ${language}:`, err);
        if (language !== 'en') setLanguage('en');
        setError('Failed to load translations. Using default.');
      }
    };
    loadTranslations();
  }, [language]);

  // Load user's preferred language from Firestore safely
  useEffect(() => {
    const loadUserLanguage = async () => {
      const browserLang = navigator.language.split('-')[0];
      const defaultLang = supportedLanguages.includes(browserLang) ? browserLang : 'en';

      if (!user) {
        setLanguage(defaultLang);
        return;
      }

      try {
        const settingsRef = doc(db, 'user_settings', user.uid);
        const settingsDoc = await getDoc(settingsRef);

        if (settingsDoc.exists() && supportedLanguages.includes(settingsDoc.data()?.language)) {
          setLanguage(settingsDoc.data().language);
        } else {
          setLanguage(defaultLang);
          // Try to save default language, but ignore failures
          try {
            await setDoc(settingsRef, { language: defaultLang }, { merge: true });
          } catch (err: any) {
            console.warn('Could not save default language to Firestore:', err.code, err.message);
          }
        }
        setError(null);
      } catch (err: any) {
        console.warn('Could not access Firestore. Using browser/default language.', err.code, err.message);
        setLanguage(defaultLang);
        setError('Using default language due to Firestore permissions.');
      }
    };

    loadUserLanguage();
  }, [user]);

  const handleSetLanguage = async (newLanguage: string) => {
    if (!supportedLanguages.includes(newLanguage)) {
      setError('Unsupported language selected');
      return;
    }
    setLanguage(newLanguage);

    if (user) {
      try {
        await setDoc(doc(db, 'user_settings', user.uid), { language: newLanguage }, { merge: true });
        setError(null);
      } catch (err: any) {
        console.warn('Could not save language preference to Firestore:', err.code, err.message);
        setError('Failed to save language preference. Changes will only apply locally.');
      }
    }
  };

  const t = (key: string, options?: any) => {
    const keyParts = key.split('.');
    let translation: any = translations;

    for (const part of keyParts) {
      if (translation && typeof translation === 'object' && part in translation) {
        translation = translation[part];
      } else return key;
    }

    if (typeof translation === 'string' && options) {
      Object.keys(options).forEach(optKey => {
        translation = translation.replace(`{{${optKey}}}`, options[optKey]);
      });
    }

    return typeof translation === 'string' ? translation : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, translations, t, error }}>
      {children}
    </LanguageContext.Provider>
  );
};
