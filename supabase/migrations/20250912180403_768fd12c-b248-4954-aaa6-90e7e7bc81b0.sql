-- Create tourist attractions table
CREATE TABLE public.tourist_attractions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_hi TEXT, -- Hindi name
  name_ta TEXT, -- Tamil name
  description TEXT,
  description_hi TEXT,
  description_ta TEXT,
  category TEXT NOT NULL CHECK (category IN ('historical', 'religious', 'natural', 'cultural', 'adventure')),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  contact_number TEXT,
  opening_hours JSONB,
  entry_fee TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create nearby services table (police, hospitals, hotels)
CREATE TABLE public.nearby_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_hi TEXT,
  name_ta TEXT,
  service_type TEXT NOT NULL CHECK (service_type IN ('police', 'hospital', 'hotel', 'restaurant', 'atm', 'fuel_station')),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  contact_number TEXT,
  address TEXT,
  address_hi TEXT,
  address_ta TEXT,
  is_24x7 BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create geofence violations table
CREATE TABLE public.geofence_violations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tourist_id UUID NOT NULL,
  zone_id UUID,
  violation_type TEXT NOT NULL CHECK (violation_type IN ('zone_exit', 'danger_zone_entry')),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical'))
);

-- Create family tracking table
CREATE TABLE public.family_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  family_member_id UUID NOT NULL,
  relationship TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  can_track BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, family_member_id)
);

-- Create user language preferences table
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'hi', 'ta')),
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  location_sharing BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on all new tables
ALTER TABLE public.tourist_attractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nearby_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geofence_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tourist_attractions (public read, authority manage)
CREATE POLICY "Everyone can view active tourist attractions" 
ON public.tourist_attractions 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authorities can manage tourist attractions" 
ON public.tourist_attractions 
FOR ALL 
USING (is_authority(auth.uid()));

-- RLS Policies for nearby_services (public read, authority manage)
CREATE POLICY "Everyone can view active nearby services" 
ON public.nearby_services 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authorities can manage nearby services" 
ON public.nearby_services 
FOR ALL 
USING (is_authority(auth.uid()));

-- RLS Policies for geofence_violations
CREATE POLICY "Tourists can view their own violations" 
ON public.geofence_violations 
FOR SELECT 
USING (auth.uid() = tourist_id);

CREATE POLICY "Authorities can view and manage all violations" 
ON public.geofence_violations 
FOR ALL 
USING (is_authority(auth.uid()));

CREATE POLICY "System can insert violations" 
ON public.geofence_violations 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for family_members
CREATE POLICY "Users can manage their family connections" 
ON public.family_members 
FOR ALL 
USING (auth.uid() = user_id OR auth.uid() = family_member_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can manage their own preferences" 
ON public.user_preferences 
FOR ALL 
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_tourist_attractions_updated_at
BEFORE UPDATE ON public.tourist_attractions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_nearby_services_updated_at
BEFORE UPDATE ON public.nearby_services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_family_members_updated_at
BEFORE UPDATE ON public.family_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample tourist attractions data
INSERT INTO public.tourist_attractions (name, name_hi, name_ta, description, description_hi, description_ta, category, latitude, longitude, rating, contact_number, opening_hours, entry_fee) VALUES
('Shillong Peak', 'शिलांग चोटी', 'ஷில்லாங் உச்சி', 'Highest point in Shillong offering panoramic views', 'शिलांग में सबसे ऊंचा बिंदु जो मनोरम दृश्य प्रस्तुत करता है', 'ஷில்லாங்கில் உயர்ந்த இடம், அழகான காட்சிகளைக் கொடுக்கும்', 'natural', 25.5941, 91.8932, 4.5, '+91-364-2226216', '{"open": "06:00", "close": "18:00"}', 'Free'),
('Ward''s Lake', 'वॉर्डस झील', 'வார்டு ஏரி', 'Beautiful artificial lake in the heart of Shillong', 'शिलांग के मध्य में स्थित सुंदर कृत्रिम झील', 'ஷில்லாங்கின் மையத்தில் அழகான செயற்கை ஏரி', 'natural', 25.5680, 91.9020, 4.3, '+91-364-2505116', '{"open": "09:00", "close": "17:00"}', '₹10 per person'),
('Elephant Falls', 'हाथी झरना', 'யானை நீர்வீழ்ச்சி', 'Three-tiered waterfall with scenic beauty', 'प्राकृतिक सुंदरता के साथ तीन स्तरीय जलप्रपात', 'மூன்று படிகளாக இருக்கும் அழகான நீர்வீழ்ச்சி', 'natural', 25.5357, 91.8947, 4.4, null, '{"open": "08:00", "close": "17:00"}', '₹25 per person'),
('Don Bosco Museum', 'डॉन बॉस्को संग्रहालय', 'டான் பாஸ்கோ அருங்காட்சியகம்', 'Museum showcasing Northeast Indian culture', 'पूर्वोत्तर भारतीय संस्कृति को प्रदर्शित करने वाला संग्रहालय', 'வடகிழக்கு இந்திய கலாச்சாரத்தை காட்டும் அருங்காட்சியகம்', 'cultural', 25.5641, 91.8814, 4.6, '+91-364-2541616', '{"open": "09:00", "close": "17:30", "closed": "Sunday"}', '₹40 per person');

-- Insert sample nearby services data
INSERT INTO public.nearby_services (name, name_hi, name_ta, service_type, latitude, longitude, contact_number, address, address_hi, address_ta, is_24x7, rating) VALUES
('Shillong Police Station', 'शिलांग थाना', 'ஷில்லாங் போலீஸ் நிலையம்', 'police', 25.5788, 91.8933, '+91-364-2224100', 'Police Bazaar, Shillong', 'पुलिस बाज़ार, शिलांग', 'போலீஸ் பஜார், ஷில்லாங்', true, 4.0),
('Civil Hospital Shillong', 'सिविल अस्पताल शिलांग', 'சிவில் மருத்துவமனை ஷில்லாங்', 'hospital', 25.5682, 91.8820, '+91-364-2223108', 'Jail Road, Shillong', 'जेल रोड, शिलांग', 'ஜெயில் ரோடு, ஷில்லாங்', true, 4.2),
('Hotel Centre Point', 'होटल सेंटर पॉइंट', 'ஹோட்டல் சென்டர் பாயிண்ட்', 'hotel', 25.5799, 91.8925, '+91-364-2225514', 'Police Bazaar, Shillong', 'पुलिस बाज़ार, शिलांग', 'போலீஸ் பஜார், ஷில்லாங்', false, 4.1),
('SBI ATM Police Bazaar', 'एसबीआई एटीएम पुलिस बाज़ार', 'எஸ்பிஐ ஏடிஎம் போலீஸ் பஜார்', 'atm', 25.5790, 91.8930, null, 'Police Bazaar, Shillong', 'पुलिस बाज़ार, शिलांग', 'போலீஸ் பஜார், ஷில்லாங்', true, 4.0);

-- Add indexes for better performance
CREATE INDEX idx_tourist_attractions_location ON public.tourist_attractions (latitude, longitude);
CREATE INDEX idx_tourist_attractions_category ON public.tourist_attractions (category);
CREATE INDEX idx_nearby_services_location ON public.nearby_services (latitude, longitude);
CREATE INDEX idx_nearby_services_type ON public.nearby_services (service_type);
CREATE INDEX idx_geofence_violations_tourist ON public.geofence_violations (tourist_id, timestamp);
CREATE INDEX idx_family_members_user ON public.family_members (user_id);
CREATE INDEX idx_user_preferences_user ON public.user_preferences (user_id);