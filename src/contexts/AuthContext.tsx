import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { generateDigitalId, type DigitalIdData } from '@/utils/digitalIdGeneration';
import { Database } from '@/types/supabase';

type TouristProfile = Database['public']['Tables']['tourist_profiles']['Row'];

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ data: any; error: any }>;
  signUpWithDigitalId: (digitalIdData: DigitalIdData) => Promise<{ data: any; error: any }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  createTouristProfile: (userId: string, profileData: any) => Promise<{ data: any; error: any }>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error fetching session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setLoading(true);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function signUp(email: string, password: string, fullName: string) {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: window.location.origin,
        },
      });

      if (authError) {
        return { data: null, error: authError };
      }

      if (authData.user) {
        const { error: userError } = await supabase
          .from('users')
          .insert({
            user_id: authData.user.id,
            email,
            full_name: fullName,
            role: 'tourist',
          });

        if (userError && !userError.message.includes('duplicate key')) {
          return { data: null, error: new Error('Error creating user: ' + userError.message) };
        }

        const { error: prefError } = await supabase
          .from('user_preferences')
          .upsert(
            {
              user_id: authData.user.id,
              language: 'en',
              notifications_enabled: true,
              location_sharing: true,
            },
            { onConflict: 'user_id' },
          );

        if (prefError) {
          return { data: null, error: new Error('Error creating user preferences: ' + prefError.message) };
        }
      }

      return { data: authData, error: null };
    } catch (error) {
      console.error('Error creating user:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }

  const signUpWithDigitalId = async (digitalIdData: DigitalIdData) => {
    setLoading(true);
    try {
      const result = await generateDigitalId(digitalIdData);
      const { error: profileError } = await supabase
        .from('tourist_profiles')
        .insert({
          tourist_id: result.userId,
          full_name: digitalIdData.fullName,
          phone: digitalIdData.phone,
          emergency_contact: digitalIdData.emergencyContactName,
          emergency_phone: digitalIdData.emergencyContactPhone,
          digital_id: result.digitalId,
          digital_id_verified: result.isVerified,
          emergency_contacts: [{
            id: 'ec_1',
            name: digitalIdData.emergencyContactName,
            relationship: 'Emergency Contact',
            phone: digitalIdData.emergencyContactPhone,
            isPrimary: true,
          }],
          travel_history: [],
          status: 'safe',
          last_active: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Error creating tourist profile:', profileError);
        return { data: result, error: profileError };
      }

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
          emergency_phone: profileData.emergencyContactPhone || null,
          phone: profileData.phone || null,
          emergency_contact: profileData.emergencyContactName || null,
          digital_id: profileData.digitalId || null,
          digital_id_verified: profileData.digitalIdVerified || false,
          emergency_contacts: profileData.emergencyContactName ? [{
            id: 'ec_1',
            name: profileData.emergencyContactName,
            relationship: 'Emergency Contact',
            phone: profileData.emergencyContactPhone || '',
            isPrimary: true,
          }] : [],
          travel_history: profileData.travelHistory || [],
          status: profileData.status || 'safe',
          last_active: profileData.lastActive || new Date().toISOString(),
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
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return { data: null, error: authError };
      }

      if (authData.user) {
        // Fetch additional user data from tourist_profiles
        const profileData: any = await supabase
    .from('tourist_profiles')
    .select('*')
    .eq('tourist_id', authData.user.id)
    .single();


        return {
          data: {
            userId: authData.user.id,
            name: profileData?.full_name || authData.user.user_metadata?.full_name || 'User',
            email,
            phone: profileData?.phone || '',
            digitalId: profileData?.digital_id || null,
            isVerified: profileData?.digital_id_verified || !!authData.user.confirmed_at,
            emergencyContacts: profileData?.emergency_contacts || [],
            travelHistory: profileData?.travel_history || [],
          },
          error: null,
        };
      }

      return { data: null, error: new Error('No user data returned') };
    } catch (error) {
      console.error('Error signing in:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
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
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};