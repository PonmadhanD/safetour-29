import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export type Language = 'en' | 'hi' | 'ta';

export interface Translation {
  [key: string]: string | Translation;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation data
const translations: Record<Language, Translation> = {
  en: {
    // Auth
    signIn: "Sign In",
    signUp: "Sign Up", 
    signOut: "Sign Out",
    email: "Email",
    password: "Password",
    fullName: "Full Name",
    welcome: "Welcome",
    welcomeBack: "Welcome back!",
    // Navigation
    home: "Home",
    map: "Map",
    zones: "Safe Zones",
    routes: "Routes", 
    history: "History",
    settings: "Settings",
    // Dashboard
    safetyScore: "Safety Score",
    quickActions: "Quick Actions",
    panicButton: "Panic Button",
    viewMap: "View Map & Safe Zones",
    familyTracking: "Family Tracking",
    recentAlerts: "Recent Alerts",
    currentLocation: "Current Location",
    recentActivity: "Recent Activity",
    // Map & Navigation
    mapNavigation: "Map & Navigation",
    safeZonesRoutes: "Safe zones and routes",
    startNavigation: "Start Navigation",
    // Safety
    safe: "Safe",
    moderate: "Moderate Risk",
    high: "High Risk",
    emergency: "Emergency",
    // Tourist Attractions
    touristAttractions: "Tourist Attractions",
    nearbyServices: "Nearby Services",
    // Languages
    english: "English",
    hindi: "हिन्दी",
    tamil: "தமிழ்",
    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    back: "Back"
  },
  hi: {
    // Auth
    signIn: "साइन इन करें",
    signUp: "साइन अप करें",
    signOut: "साइन आउट करें", 
    email: "ईमेल",
    password: "पासवर्ड",
    fullName: "पूरा नाम",
    welcome: "स्वागत है",
    welcomeBack: "वापसी पर स्वागत है!",
    // Navigation
    home: "होम",
    map: "मैप",
    zones: "सुरक्षित क्षेत्र",
    routes: "रूट",
    history: "इतिहास",
    settings: "सेटिंग्स",
    // Dashboard
    safetyScore: "सुरक्षा स्कोर",
    quickActions: "त्वरित कार्य",
    panicButton: "पैनिक बटन",
    viewMap: "मैप और सुरक्षित क्षेत्र देखें",
    familyTracking: "पारिवारिक ट्रैकिंग",
    recentAlerts: "हाल की अलर्ट",
    currentLocation: "वर्तमान स्थान",
    recentActivity: "हाल की गतिविधि",
    // Map & Navigation
    mapNavigation: "मैप और नेवीगेशन",
    safeZonesRoutes: "सुरक्षित क्षेत्र और रूट",
    startNavigation: "नेवीगेशन शुरू करें",
    // Safety
    safe: "सुरक्षित",
    moderate: "मध्यम जोखिम",
    high: "उच्च जोखिम", 
    emergency: "आपातकाल",
    // Tourist Attractions
    touristAttractions: "पर्यटक आकर्षण",
    nearbyServices: "निकटतम सेवाएं",
    // Languages
    english: "English",
    hindi: "हिन्दी",
    tamil: "தமிழ்",
    // Common
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफलता",
    cancel: "रद्द करें",
    save: "सेव करें",
    delete: "डिलीट करें",
    edit: "संपादित करें",
    view: "देखें",
    back: "वापस"
  },
  ta: {
    // Auth
    signIn: "உள்நுழைக",
    signUp: "பதிவு செய்க",
    signOut: "வெளியேறு",
    email: "மின்னஞ்சல்",
    password: "கடவுச்சொல்",
    fullName: "முழு பெயர்",
    welcome: "வரவேற்கிறோம்",
    welcomeBack: "மீண்டும் வரவேற்கிறோம்!",
    // Navigation
    home: "முகப்பு",
    map: "வரைபடம்",
    zones: "பாதுகாப்பு மண்டலங்கள்",
    routes: "பாதைகள்",
    history: "வரலாறு",
    settings: "அமைப்புகள்",
    // Dashboard
    safetyScore: "பாதுகாப்பு மதிப்பீடு",
    quickActions: "விரைவு நடவடிக்கைகள்",
    panicButton: "அவசர பொத்தான்",
    viewMap: "வரைபடம் & பாதுகாப்பு மண்டலங்கள்",
    familyTracking: "குடும்ப கண்காணிப்பு",
    recentAlerts: "சமீபத்திய எச்சரிக்கைகள்",
    currentLocation: "தற்போதைய இடம்",
    recentActivity: "சமீபத்திய செயல்பாடு",
    // Map & Navigation
    mapNavigation: "வரைபடம் & வழிசெலுத்தல்",
    safeZonesRoutes: "பாதுகாப்பு மண்டலங்கள் மற்றும் பாதைகள்",
    startNavigation: "வழிசெலுத்தல் தொடங்கு",
    // Safety
    safe: "பாதுகாப்பான",
    moderate: "மிதமான ஆபத்து",
    high: "அதிக ஆபத்து",
    emergency: "அவசரநிலை",
    // Tourist Attractions
    touristAttractions: "சுற்றுலா இடங்கள்",
    nearbyServices: "அருகிலுள்ள சேவைகள்",
    // Languages
    english: "English",
    hindi: "हिन्दी", 
    tamil: "தமிழ்",
    // Common
    loading: "ஏற்றுகிறது...",
    error: "பிழை",
    success: "வெற்றி",
    cancel: "ரத்து செய்",
    save: "சேமி",
    delete: "நீக்கு",
    edit: "திருத்து",
    view: "பார்",
    back: "பின்னோக்கி"
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadUserLanguage = async () => {
      if (user) {
        try {
          const { data } = await supabase
            .from('user_preferences')
            .select('language')
            .eq('user_id', user.id)
            .single();
          
          if (data?.language) {
            setLanguageState(data.language as Language);
          }
        } catch (error) {
          console.error('Error loading user language:', error);
        }
      } else {
        // Load from localStorage for non-authenticated users
        const savedLanguage = localStorage.getItem('preferred_language') as Language;
        if (savedLanguage && ['en', 'hi', 'ta'].includes(savedLanguage)) {
          setLanguageState(savedLanguage);
        }
      }
      setLoading(false);
    };

    loadUserLanguage();
  }, [user]);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    
    if (user) {
      // Update in database
      try {
        const { error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            language: lang,
          }, {
            onConflict: 'user_id'
          });
        
        if (error) {
          console.error('Error updating language preference:', error);
        }
      } catch (error) {
        console.error('Error updating language preference:', error);
      }
    } else {
      // Save to localStorage for non-authenticated users
      localStorage.setItem('preferred_language', lang);
    }
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        break;
      }
    }
    
    if (typeof value !== 'string') {
      // Fallback to English if translation not found
      value = translations.en;
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        } else {
          break;
        }
      }
    }
    
    if (typeof value !== 'string') {
      return key; // Return key if no translation found
    }
    
    // Replace parameters
    if (params) {
      return Object.entries(params).reduce(
        (str, [param, val]) => str.replace(new RegExp(`{{${param}}}`, 'g'), val),
        value
      );
    }
    
    return value;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    loading,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};