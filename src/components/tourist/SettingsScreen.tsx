import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Shield, Bell, MapPin, Phone, QrCode, Lock, Globe, HelpCircle, LogOut, LogIn, Trash2, Edit } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

type Language = 'en' | 'hi' | 'ta';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

// Custom logger to suppress console errors in production
const logError = (message: string, error: unknown) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(message, error);
  }
  // Errors are shown in UI via Alert, not console
};

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
        <div className="p-4 text-center text-destructive">
          <h2>somethingWentWrong</h2>
          <p>tryRefreshing</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const { setTouristPage } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light/30 to-secondary-light/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light/30 to-secondary-light/30">
        <div className="text-center">
          <LogIn className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground text-lg">{t('pleaseLogInSettings')}</p>
          <Button
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            onClick={() => setTouristPage('digitalId')}
          >
            {t('goToLogin')}
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const SettingsScreen: React.FC = () => {
  const { setTouristPage, currentTourist } = useApp();
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
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
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(currentTourist?.emergencyContacts || []);
  const [error, setError] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '', isPrimary: false });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Real-time sync for settings and emergency contacts
  useEffect(() => {
    if (!user) return;

    const settingsUnsubscribe = onSnapshot(
      doc(db, 'user_settings', user.uid),
      (snapshot) => {
        if (snapshot.exists()) {
          setSettings(snapshot.data() as typeof settings);
        } else {
          const defaultSettings = {
            biometricLock: true,
            autoLogout: true,
            dataEncryption: true,
            locationTracking: true,
            geoFencingAlerts: true,
            shareWithEmergencyContacts: true,
            emergencyAlerts: true,
            weatherUpdates: true,
            travelReminders: true,
          };
          setSettings(defaultSettings);
          updateDoc(doc(db, 'user_settings', user.uid), defaultSettings).catch((err) => {
            logError('Error initializing settings:', err);
            setError(t('failedToInitSettings'));
          });
        }
      },
      (err) => {
        logError('Error syncing settings:', err);
        setError(t('failedToSyncSettings'));
      }
    );

    const contactsUnsubscribe = onSnapshot(
      doc(db, 'tourist_profiles', user.uid),
      (doc) => {
        if (doc.exists()) {
          const contacts = doc.data().emergency_contacts || [];
          setEmergencyContacts(contacts.length > 0 ? contacts : [
            {
              id: 'ec_1',
              name: 'John Doe',
              phone: '+91 98765 43210',
              relationship: 'Friend',
              isPrimary: true,
            },
            {
              id: 'ec_2',
              name: 'Jane Smith',
              phone: '+91 87654 32109',
              relationship: 'Family',
              isPrimary: false,
            },
          ]);
        } else {
          setEmergencyContacts([
            {
              id: 'ec_1',
              name: 'John Doe',
              phone: '+91 98765 43210',
              relationship: 'Friend',
              isPrimary: true,
            },
            {
              id: 'ec_2',
              name: 'Jane Smith',
              phone: '+91 87654 32109',
              relationship: 'Family',
              isPrimary: false,
            },
          ]);
          setError(t('profileNotFound'));
        }
      },
      (err) => {
        logError('Error syncing emergency contacts:', err);
        setError(t('failedToSyncContacts'));
      }
    );

    return () => {
      settingsUnsubscribe();
      contactsUnsubscribe();
    };
  }, [user, t]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setTouristPage('home');
      setError(null);
    } catch (err) {
      logError('Logout error:', err);
      setError(t('failedToSignOut'));
    }
  };

  const toggleSetting = async (key: keyof typeof settings) => {
    if (!user) return;
    const updatedSettings = { ...settings, [key]: !settings[key] };
    setSettings(updatedSettings);
    try {
      await updateDoc(doc(db, 'user_settings', user.uid), updatedSettings);
      setError(null);
    } catch (err) {
      logError('Error saving setting:', err);
      setError(t('failedToSaveSetting'));
    }
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setNewContact({ name: '', phone: '', relationship: '', isPrimary: false });
    setIsContactModalOpen(true);
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setNewContact({ ...contact });
    setIsContactModalOpen(true);
  };

  const handleDeleteContact = async (id: string) => {
    if (!user) return;
    const updatedContacts = emergencyContacts.filter(contact => contact.id !== id);
    setEmergencyContacts(updatedContacts);
    try {
      await updateDoc(doc(db, 'tourist_profiles', user.uid), { emergency_contacts: updatedContacts });
      setError(null);
      setDeleteConfirmId(null);
    } catch (err) {
      logError('Error deleting contact:', err);
      setError(t('failedToDeleteContact'));
    }
  };

  const handleSaveContact = async () => {
    if (!user) return;
    if (!newContact.name || !newContact.phone) {
      setError(t('contactRequiredFields'));
      return;
    }
    if (!/^\+?[1-9]\d{1,14}$/.test(newContact.phone)) {
      setError(t('invalidPhone'));
      return;
    }

    let updatedContacts: EmergencyContact[];
    if (editingContact) {
      updatedContacts = emergencyContacts.map(contact =>
        contact.id === editingContact.id ? { ...newContact, id: contact.id } : contact
      );
    } else {
      updatedContacts = [...emergencyContacts, { ...newContact, id: `ec_${Date.now()}` }];
    }

    setEmergencyContacts(updatedContacts);
    try {
      await updateDoc(doc(db, 'tourist_profiles', user.uid), { emergency_contacts: updatedContacts });
      setError(null);
      setIsContactModalOpen(false);
    } catch (err) {
      logError('Error saving contact:', err);
      setError(t('failedToSaveContact'));
    }
  };

  const languages: { value: Language; label: string }[] = [
    { value: 'en', label: t('english') },
    { value: 'hi', label: t('hindi') },
    { value: 'ta', label: t('tamil') },
  ];

  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="min-h-screen bg-gradient-to-br from-primary-light/30 to-secondary-light/30"
        >
          {/* Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-card/70 backdrop-blur-sm shadow-sm border-b sticky top-0 z-40"
          >
            <div className="p-4 flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTouristPage('home')}
                  aria-label={t('backToHome')}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{t('settings')}</h1>
                <p className="text-sm text-muted-foreground">{t('managePreferences')}</p>
              </div>
            </div>
          </motion.div>

          <div className="p-4 space-y-6 max-w-md mx-auto">
            {/* Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <Alert className="border-destructive">
                    <AlertDescription>{error}</AlertDescription>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setError(null)}
                      >
                        {t('dismiss')}
                      </Button>
                    </motion.div>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="bg-card shadow-sm rounded-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    {t('profile')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{currentTourist?.name || 'Guest'}</p>
                      <p className="text-sm text-muted-foreground">{currentTourist?.email || 'guest@example.com'}</p>
                    </div>
                    <Badge className="bg-success-light text-success">
                      <Shield className="w-3 h-3 mr-1" />
                      <span>{t('verified')}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <QrCode className="w-8 h-8 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">{t('digitalId')}</p>
                      <p className="text-sm text-muted-foreground">{currentTourist?.digitalId || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Security Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="bg-card shadow-sm rounded-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    {t('securityAndPrivacy')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('biometricLock')}</p>
                      <p className="text-sm text-muted-foreground">{t('biometricLockDesc')}</p>
                    </div>
                    <Switch
                      checked={settings.biometricLock}
                      onCheckedChange={() => toggleSetting('biometricLock')}
                      aria-label={t('toggleBiometricLock')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('autoLogout')}</p>
                      <p className="text-sm text-muted-foreground">{t('autoLogoutDesc')}</p>
                    </div>
                    <Switch
                      checked={settings.autoLogout}
                      onCheckedChange={() => toggleSetting('autoLogout')}
                      aria-label={t('toggleAutoLogout')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('dataEncryption')}</p>
                      <p className="text-sm text-muted-foreground">{t('dataEncryptionDesc')}</p>
                    </div>
                    <Switch checked={settings.dataEncryption} disabled aria-label={t('dataEncryption')} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Location Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="bg-card shadow-sm rounded-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-secondary" />
                    {t('locationServices')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('locationTracking')}</p>
                      <p className="text-sm text-muted-foreground">{t('locationTrackingDesc')}</p>
                    </div>
                    <Switch
                      checked={settings.locationTracking}
                      onCheckedChange={() => toggleSetting('locationTracking')}
                      aria-label={t('toggleLocationTracking')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('geoFencingAlerts')}</p>
                      <p className="text-sm text-muted-foreground">{t('geoFencingAlertsDesc')}</p>
                    </div>
                    <Switch
                      checked={settings.geoFencingAlerts}
                      onCheckedChange={() => toggleSetting('geoFencingAlerts')}
                      aria-label={t('toggleGeoFencingAlerts')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('shareWithEmergencyContacts')}</p>
                      <p className="text-sm text-muted-foreground">{t('shareWithEmergencyContactsDesc')}</p>
                    </div>
                    <Switch
                      checked={settings.shareWithEmergencyContacts}
                      onCheckedChange={() => toggleSetting('shareWithEmergencyContacts')}
                      aria-label={t('toggleShareWithEmergencyContacts')}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.4 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="bg-card shadow-sm rounded-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-warning" />
                    {t('notifications')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('emergencyAlerts')}</p>
                      <p className="text-sm text-muted-foreground">{t('emergencyAlertsDesc')}</p>
                    </div>
                    <Switch checked={settings.emergencyAlerts} disabled aria-label={t('emergencyAlerts')} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('weatherUpdates')}</p>
                      <p className="text-sm text-muted-foreground">{t('weatherUpdatesDesc')}</p>
                    </div>
                    <Switch
                      checked={settings.weatherUpdates}
                      onCheckedChange={() => toggleSetting('weatherUpdates')}
                      aria-label={t('toggleWeatherUpdates')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('travelReminders')}</p>
                      <p className="text-sm text-muted-foreground">{t('travelRemindersDesc')}</p>
                    </div>
                    <Switch
                      checked={settings.travelReminders}
                      onCheckedChange={() => toggleSetting('travelReminders')}
                      aria-label={t('toggleTravelReminders')}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Emergency Contacts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="bg-card shadow-sm rounded-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-emergency" />
                    {t('emergencyContacts')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {emergencyContacts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t('noEmergencyContacts')}</p>
                  ) : (
                    emergencyContacts.map((contact, index) => (
                      <motion.div
                        key={contact.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-foreground">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.phone}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            <span>{contact.relationship}</span>
                          </Badge>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditContact(contact)}
                              aria-label={t('editContact', { name: contact.name })}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteConfirmId(contact.id)}
                              aria-label={t('deleteContact', { name: contact.name })}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))
                  )}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Button variant="outline" className="w-full" onClick={handleAddContact}>
                      {t('addContact')}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Delete Confirmation Dialog */}
            <AnimatePresence>
              {deleteConfirmId && (
                <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
                  <DialogContent className="bg-card">
                    <DialogHeader>
                      <DialogTitle>{t('confirmDeleteContact')}</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">{t('deleteContactConfirm')}</p>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteConfirmId(null)}
                      >
                        {t('cancel')}
                      </Button>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteContact(deleteConfirmId)}
                        >
                          {t('delete')}
                        </Button>
                      </motion.div>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </AnimatePresence>

            {/* Add/Edit Contact Modal */}
            <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
              <DialogContent className="bg-card">
                <DialogHeader>
                  <DialogTitle>{editingContact ? t('editContactTitle') : t('addContactTitle')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">{t('name')}</Label>
                    <Input
                      id="name"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      placeholder={t('enterName')}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t('phone')}</Label>
                    <Input
                      id="phone"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      placeholder="+91 12345 67890"
                      type="tel"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="relationship">{t('relationship')}</Label>
                    <Input
                      id="relationship"
                      value={newContact.relationship}
                      onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                      placeholder={t('enterRelationship')}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="isPrimary"
                      checked={newContact.isPrimary}
                      onCheckedChange={(checked) => setNewContact({ ...newContact, isPrimary: checked })}
                      aria-label={t('togglePrimaryContact')}
                    />
                    <Label htmlFor="isPrimary">{t('primaryContact')}</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsContactModalOpen(false)}
                  >
                    {t('cancel')}
                  </Button>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Button onClick={handleSaveContact}>
                      {t('save')}
                    </Button>
                  </motion.div>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* App Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.6 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="bg-card shadow-sm rounded-lg">
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
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.7 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="bg-card shadow-sm rounded-lg">
                <CardContent className="p-4 space-y-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Button variant="outline" className="w-full justify-start">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      {t('helpAndSupport')}
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start text-destructive hover:text-destructive-dark"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('logout')}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </ProtectedRoute>
    </ErrorBoundary>
  );
};

export default SettingsScreen;