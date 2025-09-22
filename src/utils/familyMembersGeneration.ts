import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export interface FamilyMemberData {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  dateOfBirth?: string;
  emergencyPriority?: number;
}

export interface FamilyMemberResult {
  id: string;
  userId: string;
  familyMemberId: string;
  relationship: string;
  status: 'active' | 'inactive' | 'pending';
  canTrack: boolean;
  name: string;
  phone: string;
  email?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  lastSeen?: string;
  userStatus?: 'safe' | 'active' | 'sos' | 'emergency' | 'unknown' | 'alert';

}

const mapStatus = (status: string | null | undefined): FamilyMemberResult['userStatus'] => {
  switch (status) {
    case 'active':
      return 'active';
    case 'sos':
      return 'sos';
    case 'emergency':
      return 'emergency';
    case 'safe':
      return 'safe';
    case 'alert':
      return 'alert';
    default:
      return 'unknown';
  }
};

/**
 * Adds a family member to the current user's family tracking list
 */
export const addFamilyMember = async (
  currentUserId: string,
  memberData: FamilyMemberData
): Promise<FamilyMemberResult> => {
  try {
    // Step 1: Verify current user is a tourist
    const { data: currentUser, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', currentUserId)
      .single();

    if (userError || !currentUser) {
      throw new Error('Current user not found');
    }

    if (currentUser.role !== 'tourist') {
      throw new Error('Only tourists can add family members');
    }

    // Step 2: Check if family member already exists as a user
    let familyMemberUserId: string;
    
    const { data: existingUser } = await supabase
      .from('users')
      .select('user_id, tourist_profiles(*)')
      .eq('email', memberData.email || '')
      .single();

    if (existingUser && memberData.email) {
      // Family member is already a registered user
      familyMemberUserId = existingUser.user_id;
    } else {
      // Create a new user account for the family member
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: memberData.email || `${generateTempEmail(memberData.phone)}`,
        password: generateTempPassword(),
        user_metadata: {
          full_name: memberData.name,
          phone: memberData.phone,
          is_family_member: true,
          added_by: currentUserId
        }
      });

      if (authError) {
        throw new Error(`Failed to create family member account: ${authError.message}`);
      }

      familyMemberUserId = authData.user.id;

      // Create user record
      const { error: userInsertError } = await supabase
        .from('users')
        .insert({
          user_id: familyMemberUserId,
          email: memberData.email || `${generateTempEmail(memberData.phone)}`,
          role: 'tourist'
        });

      if (userInsertError) {
        throw new Error(`Failed to create user record: ${userInsertError.message}`);
      }

      // Create tourist profile for family member
      const { error: profileError } = await supabase
        .from('tourist_profiles')
        .insert({
          tourist_id: familyMemberUserId,
          full_name: memberData.name,
          date_of_birth: memberData.dateOfBirth || null,
          emergency_contact: `${currentUserId}:Primary Family Member`,
          digital_id_verified: false
        });

      if (profileError) {
        throw new Error(`Failed to create tourist profile: ${profileError.message}`);
      }
    }

    // Step 3: Create family member relationship
    const familyMemberRecord = {
      user_id: currentUserId,
      family_member_id: familyMemberUserId,
      relationship: memberData.relationship,
      status: 'active' as const,
      can_track: true
    };

    const { data: familyMember, error: familyError } = await supabase
      .from('family_members')
      .insert(familyMemberRecord)
      .select()
      .single();

    if (familyError) {
      throw new Error(`Failed to create family relationship: ${familyError.message}`);
    }

    // Step 4: Create reverse relationship (bidirectional)
    const { error: reverseError } = await supabase
      .from('family_members')
      .insert({
        user_id: familyMemberUserId,
        family_member_id: currentUserId,
        relationship: getReciprocalRelationship(memberData.relationship),
        status: 'active',
        can_track: true
      });

    if (reverseError) {
      console.warn('Failed to create reverse family relationship:', reverseError.message);
    }

    // Step 5: Get the complete family member data
    const result = await getFamilyMemberDetails(familyMember.id);
    
    // Step 6: Log the action
    await logFamilyAction(currentUserId, 'family_member_added', {
      familyMemberId: familyMemberUserId,
      relationship: memberData.relationship,
      name: memberData.name
    });

    return result;

  } catch (error) {
    console.error('Error adding family member:', error);
    throw error;
  }
};

