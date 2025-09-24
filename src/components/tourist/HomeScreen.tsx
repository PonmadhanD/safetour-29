import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, MapPin, Settings, Bell, Users, Map, AlertTriangle, CheckCircle, LogOut, Clock, AlertCircle, Share2 } from 'lucide-react';
import FloatingPanicButton from './FloatingPanicButton';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const HomeScreen: React.FC = () => {
  const { currentTourist, setTouristPage } = useApp();
  const { signOut } = useAuth();
  const { t } = useLanguage();

  const handleSignOut = async () => {
    await signOut();
    // The AppContext will handle the user state change
  };

  // Enhanced mock data for demonstration
  const safetyData = { score: 92, level: 'excellent', color: 'green' };
  const activeAlerts = [
    {
      id: '1',
      type: 'weather',
      title: 'Light Rain Expected',
      message: 'Intermittent showers in Shillong; carry an umbrella',
      severity: 'low',
    },
    {
      id: '2',
      type: 'traffic',
      title: 'Road Construction',
      message: 'Delays expected on NH-40; plan alternative routes',
      severity: 'medium',
    },
    {
      id: '3',
      type: 'health',
      title: 'Air Quality Advisory',
      message: 'Moderate AQI; sensitive groups should limit outdoor activities',
      severity: 'low',
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'checkin',
      title: 'Checked in at Police Bazaar',
      time: '2 hours ago',
      icon: MapPin,
      color: 'blue',
    },
    {
      id: '2',
      type: 'verification',
      title: 'Digital ID verified',
      time: '5 hours ago',
      icon: Shield,
      color: 'green',
    },
    {
      id: '3',
      type: 'alert',
      title: 'Received weather alert',
      time: '8 hours ago',
      icon: AlertCircle,
      color: 'yellow',
    },
    {
      id: '4',
      type: 'location',
      title: 'Shared location with family',
      time: '1 day ago',
      icon: Share2,
      color: 'purple',
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-gradient-to-br from-primary-light/30 to-secondary-light/30 text-foreground relative"
    >
      {/* Header */}
      <motion.div 
        className="bg-card/70 backdrop-blur-sm shadow-sm border-b sticky top-0 z-40"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('welcomeBack')}</h1>
            <p className="text-sm text-muted-foreground">{currentTourist?.name || t('traveler')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`bg-${safetyData.color}-100 text-${safetyData.color}-800`}>
              <CheckCircle className="w-3 h-3 mr-1" />
              <span>{safetyData.level}</span>
            </Badge>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTouristPage('settings')}
              >
                <Settings className="w-4 h-4" />
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
                onClick={handleSignOut}
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="p-4 space-y-6 pb-24 max-w-md mx-auto">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden bg-card shadow-sm rounded-lg">
              <CardContent className="p-0">
                <div className={`bg-${safetyData.color}-500 text-${safetyData.color}-foreground p-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">{t('safetyScore')}</h2>
                      <p className="text-sm opacity-90">Your current safety rating</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{safetyData.score}</div>
                      <div className="text-sm opacity-90">{safetyData.level.toUpperCase()}</div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Shillong, Meghalaya • Safe Zone</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Button
                size="lg"
                className="w-full h-16 bg-emergency hover:bg-emergency-dark text-white shadow-md rounded-xl flex items-center justify-start px-4"
                onClick={() => setTouristPage('panic')}
              >
                <AlertTriangle className="w-6 h-6 mr-3" />
                <div className="text-left">
                  <div className="font-bold">Panic Button</div>
                  <div className="text-sm opacity-90">Emergency assistance</div>
                </div>
              </Button>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Button
                variant="outline"
                size="lg"
                className="w-full h-16 bg-card hover:bg-primary-light/50 rounded-xl flex items-center justify-start px-4 border-gray-200"
                onClick={() => setTouristPage('map')}
              >
                <Map className="w-6 h-6 mr-3 text-primary" />
                <div className="text-left">
                  <div className="font-bold">View Map</div>
                  <div className="text-sm text-muted-foreground">Navigate safely</div>
                </div>
              </Button>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Button
                variant="outline"
                size="lg"
                className="w-full h-16 bg-card hover:bg-secondary-light/50 rounded-xl flex items-center justify-start px-4 border-gray-200"
                onClick={() => setTouristPage('familyTracking')}
              >
                <Users className="w-6 h-6 mr-3 text-secondary" />
                <div className="text-left">
                  <div className="font-bold">Family Tracking</div>
                  <div className="text-sm text-muted-foreground">Stay connected</div>
                </div>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.3 }}
          whileHover={{ y: -5 }}
        >
          {activeAlerts.length > 0 && (
            <Card className="overflow-hidden bg-card shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-warning" />
                  Recent Alerts ({activeAlerts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-start gap-3 p-3 bg-warning-light/50 rounded-lg"
                  >
                    <AlertTriangle className="w-4 h-4 text-warning mt-1" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {alert.severity}
                    </Badge>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.4 }}
          whileHover={{ y: -5 }}
        >
          <Card className="overflow-hidden bg-card shadow-sm rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-secondary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <activity.icon className={`w-4 h-4 text-${activity.color}-600 mt-1`} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <FloatingPanicButton />
    </motion.div>
  );
};

export default HomeScreen;