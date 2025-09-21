import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Check, Upload, QrCode } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { generateDigitalId, type DigitalIdData } from '@/utils/digitalIdGeneration';
import digitalIdImage from '@/assets/digital-id.jpg';

const DigitalIdScreen: React.FC = () => {
  const { setTouristPage, setCurrentTourist } = useApp();
  const { signUpWithDigitalId } = useAuth();
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateId = async () => {
    if (!isFormValid) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const digitalIdData: DigitalIdData = {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        emergencyContactName: formData.emergencyContact,
        emergencyContactPhone: formData.emergencyPhone
      };

      const { data: result, error: createError } = await signUpWithDigitalId(digitalIdData);
      
      if (createError) {
        throw new Error(createError.message || 'Failed to create digital ID');
      }

      if (result) {
        // Create tourist object for app state
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
          lastActive: new Date().toISOString()
        };
        
        setCurrentTourist(newTourist);
        setTouristPage('home');
      }
    } catch (err) {
      console.error('Digital ID creation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create digital ID');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name && formData.email && formData.phone && formData.password &&
                     formData.emergencyContact && formData.emergencyPhone && 
                     photoUploaded && documentsUploaded;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-secondary-light p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center text-black pt-8 pb-4">
          <h1 className="text-2xl font-bold">Create Digital Tourist ID</h1>
          <p className="text-black/90 mt-2">Secure blockchain-verified identification</p>
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
            {error && (
              <Alert className="border-destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Create a secure password"
                disabled={loading}
                minLength={6}
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

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <Button
                variant={photoUploaded ? "success" : "outline"}
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

            {/* Document Upload */}
            <div className="space-y-2">
              <Label>Identity Documents</Label>
              <Button
                variant={documentsUploaded ? "success" : "outline"}
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
          </CardContent>
        </Card>

        {/* Create Button */}
        <Button
          variant="hero"
          size="lg"
          className="w-full"
          onClick={handleCreateId}
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Creating Digital ID...
            </>
          ) : (
            'Create Digital ID'
          )}
        </Button>
      </div>
    </div>
  );
};

export default DigitalIdScreen;