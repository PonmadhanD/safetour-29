import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, User, Shield, Bell, MapPin, Phone, QrCode, Lock, Globe, HelpCircle, LogOut, LogIn } from 'lucide-react';

// Mock tourist data type
interface TouristData {
  id: string;
  name: string;
  email: string;
  phone: string;
  digitalId: string;
  isVerified: boolean;
  emergencyContacts: Array<{
    id: string;
    name: string;
    relationship: string;
    phone: string;
    isPrimary: boolean;
  }>;
  travelHistory: Array<any>;
  status: 'safe';
  lastActive: string;
}

// Mock translations
const translations = {
  settings: 'Settings',
  managePreferences: 'Manage your preferences',
  profile: 'Profile',
  verified: 'Verified',
  digitalId: 'Digital ID',
  securityAndPrivacy: 'Security & Privacy',
  locationServices: 'Location Services',
  notifications: 'Notifications',
  emergencyContacts: 'Emergency Contacts',
  addContact: 'Add Contact',
  appSettings: 'App Settings',
  language: 'Language',
  appVersion: 'App Version',
  latest: 'Latest',
  helpAndSupport: 'Help & Support',
  logout: 'Logout',
  english: 'English',
  hindi: 'Hindi',
  tamil: 'Tamil',
};

// Mock language type
type Language = 'en' | 'hi' | 'ta';

