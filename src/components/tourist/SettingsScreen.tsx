import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, User, Shield, Bell, MapPin, Phone, 
  QrCode, Lock, Globe, HelpCircle, LogOut 
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage, Language } from '@/contexts/LanguageContext';

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
                {t('verified')}
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
            {currentTourist?.emergencyContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.phone}</p>
                </div>
                <Badge variant="outline">
                  {contact.relationship}
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
              <Badge variant="outline">{t('latest')}</Badge>
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
  );
};

export default SettingsScreen;