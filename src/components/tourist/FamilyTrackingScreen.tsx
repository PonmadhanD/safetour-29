import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Users, MapPin, Share2, UserCheck, 
  Clock, Phone, MessageCircle, Map, Trash2, Plus, 
  UserPlus, LogIn 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApp } from '@/contexts/AppContext';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

// Define types for family members
interface FamilyMemberData {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  emergencyPriority: number;
  userStatus: string | null;
  status: string;
  canTrack: boolean;
  location: { lat: number; lng: number } | null;
  lastSeen: string | null;
  distance: string | null;
}

// Define props for AddFamilyMemberForm
interface AddFamilyMemberFormProps {
  onAddFamilyMember: (e: React.FormEvent, name: string, relationship: string, phone: string, email?: string) => Promise<void>;
  setShowAddForm: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
}

// Define props for Input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
}

const AddFamilyMemberForm = React.memo(({ onAddFamilyMember, setShowAddForm, loading }: AddFamilyMemberFormProps) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Card className="bg-white rounded-lg shadow-sm border border-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <UserPlus className="w-5 h-5" />
            {t('addFamilyMember')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              onAddFamilyMember(e, name, relationship, phone, email);
              setName('');
              setRelationship('');
              setPhone('');
              setEmail('');
            }}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder={t('name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={t('name')}
            />
            <input
              type="text"
              placeholder={t('relationship')}
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              disabled={loading}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={t('relationship')}
            />
            <input
              type="tel"
              placeholder={t('phoneNumber')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={t('phoneNumber')}
            />
            <input
              type="email"
              placeholder={t('emailOptional')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={t('emailOptional')}
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                {loading ? t('adding') : t('addMember')}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddForm(false)}
                disabled={loading}
              >
                {t('cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
});

const FamilyTrackingScreen: React.FC = () => {
  const { setTouristPage } = useApp();
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberData[]>([]);
  const [locationSharing, setLocationSharing] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Real-time sync for family members
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsubscribe = onSnapshot(
      doc(db, 'tourist_profiles', user.uid),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setFamilyMembers(data.emergency_contacts || []);
          setError(null);
        } else {
          setError(t('profileNotFound'));
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error syncing family members:', err);
        setError(t('failedToSyncFamilyMembers'));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, t]);

  const handleAddFamilyMember = async (
    e: React.FormEvent,
    name: string,
    relationship: string,
    phone: string,
    email?: string
  ) => {
    e.preventDefault();
    if (!user) return;
    if (!name || !relationship || !phone) {
      setError(t('fillRequiredFields'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newMember: FamilyMemberData = {
        id: `ec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        relationship,
        phone,
        email,
        emergencyPriority: 1,
        userStatus: 'safe',
        status: 'active',
        canTrack: true,
        location: null,
        lastSeen: new Date().toISOString(),
        distance: null,
      };

      const updatedMembers = [...familyMembers, newMember];
      await updateDoc(doc(db, 'tourist_profiles', user.uid), {
        emergency_contacts: updatedMembers,
      });
      setFamilyMembers(updatedMembers);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding family member:', error);
      setError(t('failedToAddFamilyMember'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFamilyMember = async (memberId: string) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const updatedMembers = familyMembers.filter(member => member.id !== memberId);
      await updateDoc(doc(db, 'tourist_profiles', user.uid), {
        emergency_contacts: updatedMembers,
      });
      setFamilyMembers(updatedMembers);
    } catch (error) {
      console.error('Error deleting family member:', error);
      setError(t('failedToDeleteFamilyMember'));
    } finally {
      setLoading(false);
    }
  };

  const handleShareLocation = async () => {
    if (!user) return;
    if (!navigator.geolocation) {
      setError(t('geolocationNotSupported'));
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          console.log('Sharing location:', {
            userId: user.uid,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            message: 'Location shared manually',
          });
          // Placeholder for actual location sharing logic
          alert(t('locationShared'));
        } catch (error) {
          console.error('Error sharing location:', error);
          setError(t('failedToShareLocation'));
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError(t('failedToGetLocation'));
        setLoading(false);
      }
    );
  };

  const handleEmergencyAlert = async () => {
    if (!user) return;
    if (!navigator.geolocation) {
      setError(t('geolocationNotSupported'));
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          console.log('Emergency alert:', {
            userId: user.uid,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            message: 'Emergency alert from family tracking',
          });
          // Placeholder for actual emergency alert logic
          alert(t('emergencyAlertSent'));
        } catch (error) {
          console.error('Error sending emergency alert:', error);
          setError(t('failedToSendEmergencyAlert'));
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError(t('failedToGetLocation'));
        setLoading(false);
      }
    );
  };

  const getStatusColor = (status?: string | null) => {
    switch (status) {
      case 'safe':
        return 'bg-green-600 text-white';
      case 'alert':
        return 'bg-yellow-600 text-white';
      case 'emergency':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  if (authLoading) {
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
          <p className="text-muted-foreground text-lg">{t('pleaseLogIn')}</p>
          <Button
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            onClick={() => console.log('Navigating to login page')}
          >
            {t('goToLogin')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-gradient-to-br from-primary-light/30 to-secondary-light/30 font-sans"
    >
      {/* Header */}
      <motion.div
        className="bg-white shadow-sm border-b sticky top-0 z-40"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="p-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTouristPage('home')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800">{t('familyTracking')}</h1>
            <p className="text-sm text-muted-foreground">{t('stayConnected')}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log('View Map clicked')}
            >
            <Map className="w-4 h-4 mr-1" />
            {t('viewMap')}
          </Button>
        </div>
        <div className="p-2 text-xs text-center text-muted-foreground">
          {t('userId')}: {user.uid}
        </div>
      </motion.div>

      <div className="p-4 space-y-6 max-w-md mx-auto">
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
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setError(null)}
                >
                  {t('dismiss')}
                </Button>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Location Sharing Control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className="bg-white rounded-lg shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Share2 className="w-5 h-5" />
                {t('locationSharing')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{t('shareMyLocation')}</p>
                  <p className="text-sm text-muted-foreground">{t('allowFamilyLocation')}</p>
                </div>
                <Switch
                  checked={locationSharing}
                  onCheckedChange={setLocationSharing}
                  aria-label={t('toggleLocationSharing')}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add New Family Member Form */}
        <AnimatePresence>
          {showAddForm && (
            <AddFamilyMemberForm
              onAddFamilyMember={handleAddFamilyMember}
              setShowAddForm={setShowAddForm}
              loading={loading}
            />
          )}
        </AnimatePresence>

        {/* Family Members List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className="bg-white rounded-lg shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-primary">
                  <Users className="w-5 h-5" />
                  {t('familyMembers')} ({familyMembers.length})
                </span>
                {!showAddForm && (
                  <Button
                    size="icon"
                    onClick={() => setShowAddForm(true)}
                    disabled={loading}
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-center text-muted-foreground p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>{t('loadingFamilyMembers')}</p>
                </div>
              ) : familyMembers.length === 0 ? (
                <div className="text-center text-muted-foreground p-8">
                  <UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>{t('noFamilyMembers')}</p>
                  <p>{t('clickToAdd')}</p>
                </div>
              ) : (
                familyMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800">{member.name}</h3>
                          <Badge className={getStatusColor(member.userStatus)}>
                            {member.userStatus || t('unknown')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{member.relationship || t('unknown')}</p>
                        <p className="text-sm text-muted-foreground">{t('status')}: {member.status}</p>
                        <p className="text-sm text-muted-foreground">{t('tracking')}: {member.canTrack ? t('enabled') : t('disabled')}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => console.log(`Calling ${member.phone}`)}
                          aria-label={t('call', { name: member.name })}
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => console.log(`Messaging ${member.name}`)}
                          aria-label={t('message', { name: member.name })}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteFamilyMember(member.id)}
                          className="text-destructive hover:text-destructive-dark"
                          disabled={loading}
                          aria-label={t('delete', { name: member.name })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{member.location ? `${member.location.lat.toFixed(4)}, ${member.location.lng.toFixed(4)}` : t('locationUnknown')}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <UserCheck className="w-4 h-4" />
                          <span>{member.distance || t('unknown')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{member.lastSeen ? new Date(member.lastSeen).toLocaleString() : t('unknown')}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Mini Map Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className="bg-white rounded-lg shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Map className="w-5 h-5" />
                {t('familyLocations')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                <div className="text-center text-muted-foreground">
                  <Map className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">{t('miniMapPlaceholder')}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => console.log('View full map')}
                  >
                    {t('viewFullMap')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Emergency Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className="bg-white rounded-lg shadow-sm border border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Phone className="w-5 h-5" />
                {t('emergencyFeatures')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-gray-300 hover:bg-gray-100"
                onClick={handleShareLocation}
                disabled={loading}
              >
                <UserCheck className="w-4 h-4 mr-2" />
                {t('sendCheckIn')}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-gray-300 hover:bg-gray-100"
                onClick={handleShareLocation}
                disabled={loading}
              >
                <Share2 className="w-4 h-4 mr-2" />
                {t('shareCurrentLocation')}
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleEmergencyAlert}
                disabled={loading}
              >
                <Phone className="w-4 h-4 mr-2" />
                {t('emergencyAlert')}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FamilyTrackingScreen;