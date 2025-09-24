import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext'; // Assuming useAuth provides user info

// Define the shape of the context
interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  translations: any; // Consider a more specific type
  t: (key: string, options?: any) => string;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth(); // Get user from auth context
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    // Function to load translations for the current language
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${language}.json`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error(`Could not load translations for ${language}`, error);
        // Fallback to English if the desired language fails to load
        if (language !== 'en') {
          setLanguage('en');
        }
      }
    };

    loadTranslations();
  }, [language]);

  useEffect(() => {
    const loadUserLanguage = async () => {
      if (user && user.language) {
        const supportedLanguages = ['en', 'hi', 'fr', 'es', 'de']; // Example supported languages
        if (supportedLanguages.includes(user.language)) {
          setLanguage(user.language);
        } else {
          console.warn(`User language '${user.language}' is not supported. Defaulting to English.`);
          setLanguage('en');
        }
      } else {
        // If no user or user.language, determine language from browser settings
        const browserLang = navigator.language.split('-')[0];
        const supportedLanguages = ['en', 'hi', 'fr', 'es', 'de'];
        if (supportedLanguages.includes(browserLang)) {
          setLanguage(browserLang);
        } else {
          setLanguage('en');
        }
      }
    };

    loadUserLanguage();
  }, [user]);

  // Translation function
  const t = (key: string, options?: any) => {
    const keyParts = key.split('.');
    let translation = translations;
    for (const part of keyParts) {
      if (translation && typeof translation === 'object' && part in translation) {
        translation = translation[part];
      } else {
        return key; // Return the key if translation is not found
      }
    }

    if (typeof translation === 'string' && options) {
      Object.keys(options).forEach(optKey => {
        translation = (translation as string).replace(`{{${optKey}}}`, options[optKey]);
      });
    }

    return typeof translation === 'string' ? translation : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, t }}>
      {children}
    </LanguageContext.Provider>
  );
};