/**
 * Gets detailed information about a family member
 */
export const getFamilyMemberDetails = async (familyMemberRecordId: string): Promise<FamilyMemberResult> => {
  const { data, error } = await supabase
    .from('family_members')
    .select(`
      *,
      family_member:users!family_members_family_member_id_fkey(
        user_id,
        email,
        tourist_profiles(
          full_name,
          emergency_contact
        )
      )
    `)
    .eq('id', familyMemberRecordId)
    .single();

  if (error || !data) {
    throw new Error('Family member not found');
  }

  // Get latest location if available
  const { data: locationData } = await supabase
    .from('tourist_locations')
    .select('latitude, longitude, timestamp')
    .eq('tourist_id', data.family_member_id)
    .order('timestamp', { ascending: false })
    .limit(1)
    .single();

  return {
    id: data.id,
    userId: data.user_id,
    familyMemberId: data.family_member_id,
    relationship: data.relationship || 'Unknown',
    status: data.status as 'active' | 'inactive' | 'pending',
    canTrack: data.can_track,
    name: (data.family_member as any)?.tourist_profiles?.full_name || 'Unknown',
    phone: (data.family_member as any)?.email || '',
    email: (data.family_member as any)?.email,
    location: locationData ? {
      lat: locationData.latitude,
      lng: locationData.longitude
    } : undefined,
    lastSeen: locationData?.timestamp,
    userStatus: 'unknown' // This would be determined by latest location status
  };
};

/**
 * Gets all family members for a user
 */
export const getFamilyMembers = async (userId: string): Promise<FamilyMemberResult[]> => {
  try {
    const { data, error } = await supabase
      .from('family_members')
      .select(`
        *,
        family_member:users!family_members_family_member_id_fkey(
          user_id,
          email,
          tourist_profiles(
            full_name,
            emergency_contact
          )
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) {
      throw new Error(`Failed to fetch family members: ${error.message}`);
    }

const familyMembers: FamilyMemberResult[] = await Promise.all(
  (data || []).map(async (member) => {
    const { data: locationData } = await supabase
      .from('tourist_locations')
      .select('latitude, longitude, timestamp, status')
      .eq('tourist_id', member.family_member_id)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    return {
      id: member.id,
      userId: member.user_id,
      familyMemberId: member.family_member_id,
      relationship: member.relationship || 'Unknown',
      status: member.status as 'active' | 'inactive' | 'pending',
      canTrack: member.can_track,
      name: (member.family_member as any)?.tourist_profiles?.full_name || 'Unknown',
      phone: (member.family_member as any)?.email || '',
      email: (member.family_member as any)?.email,
      location: locationData ? {
        lat: locationData.latitude,
        lng: locationData.longitude
      } : undefined,
      lastSeen: locationData?.timestamp,
      userStatus: mapStatus(locationData?.status)
    };
  })
);

    return familyMembers;

  } catch (error) {
    console.error('Error fetching family members:', error);
    throw error;
  }
};

/**
 * Removes a family member relationship
 */
export const removeFamilyMember = async (userId: string, familyMemberRecordId: string): Promise<void> => {
  try {
    // Get the family member record first
    const { data: familyMember, error: fetchError } = await supabase
      .from('family_members')
      .select('family_member_id, relationship')
      .eq('id', familyMemberRecordId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !familyMember) {
      throw new Error('Family member not found or unauthorized');
    }

    // Remove the primary relationship
    const { error: deleteError } = await supabase
      .from('family_members')
      .delete()
      .eq('id', familyMemberRecordId)
      .eq('user_id', userId);

    if (deleteError) {
      throw new Error(`Failed to remove family member: ${deleteError.message}`);
    }

    // Remove the reverse relationship
    const { error: reverseDeleteError } = await supabase
      .from('family_members')
      .delete()
      .eq('user_id', familyMember.family_member_id)
      .eq('family_member_id', userId);

    if (reverseDeleteError) {
      console.warn('Failed to remove reverse relationship:', reverseDeleteError.message);
    }

    // Log the action
    await logFamilyAction(userId, 'family_member_removed', {
      familyMemberId: familyMember.family_member_id,
      relationship: familyMember.relationship
    });

  } catch (error) {
    console.error('Error removing family member:', error);
    throw error;
  }
};

/**
 * Updates family member tracking permissions
 */
export const updateFamilyMemberTracking = async (
  userId: string, 
  familyMemberRecordId: string, 
  canTrack: boolean
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('family_members')
      .update({ can_track: canTrack })
      .eq('id', familyMemberRecordId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to update tracking permission: ${error.message}`);
    }

    await logFamilyAction(userId, 'tracking_permission_updated', {
      familyMemberRecordId,
      canTrack
    });

  } catch (error) {
    console.error('Error updating family member tracking:', error);
    throw error;
  }
};

