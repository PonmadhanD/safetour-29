import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { generateDigitalId, type DigitalIdData } from '@/utils/digitalIdGeneration';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signUpWithDigitalId: (digitalIdData: DigitalIdData) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  createTouristProfile: (userId: string, profileData: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Initial loading state

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true); // Start loading
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error fetching session:', error);
        setUser(null);
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setLoading(true); // Start loading during state change
      setUser(session?.user ?? null);
      setLoading(false); // Stop loading after update
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function signUp(email: string, password: string, fullName: string) {
    setLoading(true); // Start loading
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: { full_name: fullName },
          emailRedirectTo: window.location.origin
        }
      });
      
      if (authError) throw authError;

      if (authData.user) {
        // Insert into custom users table
        const { error: userError } = await supabase
          .from('users')
          .insert({
            user_id: authData.user.id,
            email,
            full_name: fullName,
            role: 'tourist'
          });
        
        if (userError && !userError.message.includes('duplicate key')) {
          throw new Error('Error creating user: ' + userError.message);
        }

        // Create user preferences
        const { error: prefError } = await supabase
          .from('user_preferences')
          .upsert(
            {
              user_id: authData.user.id,
              language: 'en',
              notifications_enabled: true,
              location_sharing: true
            },
            { onConflict: 'user_id' }
          );
        
        if (prefError) throw new Error('Error creating user preferences: ' + prefError.message);
      }

      return authData;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    } finally {
      setLoading(false); // Stop loading
    }
  }

  const signUpWithDigitalId = async (digitalIdData: DigitalIdData) => {
    setLoading(true);
    try {
      const result = await generateDigitalId(digitalIdData);
      return { data: result, error: null };
    } catch (error) {
      console.error('Error creating digital ID:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const createTouristProfile = async (userId: string, profileData: any) => {
    try {
      const { data, error } = await supabase
        .from('tourist_profiles')
        .insert({
          tourist_id: userId,
          full_name: profileData.fullName,
          date_of_birth: profileData.dateOfBirth || null,
          nationality: profileData.nationality || 'Indian',
          passport_no: profileData.passportNo || null,
          govt_id: profileData.govtId || null,
          emergency_contact: profileData.emergencyContact || null,
          digital_id_verified: true
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error creating tourist profile:', error);
      return { data: null, error };
    }
  };
  const signIn = async (email: string, password: string) => {
    setLoading(true); // Start loading
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const signOut = async () => {
    setLoading(true); // Start loading
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signUpWithDigitalId,
    signIn,
    signOut,
    createTouristProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};