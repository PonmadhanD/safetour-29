
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/integrations/firebase/client';

interface AuthorityAuthContextType {
  authorityUser: User | null;
  loading: boolean;
  signUpAuthority: (email: string, password: string, fullName: string, role: string) => Promise<{ data: any; error: any }>;
  signInAuthority: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOutAuthority: () => Promise<void>;
  createAuthorityProfile: (userId: string, profileData: any) => Promise<{ data: any; error: any }>;
}

const AuthorityAuthContext = createContext<AuthorityAuthContextType | undefined>(undefined);

export const useAuthorityAuth = () => {
  const context = useContext(AuthorityAuthContext);
  if (context === undefined) {
    throw new Error('useAuthorityAuth must be used within an AuthorityAuthProvider');
  }
  return context;
};

export const AuthorityAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authorityUser, setAuthorityUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthorityUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function signUpAuthority(email: string, password: string, fullName: string, role: string) {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        await createAuthorityProfile(user.uid, { fullName, email, role });
      }
      return { data: userCredential, error: null };
    } catch (error) {
      console.error('Error creating authority user:', error);
      // Attempt to delete the user from auth if profile creation fails
      const user = auth.currentUser;
      if (user && user.email === email) {
        try {
          await user.delete();
          console.log('Successfully deleted orphaned auth user.');
        } catch (deleteError) {
          console.error('Failed to delete orphaned auth user:', deleteError);
        }
      }
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }

  const createAuthorityProfile = async (userId: string, profileData: any) => {
    try {
      await setDoc(doc(db, 'authority_profiles', userId), {
        authority_id: userId,
        full_name: profileData.fullName,
        email: profileData.email,
        role: profileData.role,
        created_at: new Date().toISOString(),
      });
      return { data: { ...profileData, authority_id: userId }, error: null };
    } catch (error) {
      console.error('Error creating authority profile:', error);
      // Re-throw the error to be caught by signUpAuthority
      throw error;
    }
  };

  const signInAuthority = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        const profileDoc = await getDoc(doc(db, 'authority_profiles', user.uid));
        if (profileDoc.exists()) {
          const profileData = profileDoc.data();
          setAuthorityUser(user);
          return {
            data: {
              userId: user.uid,
              name: profileData?.full_name || 'Authority',
              email,
              role: profileData?.role || 'authority',
            },
            error: null,
          };
        } else {
            await firebaseSignOut(auth);
            return { data: null, error: new Error('User is not an authority.') };
        }
      }

      return { data: null, error: new Error('No user data returned') };
    } catch (error) {
      console.error('Error signing in authority:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOutAuthority = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setAuthorityUser(null);
    } catch (error) {
      console.error('Error signing out authority:', error);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthorityAuthContextType = {
    authorityUser,
    loading,
    signUpAuthority,
    signInAuthority,
    signOutAuthority,
    createAuthorityProfile,
  };

  return <AuthorityAuthContext.Provider value={value}>{children}</AuthorityAuthContext.Provider>;
};
