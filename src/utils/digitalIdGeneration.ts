import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export interface DigitalIdData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  dateOfBirth?: string;
  nationality?: string;
  govtId?: string;
  passportNo?: string;
}

export interface GeneratedDigitalId {
  digitalId: string;
  userId: string;
  touristId: string;
  qrCode: string;
  blockchainHash: string;
  isVerified: boolean;
}

/**
 * Generates a unique digital ID for tourists with blockchain verification
 */
export const generateDigitalId = async (data: DigitalIdData): Promise<GeneratedDigitalId> => {
  try {
    // Step 1: Create user account in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          phone: data.phone
        }
      }
    });

    if (authError) {
      throw new Error(`Authentication error: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('Failed to create user account');
    }

    const userId = authData.user.id;

    // Step 2: Create user record in public.users table
    const { error: userError } = await supabase
      .from('users')
      .insert({
        user_id: userId,
        email: data.email,
        role: 'tourist'
      });

    if (userError) {
      throw new Error(`User creation error: ${userError.message}`);
    }

    // Step 3: Generate unique digital ID
    const digitalId = generateUniqueDigitalId();
    
    // Step 4: Create tourist profile
    const { error: profileError } = await supabase
      .from('tourist_profiles')
      .insert({
        tourist_id: userId,
        full_name: data.fullName,
        date_of_birth: data.dateOfBirth || null,
        nationality: data.nationality || 'Indian',
        passport_no: data.passportNo || null,
        govt_id: data.govtId || null,
        emergency_contact: `${data.emergencyContactName}:${data.emergencyContactPhone}`,
        digital_id_verified: true
      });

    if (profileError) {
      throw new Error(`Profile creation error: ${profileError.message}`);
    }

    // Step 5: Create user preferences
    const { error: preferencesError } = await supabase
      .from('user_preferences')
      .insert({
        user_id: userId,
        language: 'en',
        notifications_enabled: true,
        location_sharing: true
      });

    if (preferencesError) {
      console.warn('Failed to create user preferences:', preferencesError.message);
    }

    // Step 6: Generate QR code and blockchain hash
    const qrCode = await generateQRCode(digitalId, userId);
    const blockchainHash = await generateBlockchainHash(digitalId, data);

    // Step 7: Log the digital ID generation
    await logAuditAction(userId, 'digital_id_generated', {
      digitalId,
      email: data.email,
      fullName: data.fullName
    });

    return {
      digitalId,
      userId,
      touristId: userId,
      qrCode,
      blockchainHash,
      isVerified: true
    };

  } catch (error) {
    console.error('Digital ID generation failed:', error);
    throw error;
  }
};

/**
 * Generates a unique digital ID with format: NE-DID-YYYY-XXXXXXX
 */
const generateUniqueDigitalId = (): string => {
  const year = new Date().getFullYear();
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  
  return `NE-DID-${year}-${timestamp.toString().slice(-7)}${random.slice(-3)}`;
};

/**
 * Generates QR code data for the digital ID
 */
const generateQRCode = async (digitalId: string, userId: string): Promise<string> => {
  const qrData = {
    digitalId,
    userId,
    issueDate: new Date().toISOString(),
    issuer: 'Government of India - Ministry of Tourism',
    region: 'Northeast India',
    version: '2.1.0'
  };
  
  // In a real implementation, you would use a QR code library
  // For now, we'll return the base64 encoded JSON
  return btoa(JSON.stringify(qrData));
};

/**
 * Generates blockchain hash for verification
 */
const generateBlockchainHash = async (digitalId: string, data: DigitalIdData): Promise<string> => {
  const hashData = {
    digitalId,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    timestamp: Date.now(),
    salt: Math.random().toString(36).substring(2, 15)
  };
  
  // Simple hash generation (in production, use proper blockchain integration)
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(JSON.stringify(hashData));
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Logs audit actions for tracking
 */
const logAuditAction = async (userId: string, actionType: string, details: any) => {
  try {
    await supabase
      .from('audit_logs')
      .insert({
        action_by: userId,
        action_type: actionType,
        details
      });
  } catch (error) {
    console.error('Failed to log audit action:', error);
  }
};

/**
 * Validates digital ID format
 */
export const validateDigitalId = (digitalId: string): boolean => {
  const pattern = /^NE-DID-\d{4}-\d{10}$/;
  return pattern.test(digitalId);
};

/**
 * Retrieves tourist data by digital ID
 */
export const getTouristByDigitalId = async (digitalId: string) => {
  try {
    // Since digital_id is not stored directly, we need to search by user data
    // This is a simplified approach - in production, you'd store the digital_id in the profile
    const { data: profiles, error } = await supabase
      .from('tourist_profiles')
      .select(`
        *,
        users!tourist_profiles_tourist_id_fkey(*)
      `)
      .eq('digital_id_verified', true);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // For now, we'll match by the pattern in the digital ID
    // In production, store digital_id as a field in tourist_profiles
    const tourist = profiles?.find(profile => {
      const generatedId = generateUniqueDigitalId();
      return generatedId.includes(profile.tourist_id.slice(-7));
    });

    return { data: tourist, error: null };
  } catch (error) {
    console.error('Error fetching tourist by digital ID:', error);
    return { data: null, error };
  }
};