// SettingsScreen.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, User, Shield, Bell, MapPin, Phone, QrCode, Lock, Globe, HelpCircle, LogOut, LogIn } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage, Language } from '@/contexts/LanguageContext';

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
  const { user, loading } = useAuth();

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <LogIn className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600 text-lg">Please log in to access your settings</p>
          <a
            href="/login"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const SettingsScreen: React.FC = () => {
  const { setTouristPage, currentTourist } = useApp();
  const { signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const languages: { value: Language; label: string }[] = [
    { value: 'en', label: t('english') },
    { value: 'hi', label: t('hindi') },
    { value: 'ta', label: t('tamil') },
  ];

  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-primary-light/30 to-secondary-light/30">
          {/* Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="p-4 flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTouristPage('home')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">{t('settings')}</h1>
                <p className="text-sm text-muted-foreground">{t('managePreferences')}</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  {t('profile')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{currentTourist?.name}</p>
                    <p className="text-sm text-muted-foreground">{currentTourist?.email}</p>
                  </div>
                  <Badge className="bg-success-light text-success">
                    <Shield className="w-3 h-3 mr-1" />
                    <span>{t('verified')}</span>
                  </Badge>
                </div>

                <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                  <QrCode className="w-8 h-8 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{t('digitalId')}</p>
                    <p className="text-sm text-muted-foreground">{currentTourist?.digitalId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  {t('securityAndPrivacy')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Biometric Lock</p>
                    <p className="text-sm text-muted-foreground">Use fingerprint to unlock app</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-logout</p>
                    <p className="text-sm text-muted-foreground">Logout after 30 minutes of inactivity</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Encryption</p>
                    <p className="text-sm text-muted-foreground">Encrypt all stored data</p>
                  </div>
                  <Switch defaultChecked disabled />
                </div>
              </CardContent>
            </Card>

            {/* Location Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-secondary" />
                  {t('locationServices')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Location Tracking</p>
                    <p className="text-sm text-muted-foreground">Enable real-time location tracking</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Geo-fencing Alerts</p>
                    <p className="text-sm text-muted-foreground">Get alerts when entering/leaving areas</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Share with Emergency Contacts</p>
                    <p className="text-sm text-muted-foreground">Auto-share location during emergencies</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-warning" />
                  {t('notifications')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Emergency Alerts</p>
                    <p className="text-sm text-muted-foreground">Critical safety notifications</p>
                  </div>
                  <Switch defaultChecked disabled />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weather Updates</p>
                    <p className="text-sm text-muted-foreground">Weather warnings and forecasts</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Travel Reminders</p>
                    <p className="text-sm text-muted-foreground">Check-in and check-out reminders</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-emergency" />
                  {t('emergencyContacts')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentTourist?.emergencyContacts?.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                    </div>
                    <Badge variant="outline">
                      <span>{contact.relationship}</span>
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  {t('addContact')}
                </Button>
              </CardContent>
            </Card>

            {/* App Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  {t('appSettings')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('language')}</p>
                    <p className="text-sm text-muted-foreground">{languages.find(l => l.value === language)?.label}</p>
                  </div>
                  <Select value={language} onValueChange={setLanguage}>
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
                    <p className="text-sm text-muted-foreground">v2.1.0</p>
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
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {t('helpAndSupport')}
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start text-emergency hover:text-emergency"
                  onClick={async () => {
                    try {
                      await signOut();
                      setTouristPage('home');
                    } catch (error) {
                      console.error('Logout error:', error);
                    }
                  }}
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