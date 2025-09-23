import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Check, Upload, QrCode } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import digitalIdImage from '@/assets/digital-id.jpg';

// Mock AppContext functions

const mockSetCurrentTourist = (tourist: any) => {
  console.log('Setting current tourist:', tourist);
  localStorage.setItem('currentTourist', JSON.stringify(tourist));
  // In a real app, this would update the app's tourist state
};

// Mock generateDigitalId function
const mockGenerateDigitalId = async (data: DigitalIdData) => {
  // Simulate digital ID generation
  const digitalId = `DIGITAL-${data.fullName.replace(/\s+/g, '').toUpperCase()}-${Date.now()}`;
  return {
    userId: `user-${Date.now()}`,
    digitalId,
    isVerified: true, // Mock verification
    timestamp: new Date().toISOString(),
  };
};

// Define DigitalIdData type locally
interface DigitalIdData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

const DigitalIdScreen: React.FC = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [documentsUploaded, setDocumentsUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTourist, setCurrentTourist] = useState<any>(null);

  // Load current tourist from localStorage on mount
  useEffect(() => {
    const savedTourist = localStorage.getItem('currentTourist');
    if (savedTourist) {
      setCurrentTourist(JSON.parse(savedTourist));
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleMode = () => {
    setIsRegisterMode(prev => !prev);
    setError(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      emergencyContact: '',
      emergencyPhone: ''
    });
    if (!isRegisterMode) {
      setPhotoUploaded(false);
      setDocumentsUploaded(false);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setLoading(true);
    setError(null);

    try {
      if (isRegisterMode) {
        // Mock registration logic
        const digitalIdData: DigitalIdData = {
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          emergencyContactName: formData.emergencyContact,
          emergencyContactPhone: formData.emergencyPhone
        };

        // Simulate digital ID generation
        const result = await mockGenerateDigitalId(digitalIdData);

        if (result) {
          const newTourist = {
            id: result.userId,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            digitalId: result.digitalId,
            isVerified: result.isVerified,
            emergencyContacts: [{
              id: 'ec_1',
              name: formData.emergencyContact,
              relationship: 'Emergency Contact',
              phone: formData.emergencyPhone,
              isPrimary: true
            }],
            travelHistory: [],
            status: 'safe' as const,
            lastActive: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          };

          // Save to localStorage
          localStorage.setItem('tourists', JSON.stringify([...(JSON.parse(localStorage.getItem('tourists') || '[]')), newTourist]));
          localStorage.setItem('currentTourist', JSON.stringify(newTourist));

          setCurrentTourist(newTourist);
          mockSetCurrentTourist(newTourist);
          navigate('/');
          
          // Simulate success
          alert(`Digital ID created successfully!\nID: ${result.digitalId}`);
        }
      } else {
        // Mock login logic
        // Check if user exists in localStorage
        const savedTourists = JSON.parse(localStorage.getItem('tourists') || '[]');
        const existingTourist = savedTourists.find((t: any) => t.email === formData.email);

        if (existingTourist) {
          // Simulate successful login
          const loggedInTourist = {
            ...existingTourist,
            lastActive: new Date().toISOString(),
          };

          localStorage.setItem('currentTourist', JSON.stringify(loggedInTourist));
          setCurrentTourist(loggedInTourist);
          mockSetCurrentTourist(loggedInTourist);
          navigate('/');
          
          alert(`Welcome back, ${existingTourist.name}!`);
        } else {
          throw new Error('No account found with this email. Please register first.');
        }
      }
    } catch (err) {
      console.error(`${isRegisterMode ? 'Digital ID creation' : 'Login'} error:`, err);
      setError(err instanceof Error ? err.message : `Failed to ${isRegisterMode ? 'create digital ID' : 'log in'}`);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = isRegisterMode
    ? formData.name && formData.email && formData.phone && formData.password &&
      formData.emergencyContact && formData.emergencyPhone && 
      photoUploaded && documentsUploaded
    : formData.email && formData.password;

  // Check if already logged in
  if (currentTourist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light to-secondary-light p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Welcome Back!</CardTitle>
            <p className="text-gray-600 mt-2">Digital ID Active</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
                <QrCode className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">{currentTourist.name}</p>
                <p className="text-sm">{currentTourist.digitalId}</p>
              </div>
              <Button 
                className="w-full"
                onClick={() => {
                  localStorage.removeItem('currentTourist');
                  setCurrentTourist(null);
                  alert('Logged out successfully!');
                }}
              >
                Log Out
              </Button>
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => navigate('/')}
              >
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-secondary-light p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center text-black pt-8 pb-4">
          <h1 className="text-2xl font-bold">{isRegisterMode ? 'Create Digital Tourist ID' : 'Log In to Your Account'}</h1>
          <p className="text-black/90 mt-2">
            {isRegisterMode ? 'Offline digital identification' : 'Access your saved profile'}
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center justify-center gap-4">
          <span className="text-sm font-medium text-black">{isRegisterMode ? 'Already have an account?' : 'Need an account?'}</span>
          <Switch
            checked={isRegisterMode}
            onCheckedChange={handleToggleMode}
            className="data-[state=checked]:bg-primary"
          />
          <span className="text-sm font-medium text-black">{isRegisterMode ? 'Log In' : 'Register'}</span>
        </div>

        {/* ID Preview Card */}
        {isRegisterMode && (
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
                Offline Digital Identification
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <Card className="bg-white/95 backdrop-blur shadow-lg">
          <CardContent className="space-y-4 pt-6">
            {error && (
              <Alert className="border-destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isRegisterMode && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder={isRegisterMode ? 'Create a secure password' : 'Enter your password'}
                disabled={loading}
                minLength={isRegisterMode ? 6 : undefined}
              />
            </div>

            {isRegisterMode && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency-contact">Emergency Contact Name</Label>
                  <Input
                    id="emergency-contact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    placeholder="Emergency contact name"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency-phone">Emergency Contact Phone</Label>
                  <Input
                    id="emergency-phone"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Profile Photo</Label>
                  <Button
                    variant={photoUploaded ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setPhotoUploaded(true)}
                    disabled={loading}
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

                <div className="space-y-2">
                  <Label>Identity Documents</Label>
                  <Button
                    variant={documentsUploaded ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setDocumentsUploaded(true)}
                    disabled={loading}
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
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          variant="default"
          size="lg"
          className="w-full bg-primary hover:bg-primary/90"
          onClick={handleSubmit}
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              {isRegisterMode ? 'Creating Digital ID...' : 'Logging In...'}
            </>
          ) : (
            isRegisterMode ? 'Create Digital ID' : 'Log In'
          )}
        </Button>
      </div>
    </div>
  );
};

export default DigitalIdScreen;