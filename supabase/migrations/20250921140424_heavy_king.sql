/*
  # Fix Data Consistency and Add Missing Fields

  1. Schema Updates
    - Add digital_id field to tourist_profiles
    - Add password_hash field for future login functionality
    - Update family_members table structure
    - Add proper constraints and indexes

  2. Data Integrity
    - Ensure proper foreign key relationships
    - Add check constraints for data validation
    - Update RLS policies for new fields

  3. Performance
    - Add indexes for frequently queried fields
    - Optimize location-based queries
*/

-- Add digital_id field to tourist_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tourist_profiles' AND column_name = 'digital_id'
  ) THEN
    ALTER TABLE public.tourist_profiles ADD COLUMN digital_id TEXT UNIQUE;
  END IF;
END $$;

-- Add password_hash field for future login functionality
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE public.users ADD COLUMN password_hash TEXT;
  END IF;
END $$;

-- Add full_name to users table for easier queries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE public.users ADD COLUMN full_name TEXT;
  END IF;
END $$;

-- Update family_members table to include name and phone for easier access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'family_members' AND column_name = 'name'
  ) THEN
    ALTER TABLE public.family_members ADD COLUMN name TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'family_members' AND column_name = 'phone'
  ) THEN
    ALTER TABLE public.family_members ADD COLUMN phone TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'family_members' AND column_name = 'location'
  ) THEN
    ALTER TABLE public.family_members ADD COLUMN location TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'family_members' AND column_name = 'distance'
  ) THEN
    ALTER TABLE public.family_members ADD COLUMN distance TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'family_members' AND column_name = 'last_seen'
  ) THEN
    ALTER TABLE public.family_members ADD COLUMN last_seen TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'family_members' AND column_name = 'user_status'
  ) THEN
    ALTER TABLE public.family_members ADD COLUMN user_status TEXT CHECK (user_status IN ('safe', 'alert', 'emergency', 'unknown'));
  END IF;
END $$;

-- Add proper foreign key constraints if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'family_members_user_id_fkey'
  ) THEN
    ALTER TABLE public.family_members 
    ADD CONSTRAINT family_members_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'family_members_family_member_id_fkey'
  ) THEN
    ALTER TABLE public.family_members 
    ADD CONSTRAINT family_members_family_member_id_fkey 
    FOREIGN KEY (family_member_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tourist_profiles_digital_id ON public.tourist_profiles(digital_id);
CREATE INDEX IF NOT EXISTS idx_users_full_name ON public.users(full_name);
CREATE INDEX IF NOT EXISTS idx_family_members_composite ON public.family_members(user_id, family_member_id, status);
CREATE INDEX IF NOT EXISTS idx_tourist_locations_composite ON public.tourist_locations(tourist_id, timestamp DESC, status);

-- Update RLS policies for new fields
DROP POLICY IF EXISTS "Users can view their own record" ON public.users;
CREATE POLICY "Users can view their own record" ON public.users
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own record" ON public.users;
CREATE POLICY "Users can update their own record" ON public.users
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to insert their own record (for registration)
CREATE POLICY "Users can insert their own record" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update family_members policies to handle new structure
DROP POLICY IF EXISTS "Users can manage their family connections" ON public.family_members;
CREATE POLICY "Users can manage their family connections" ON public.family_members
  FOR ALL USING (auth.uid() = user_id OR auth.uid() = family_member_id);

-- Create function to update family member location data
CREATE OR REPLACE FUNCTION public.update_family_member_location()
RETURNS TRIGGER AS $$
BEGIN
  -- Update family_members table with latest location info when tourist_locations is updated
  UPDATE public.family_members 
  SET 
    last_seen = NEW.timestamp,
    user_status = CASE 
      WHEN NEW.status = 'sos' THEN 'emergency'
      WHEN NEW.status = 'active' THEN 'safe'
      ELSE 'unknown'
    END
  WHERE family_member_id = NEW.tourist_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically update family member data
DROP TRIGGER IF EXISTS update_family_location_trigger ON public.tourist_locations;
CREATE TRIGGER update_family_location_trigger
  AFTER INSERT OR UPDATE ON public.tourist_locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_family_member_location();

-- Create function to generate unique digital IDs
CREATE OR REPLACE FUNCTION public.generate_digital_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  year_part TEXT;
  timestamp_part TEXT;
  random_part TEXT;
BEGIN
  year_part := EXTRACT(YEAR FROM NOW())::TEXT;
  timestamp_part := EXTRACT(EPOCH FROM NOW())::BIGINT::TEXT;
  random_part := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
  
  new_id := 'NE-DID-' || year_part || '-' || 
            RIGHT(timestamp_part, 7) || 
            RIGHT(random_part, 3);
  
  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.tourist_profiles WHERE digital_id = new_id) LOOP
    random_part := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    new_id := 'NE-DID-' || year_part || '-' || 
              RIGHT(timestamp_part, 7) || 
              RIGHT(random_part, 3);
  END LOOP;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-generate digital_id for new tourist profiles
CREATE OR REPLACE FUNCTION public.auto_generate_digital_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.digital_id IS NULL THEN
    NEW.digital_id := public.generate_digital_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS auto_digital_id_trigger ON public.tourist_profiles;
CREATE TRIGGER auto_digital_id_trigger
  BEFORE INSERT ON public.tourist_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_digital_id();

-- Add sample data for testing (optional)
-- This will be commented out in production
/*
INSERT INTO public.users (user_id, email, role, full_name) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'test.tourist@example.com', 'tourist', 'Test Tourist'),
  ('550e8400-e29b-41d4-a716-446655440002', 'test.authority@example.com', 'authority', 'Test Authority')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.tourist_profiles (tourist_id, full_name, emergency_contact) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Test Tourist', 'Emergency Contact:+91-9876543210')
ON CONFLICT (tourist_id) DO NOTHING;

INSERT INTO public.authority_profiles (authority_id, name, department, designation, badge_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440002', 'Test Authority', 'Tourism Safety', 'Officer', 'NE-AUTH-001')
ON CONFLICT (authority_id) DO NOTHING;
*/