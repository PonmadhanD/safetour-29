import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Check, Upload, QrCode, Lock } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import digitalIdImage from '@/assets/digital-id.jpg';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const DigitalIdScreen: React.FC = () => {
  const { setTouristPage, setCurrentTourist } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    password: '', // Ensure password is always included
  });
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [documentsUploaded, setDocumentsUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(true); // Toggle between register and login

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.emergencyContact || !formData.emergencyPhone || !formData.password || !photoUploaded || !documentsUploaded) {
      alert('Please fill all fields and upload photo/documents.');
      return;
    }

    setLoading(true);

    try {
      const userId = uuidv4();

      // 1️⃣ Sign up with Supabase Auth (creates user with email and password)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.name } }
      });
      if (authError) throw authError;

      const { user } = authData;
      if (!user) throw new Error('User registration failed');

      // 2️⃣ Create tourist profile
      const { data: profileData, error: profileError } = await supabase
        .from('tourist_profiles')
        .insert([{
          tourist_id: user.id, // Use the authenticated user ID
          full_name: formData.name,
          phone: formData.phone,
          emergency_contact: formData.emergencyContact,
          photo_url: '', // Add photo URL if you handle uploads
          digital_id_verified: false
        }])
        .select()
        .single();

      if (profileError) throw profileError;

      // ✅ Update context and go home
      setCurrentTourist({
        id: user.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        isVerified: false, // Set to false initially, verify later
        digitalId: profileData?.tourist_id || '',
        emergencyContacts: [{
          id: `ec_${Date.now()}`,
          name: formData.emergencyContact,
          phone: formData.emergencyPhone,
          relationship: 'Emergency Contact',
          isPrimary: true
        }],
        travelHistory: [],
        status: 'safe',
        lastActive: new Date().toISOString()
      });

      setTouristPage('home');
    } catch (error: any) {
      console.error('Error registering:', error);
      alert(`Error creating ID: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      alert('Please fill email and password.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;

      const { user } = data;
      if (user) {
        const { data: profileData } = await supabase
          .from('tourist_profiles')
          .select('*')
          .eq('tourist_id', user.id)
          .single();

         setCurrentTourist({
  tourist_id: profileData.tourist_id,
  full_name: profileData.full_name,
  gender: profileData.gender,
  date_of_birth: profileData.date_of_birth,
  nationality: profileData.nationality,
  passport_no: profileData.passport_no,
  govt_id: profileData.govt_id,
  emergency_contact: profileData.emergency_contact,
  photo_url: profileData.photo_url,
  digital_id_verified: profileData.digital_id_verified,
  created_at: profileData.created_at,
  updated_at: profileData.updated_at,
} as any); // <-- temporary fix

        setTouristPage('home');
      }
    } catch (error: any) {
      console.error('Error logging in:', error);
      alert(`Error logging in: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = isRegisterMode
    ? formData.name && formData.email && formData.phone && formData.emergencyContact && formData.emergencyPhone && formData.password && photoUploaded && documentsUploaded
    : formData.email && formData.password;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-secondary-light p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header with Mode Toggle */}
        <div className="text-center text-white pt-8 pb-4">
          <h1 className="text-2xl font-bold">
            {isRegisterMode ? 'Create Digital Tourist ID' : 'Login to Your ID'}
          </h1>
          <p className="text-white/90 mt-2">
            {isRegisterMode ? 'Secure blockchain-verified identification' : 'Access your tourist profile'}
          </p>
          <div className="mt-2">
            <Button
              variant={isRegisterMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsRegisterMode(true)}
              className="mr-2"
            >
              Register
            </Button>
            <Button
              variant={!isRegisterMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsRegisterMode(false)}
            >
              Login
            </Button>
          </div>
        </div>

        {/* ID Preview Card */}
        <Card className="bg-white/95 backdrop-blur shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-primary" />
              Digital Tourist ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-32 rounded-lg overflow-hidden mb-4">
              <img 
                src={digitalIdImage} 
                alt="Digital ID Preview" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Powered by Blockchain Technology
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="bg-white/95 backdrop-blur shadow-lg">
          <CardContent className="space-y-4 pt-6">
            {isRegisterMode && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency-contact">Emergency Contact Name</Label>
                  <Input
                    id="emergency-contact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    placeholder="Emergency contact name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency-phone">Emergency Contact Phone</Label>
                  <Input
                    id="emergency-phone"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                {/* Photo Upload */}
                <div className="space-y-2">
                  <Label>Profile Photo</Label>
                  <Button
                    variant={photoUploaded ? "success" : "outline"}
                    className="w-full"
                    onClick={() => setPhotoUploaded(true)}
                  >
                    {photoUploaded ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Photo Uploaded
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 mr-2" />
                        Upload Photo
                      </>
                    )}
                  </Button>
                </div>

                {/* Document Upload */}
                <div className="space-y-2">
                  <Label>Identity Documents</Label>
                  <Button
                    variant={documentsUploaded ? "success" : "outline"}
                    className="w-full"
                    onClick={() => setDocumentsUploaded(true)}
                  >
                    {documentsUploaded ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Documents Uploaded
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Documents
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <Button
          variant="hero"
          size="lg"
          className="w-full"
          onClick={isRegisterMode ? handleRegister : handleLogin}
          disabled={!isFormValid || loading}
        >
          {loading ? 'Processing...' : isRegisterMode ? 'Create Digital ID' : 'Login'}
        </Button>
      </div>
    </div>
  );
};

export default DigitalIdScreen;