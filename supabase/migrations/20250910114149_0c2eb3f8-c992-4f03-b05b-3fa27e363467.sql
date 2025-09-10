-- Create enums first
CREATE TYPE public.user_role AS ENUM ('tourist', 'authority', 'admin');
CREATE TYPE public.location_status AS ENUM ('active', 'sos', 'offline');
CREATE TYPE public.safety_level AS ENUM ('safe', 'caution', 'danger');
CREATE TYPE public.alert_severity AS ENUM ('info', 'warning', 'critical');
CREATE TYPE public.fir_status AS ENUM ('open', 'in_progress', 'closed');

-- Create users table (extends auth.users)
CREATE TABLE public.users (
    user_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'tourist',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create tourist profiles table
CREATE TABLE public.tourist_profiles (
    tourist_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    gender TEXT,
    date_of_birth DATE,
    nationality TEXT,
    passport_no TEXT,
    govt_id TEXT,
    emergency_contact TEXT,
    photo_url TEXT,
    digital_id_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create authority profiles table
CREATE TABLE public.authority_profiles (
    authority_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    designation TEXT NOT NULL,
    badge_id TEXT UNIQUE NOT NULL,
    jurisdiction_area TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create safe zones table
CREATE TABLE public.safe_zones (
    zone_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    polygon_coordinates JSONB NOT NULL,
    safety_level safety_level NOT NULL DEFAULT 'safe',
    created_by UUID REFERENCES public.authority_profiles(authority_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create safe routes table
CREATE TABLE public.safe_routes (
    route_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    path_coordinates JSONB NOT NULL,
    verified_by UUID REFERENCES public.authority_profiles(authority_id) ON DELETE SET NULL,
    safety_level safety_level NOT NULL DEFAULT 'safe',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create tourist locations table (live tracking)
CREATE TABLE public.tourist_locations (
    location_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tourist_id UUID NOT NULL REFERENCES public.tourist_profiles(tourist_id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    status location_status NOT NULL DEFAULT 'active',
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create alerts table
CREATE TABLE public.alerts (
    alert_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    issued_by UUID NOT NULL REFERENCES public.authority_profiles(authority_id) ON DELETE CASCADE,
    target_zone UUID REFERENCES public.safe_zones(zone_id) ON DELETE SET NULL,
    target_tourist UUID REFERENCES public.tourist_profiles(tourist_id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    severity alert_severity NOT NULL DEFAULT 'info',
    issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create panic requests table
CREATE TABLE public.panic_requests (
    panic_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tourist_id UUID NOT NULL REFERENCES public.tourist_profiles(tourist_id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    message TEXT,
    triggered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    resolved_by UUID REFERENCES public.authority_profiles(authority_id) ON DELETE SET NULL,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create EFIR reports table
CREATE TABLE public.efir_reports (
    fir_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    filed_by UUID NOT NULL REFERENCES public.tourist_profiles(tourist_id) ON DELETE CASCADE,
    handled_by UUID REFERENCES public.authority_profiles(authority_id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    status fir_status NOT NULL DEFAULT 'open',
    filed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create travel history table
CREATE TABLE public.travel_history (
    history_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tourist_id UUID NOT NULL REFERENCES public.tourist_profiles(tourist_id) ON DELETE CASCADE,
    check_in_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    check_out_time TIMESTAMP WITH TIME ZONE,
    zone_id UUID REFERENCES public.safe_zones(zone_id) ON DELETE SET NULL,
    route_id UUID REFERENCES public.safe_routes(route_id) ON DELETE SET NULL
);

-- Create audit logs table
CREATE TABLE public.audit_logs (
    log_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    action_by UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_authority_badge_id ON public.authority_profiles(badge_id);
CREATE INDEX idx_tourist_locations_tourist_id ON public.tourist_locations(tourist_id);
CREATE INDEX idx_tourist_locations_timestamp ON public.tourist_locations(timestamp DESC);
CREATE INDEX idx_alerts_issued_by ON public.alerts(issued_by);
CREATE INDEX idx_alerts_target_zone ON public.alerts(target_zone);
CREATE INDEX idx_alerts_target_tourist ON public.alerts(target_tourist);
CREATE INDEX idx_panic_requests_tourist_id ON public.panic_requests(tourist_id);
CREATE INDEX idx_panic_requests_triggered_at ON public.panic_requests(triggered_at DESC);
CREATE INDEX idx_efir_reports_filed_by ON public.efir_reports(filed_by);
CREATE INDEX idx_efir_reports_handled_by ON public.efir_reports(handled_by);
CREATE INDEX idx_travel_history_tourist_id ON public.travel_history(tourist_id);
CREATE INDEX idx_audit_logs_action_by ON public.audit_logs(action_by);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tourist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authority_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safe_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safe_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tourist_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.panic_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.efir_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer functions to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role AS $$
  SELECT role FROM public.users WHERE user_id = user_uuid;
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_tourist(user_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE user_id = user_uuid AND role = 'tourist'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_authority(user_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE user_id = user_uuid AND role IN ('authority', 'admin')
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- RLS Policies for users table
CREATE POLICY "Users can view their own record" ON public.users
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own record" ON public.users
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for tourist_profiles
CREATE POLICY "Tourists can view their own profile" ON public.tourist_profiles
  FOR SELECT USING (auth.uid() = tourist_id);

CREATE POLICY "Tourists can update their own profile" ON public.tourist_profiles
  FOR UPDATE USING (auth.uid() = tourist_id);

CREATE POLICY "Tourists can insert their own profile" ON public.tourist_profiles
  FOR INSERT WITH CHECK (auth.uid() = tourist_id);

CREATE POLICY "Authorities can view all tourist profiles" ON public.tourist_profiles
  FOR SELECT USING (public.is_authority(auth.uid()));

-- RLS Policies for authority_profiles
CREATE POLICY "Authorities can view their own profile" ON public.authority_profiles
  FOR SELECT USING (auth.uid() = authority_id);

CREATE POLICY "Authorities can update their own profile" ON public.authority_profiles
  FOR UPDATE USING (auth.uid() = authority_id);

CREATE POLICY "Authorities can insert their own profile" ON public.authority_profiles
  FOR INSERT WITH CHECK (auth.uid() = authority_id);

CREATE POLICY "Authorities can view other authority profiles" ON public.authority_profiles
  FOR SELECT USING (public.is_authority(auth.uid()));

-- RLS Policies for safe_zones
CREATE POLICY "Everyone can view safe zones" ON public.safe_zones
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authorities can manage safe zones" ON public.safe_zones
  FOR ALL USING (public.is_authority(auth.uid()));

-- RLS Policies for safe_routes
CREATE POLICY "Everyone can view safe routes" ON public.safe_routes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authorities can manage safe routes" ON public.safe_routes
  FOR ALL USING (public.is_authority(auth.uid()));

-- RLS Policies for tourist_locations
CREATE POLICY "Tourists can manage their own locations" ON public.tourist_locations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tourist_profiles 
      WHERE tourist_id = public.tourist_locations.tourist_id 
      AND tourist_id = auth.uid()
    )
  );

CREATE POLICY "Authorities can view all tourist locations" ON public.tourist_locations
  FOR SELECT USING (public.is_authority(auth.uid()));

-- RLS Policies for alerts
CREATE POLICY "Everyone can view alerts" ON public.alerts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authorities can manage alerts" ON public.alerts
  FOR ALL USING (public.is_authority(auth.uid()));

-- RLS Policies for panic_requests
CREATE POLICY "Tourists can manage their own panic requests" ON public.panic_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tourist_profiles 
      WHERE tourist_id = public.panic_requests.tourist_id 
      AND tourist_id = auth.uid()
    )
  );

CREATE POLICY "Authorities can view and resolve panic requests" ON public.panic_requests
  FOR ALL USING (public.is_authority(auth.uid()));

-- RLS Policies for efir_reports
CREATE POLICY "Tourists can manage their own FIR reports" ON public.efir_reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tourist_profiles 
      WHERE tourist_id = public.efir_reports.filed_by 
      AND tourist_id = auth.uid()
    )
  );

CREATE POLICY "Authorities can view and handle FIR reports" ON public.efir_reports
  FOR ALL USING (public.is_authority(auth.uid()));

-- RLS Policies for travel_history
CREATE POLICY "Tourists can view their own travel history" ON public.travel_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tourist_profiles 
      WHERE tourist_id = public.travel_history.tourist_id 
      AND tourist_id = auth.uid()
    )
  );

CREATE POLICY "Authorities can view all travel history" ON public.travel_history
  FOR SELECT USING (public.is_authority(auth.uid()));

CREATE POLICY "System can insert travel history" ON public.travel_history
  FOR INSERT TO authenticated WITH CHECK (true);

-- RLS Policies for audit_logs
CREATE POLICY "Users can view logs of their own actions" ON public.audit_logs
  FOR SELECT USING (auth.uid() = action_by);

CREATE POLICY "Authorities can view all audit logs" ON public.audit_logs
  FOR SELECT USING (public.is_authority(auth.uid()));

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT TO authenticated WITH CHECK (true);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tourist_profiles_updated_at BEFORE UPDATE ON public.tourist_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_authority_profiles_updated_at BEFORE UPDATE ON public.authority_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_safe_zones_updated_at BEFORE UPDATE ON public.safe_zones
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_safe_routes_updated_at BEFORE UPDATE ON public.safe_routes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_efir_reports_updated_at BEFORE UPDATE ON public.efir_reports
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();