// Error Boundary
interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center text-red-600">
          <h2>Something went wrong.</h2>
          <p>Please try refreshing the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTourist, setCurrentTourist] = useState<TouristData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load tourist from localStorage
    const savedTourist = localStorage.getItem('currentTourist');
    if (savedTourist) {
      setCurrentTourist(JSON.parse(savedTourist));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentTourist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <LogIn className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600 text-lg">Please log in to access your settings</p>
          <Button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => {
              console.log('Navigating to login page');
            }}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const SettingsScreen: React.FC = () => {
  const [currentTourist, setCurrentTourist] = useState<TouristData | null>(null);
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>('en');
  const [settings, setSettings] = useState({
    biometricLock: true,
    autoLogout: true,
    dataEncryption: true,
    locationTracking: true,
    geoFencingAlerts: true,
    shareWithEmergencyContacts: true,
    emergencyAlerts: true,
    weatherUpdates: true,
    travelReminders: true,
  });

  // Load tourist and language on mount
  useEffect(() => {
    const savedTourist = localStorage.getItem('currentTourist');
    if (savedTourist) {
      setCurrentTourist(JSON.parse(savedTourist));
    } else {
      // Mock default tourist
      const mockTourist: TouristData = {
        id: 'user-123',
        name: 'Guest Traveler',
        email: 'guest@example.com',
        phone: '+91 12345 67890',
        digitalId: 'DIGITAL-GUEST-123',
        isVerified: true,
        emergencyContacts: [{
          id: 'ec_1',
          name: 'Emergency Contact',
          relationship: 'Contact',
          phone: '+91 98765 43210',
          isPrimary: true,
        }],
        travelHistory: [],
        status: 'safe',
        lastActive: new Date().toISOString(),
      };
      setCurrentTourist(mockTourist);
      localStorage.setItem('currentTourist', JSON.stringify(mockTourist));
    }

    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage as Language);
    }
  }, []);

  // Mock navigation

  // Mock translation function
  const t = (key: keyof typeof translations) => translations[key];

  // Mock signOut
  const signOut = () => {
    localStorage.removeItem('currentTourist');
    setCurrentTourist(null);
    console.log('User signed out');
    alert('Signed out successfully');
    navigate('/');
  };

  // Mock language change
  const handleSetLanguage = (value: Language) => {
    setLanguage(value);
    localStorage.setItem('language', value);
  };

  // Mock settings toggle
  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('settings', JSON.stringify(updated));
      return updated;
    });
  };

  const languages: { value: Language; label: string }[] = [
    { value: 'en', label: t('english') },
    { value: 'hi', label: t('hindi') },
    { value: 'ta', label: t('tamil') },
  ];

  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
          {/* Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="p-4 flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">{t('settings')}</h1>
                <p className="text-sm text-gray-500">{t('managePreferences')}</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  {t('profile')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{currentTourist?.name}</p>
                    <p className="text-sm text-gray-500">{currentTourist?.email}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <Shield className="w-3 h-3 mr-1" />
                    <span>{t('verified')}</span>
                  </Badge>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                  <QrCode className="w-8 h-8 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium">{t('digitalId')}</p>
                    <p className="text-sm text-gray-500">{currentTourist?.digitalId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  {t('securityAndPrivacy')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Biometric Lock</p>
                    <p className="text-sm text-gray-500">Use fingerprint to unlock app</p>
                  </div>
                  <Switch
                    checked={settings.biometricLock}
                    onCheckedChange={() => toggleSetting('biometricLock')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-logout</p>
                    <p className="text-sm text-gray-500">Logout after 30 minutes of inactivity</p>
                  </div>
                  <Switch
                    checked={settings.autoLogout}
                    onCheckedChange={() => toggleSetting('autoLogout')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Encryption</p>
                    <p className="text-sm text-gray-500">Encrypt all stored data</p>
                  </div>
                  <Switch checked={settings.dataEncryption} disabled />
                </div>
              </CardContent>
            </Card>

            {/* Location Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  {t('locationServices')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Location Tracking</p>
                    <p className="text-sm text-gray-500">Enable real-time location tracking</p>
                  </div>
                  <Switch
                    checked={settings.locationTracking}
                    onCheckedChange={() => toggleSetting('locationTracking')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Geo-fencing Alerts</p>
                    <p className="text-sm text-gray-500">Get alerts when entering/leaving areas</p>
                  </div>
                  <Switch
                    checked={settings.geoFencingAlerts}
                    onCheckedChange={() => toggleSetting('geoFencingAlerts')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Share with Emergency Contacts</p>
                    <p className="text-sm text-gray-500">Auto-share location during emergencies</p>
                  </div>
                  <Switch
                    checked={settings.shareWithEmergencyContacts}
                    onCheckedChange={() => toggleSetting('shareWithEmergencyContacts')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-yellow-600" />
                  {t('notifications')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Emergency Alerts</p>
                    <p className="text-sm text-gray-500">Critical safety notifications</p>
                  </div>
                  <Switch checked={settings.emergencyAlerts} disabled />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weather Updates</p>
                    <p className="text-sm text-gray-500">Weather warnings and forecasts</p>
                  </div>
                  <Switch
                    checked={settings.weatherUpdates}
                    onCheckedChange={() => toggleSetting('weatherUpdates')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Travel Reminders</p>
                    <p className="text-sm text-gray-500">Check-in and check-out reminders</p>
                  </div>
                  <Switch
                    checked={settings.travelReminders}
                    onCheckedChange={() => toggleSetting('travelReminders')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-red-600" />
                  {t('emergencyContacts')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentTourist?.emergencyContacts?.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.phone}</p>
                    </div>
                    <Badge variant="outline">
                      <span>{contact.relationship}</span>
                    </Badge>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => console.log('Add contact clicked')}
                >
                  {t('addContact')}
                </Button>
              </CardContent>
            </Card>

            {/* App Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  {t('appSettings')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('language')}</p>
                    <p className="text-sm text-gray-500">{languages.find(l => l.value === language)?.label}</p>
                  </div>
                  <Select value={language} onValueChange={handleSetLanguage}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('appVersion')}</p>
                    <p className="text-sm text-gray-500">v2.1.0</p>
                  </div>
                  <Badge variant="outline">
                    <span>{t('latest')}</span>
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => console.log('Help and support clicked')}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {t('helpAndSupport')}
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={signOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('logout')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    </ErrorBoundary>
  );
};

export default SettingsScreen;