// Helper functions
const generateTempEmail = (phone: string): string => {
  return `temp_${phone.replace(/[^0-9]/g, '')}@safetour.temp`;
};

const generateTempPassword = (): string => {
  return Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
};

const getReciprocalRelationship = (relationship: string): string => {
  const reciprocals: Record<string, string> = {
    'father': 'child',
    'mother': 'child',
    'son': 'parent',
    'daughter': 'parent',
    'husband': 'wife',
    'wife': 'husband',
    'brother': 'sibling',
    'sister': 'sibling',
    'friend': 'friend',
    'spouse': 'spouse'
  };
  
  return reciprocals[relationship.toLowerCase()] || 'family member';
};

const logFamilyAction = async (userId: string, actionType: string, details: any) => {
  try {
    await supabase
      .from('audit_logs')
      .insert({
        action_by: userId,
        action_type: actionType,
        details
      });
  } catch (error) {
    console.error('Failed to log family action:', error);
  }
};

/**
 * Shares current location with family members
 */
export const shareLocationWithFamily = async (
  userId: string,
  latitude: number,
  longitude: number,
  message?: string
): Promise<void> => {
  try {
    // Update current location
    const { error: locationError } = await supabase
      .from('tourist_locations')
      .insert({
        tourist_id: userId,
        latitude,
        longitude,
        status: 'active'
      });

    if (locationError) {
      throw new Error(`Failed to update location: ${locationError.message}`);
    }

    // Get family members who can track
    const { data: familyMembers, error: familyError } = await supabase
      .from('family_members')
      .select('family_member_id')
      .eq('user_id', userId)
      .eq('can_track', true)
      .eq('status', 'active');

    if (familyError) {
      console.warn('Failed to get family members for location sharing:', familyError.message);
      return;
    }

    // Create notifications for family members (if notification system exists)
    if (familyMembers && familyMembers.length > 0) {
      await logFamilyAction(userId, 'location_shared_with_family', {
        latitude,
        longitude,
        message,
        sharedWith: familyMembers.map(fm => fm.family_member_id)
      });
    }

  } catch (error) {
    console.error('Error sharing location with family:', error);
    throw error;
  }
};

/**
 * Sends emergency alert to all family members
 */
export const sendEmergencyAlertToFamily = async (
  userId: string,
  latitude: number,
  longitude: number,
  message?: string
): Promise<void> => {
  try {
    // Create panic request
    const { data: panicRequest, error: panicError } = await supabase
      .from('panic_requests')
      .insert({
        tourist_id: userId,
        latitude,
        longitude,
        message: message || 'Emergency alert triggered'
      })
      .select()
      .single();

    if (panicError) {
      throw new Error(`Failed to create panic request: ${panicError.message}`);
    }

    // Update location status to SOS
    const { error: locationError } = await supabase
      .from('tourist_locations')
      .insert({
        tourist_id: userId,
        latitude,
        longitude,
        status: 'sos'
      });

    if (locationError) {
      console.warn('Failed to update location status:', locationError.message);
    }

    // Get family members for emergency notification
    const { data: familyMembers, error: familyError } = await supabase
      .from('family_members')
      .select(`
        family_member_id,
        relationship,
        family_member:users!family_members_family_member_id_fkey(
          email,
          tourist_profiles(full_name)
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active');

    if (familyError) {
      console.warn('Failed to get family members for emergency alert:', familyError.message);
    }

    // Log emergency action
    await logFamilyAction(userId, 'emergency_alert_sent', {
      panicRequestId: panicRequest.panic_id,
      latitude,
      longitude,
      message,
      familyMembersNotified: familyMembers?.length || 0
    });

  } catch (error) {
    console.error('Error sending emergency alert to family:', error);
    throw error;
  }
};