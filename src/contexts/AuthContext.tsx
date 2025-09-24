
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '@/integrations/firebase/client';
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { generateDigitalId, type DigitalIdData } from '@/utils/digitalIdGeneration';

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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function signUp(email: string, password: string, fullName: string) {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // No longer creating a separate 'users' document
      return { data: userCredential, error: null };
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
      await setDoc(doc(db, 'tourist_profiles', result.userId), {
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
      await setDoc(doc(db, 'tourist_profiles', userId), {
        tourist_id: userId,
        full_name: profileData.fullName,
        email: profileData.email, // Added email
        role: 'tourist', // Added role
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
      });

      return { data: { ...profileData, tourist_id: userId }, error: null };
    } catch (error) {
      console.error('Error creating tourist profile:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        const profileDoc = await getDoc(doc(db, 'tourist_profiles', user.uid));
        const profileData = profileDoc.data();

        return {
          data: {
            userId: user.uid,
            name: profileData?.full_name || user.displayName || 'User',
            email,
            phone: profileData?.phone || '',
            digitalId: profileData?.digital_id || null,
            isVerified: profileData?.digital_id_verified || user.emailVerified,
            emergencyContacts: profileData?.emergency_contacts || [],
            travelHistory: profileData?.travel_history || [], // Fixed typo here
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
      await firebaseSignOut(auth);
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