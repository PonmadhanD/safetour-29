import { supabase } from '@/integrations/supabase/client';

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

export const generateDigitalId = async (data: DigitalIdData): Promise<GeneratedDigitalId> => {
  try {
    // ---------------------------
    // Step 1: Create Auth User (if not exists)
    // ---------------------------
    let userId: string;

    // Query the users table to check if a user with this email exists
    const { data: existingUser, error: userLookupError } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', data.email)
      .single();

    if (userLookupError && userLookupError.code !== 'PGRST116') {
      // PGRST116: No rows found
      throw new Error(`User lookup error: ${userLookupError.message}`);
    }

    if (existingUser?.user_id) {
      userId = existingUser.user_id;
    } else {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: { full_name: data.fullName, phone: data.phone } }
      });
      if (authError) throw new Error(`Authentication error: ${authError.message}`);
      if (!authData.user) throw new Error('Failed to create user account');
      userId = authData.user.id;
    }

    // ---------------------------
    // Step 2: Upsert into users table
    // ---------------------------
    const { error: userError } = await supabase
      .from('users')
      .upsert({ user_id: userId, email: data.email, role: 'tourist' }, { onConflict: 'user_id' });
    if (userError) throw new Error(`User creation/upsert error: ${userError.message}`);

    // ---------------------------
    // Step 3: Check existing tourist profile
    // ---------------------------
    const { data: existingProfile } = await supabase
      .from('tourist_profiles')
      .select('digital_id')
      .eq('tourist_id', userId)
      .single() as { data: { digital_id: string } | null; error: any };

    const digitalId = existingProfile?.digital_id || generateUniqueDigitalId();

    // ---------------------------
    // Step 4: Upsert tourist profile
    // ---------------------------
    const { error: profileError } = await supabase
      .from('tourist_profiles')
      .upsert(
        {
          tourist_id: userId,
          full_name: data.fullName,
          date_of_birth: data.dateOfBirth || null,
          nationality: data.nationality || 'Indian',
          passport_no: data.passportNo || null,
          govt_id: data.govtId || null,
          emergency_contact: `${data.emergencyContactName}:${data.emergencyContactPhone}`,
          digital_id_verified: true,
          phone: data.phone,
          digital_id: digitalId
        },
        { onConflict: 'tourist_id' }
      );
    if (profileError) throw new Error(`Error creating/updating tourist profile: ${profileError.message}`);

    // ---------------------------
    // Step 5: Upsert user preferences
    // ---------------------------
    const { error: preferencesError } = await supabase
      .from('user_preferences')
      .upsert(
        { user_id: userId, language: 'en', notifications_enabled: true, location_sharing: true },
        { onConflict: 'user_id' }
      );
    if (preferencesError) console.warn('Failed to upsert user preferences:', preferencesError.message);

    // ---------------------------
    // Step 6: Generate QR code & blockchain hash
    // ---------------------------
    const qrCode = await generateQRCode(digitalId, userId);
    const blockchainHash = await generateBlockchainHash(digitalId, data);

    // ---------------------------
    // Step 7: Log audit action
    // ---------------------------
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

// ---------------------------
// Helpers
// ---------------------------
const generateUniqueDigitalId = (): string => {
  const year = new Date().getFullYear();
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `NE-DID-${year}-${timestamp.toString().slice(-7)}${random.slice(-3)}`;
};

const generateQRCode = async (digitalId: string, userId: string): Promise<string> => {
  const qrData = {
    digitalId,
    userId,
    issueDate: new Date().toISOString(),
    issuer: 'Government of India - Ministry of Tourism',
    region: 'Northeast India',
    version: '2.1.0'
  };
  return btoa(JSON.stringify(qrData));
};

const generateBlockchainHash = async (digitalId: string, data: DigitalIdData): Promise<string> => {
  const hashData = { digitalId, fullName: data.fullName, email: data.email, phone: data.phone, timestamp: Date.now(), salt: Math.random().toString(36).substring(2, 15) };
  const buffer = new TextEncoder().encode(JSON.stringify(hashData));
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
};

const logAuditAction = async (userId: string, actionType: string, details: any) => {
  try {
    await supabase.from('audit_logs').insert({ action_by: userId, action_type: actionType, details });
  } catch (error) {
    console.error('Failed to log audit action:', error);
  }
};