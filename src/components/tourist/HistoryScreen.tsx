import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, MapPin, Clock, Calendar, Route, LogIn } from 'lucide-react';
import FloatingPanicButton from './FloatingPanicButton';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

// Travel history item type
interface TravelHistoryItem {
  id: string;
  destination: string;
  checkInTime: string;
  checkOutTime: string;
  purpose: string;
  status: string;
}

// Mock travel history data for prototyping
const mockTravelHistory: TravelHistoryItem[] = [
  {
    id: '1',
    destination: 'Shillong, Meghalaya',
    checkInTime: '2025-09-20T09:00:00Z',
    checkOutTime: '2025-09-20T17:30:00Z',
    purpose: 'Tourism',
    status: 'completed',
  },
  {
    id: '2',
    destination: 'Cherrapunji, Meghalaya',
    checkInTime: '2025-09-19T08:45:00Z',
    checkOutTime: '2025-09-19T16:15:00Z',
    purpose: 'Adventure',
    status: 'completed',
  },
  {
    id: '3',
    destination: 'Gangtok, Sikkim',
    checkInTime: '2025-09-15T11:20:00Z',
    checkOutTime: '2025-09-17T14:00:00Z',
    purpose: 'Cultural',
    status: 'completed',
  },
  {
    id: '4',
    destination: 'Guwahati, Assam',
    checkInTime: '2025-09-14T13:00:00Z',
    checkOutTime: '2025-09-14T20:45:00Z',
    purpose: 'Transit',
    status: 'completed',
  },
  {
    id: '5',
    destination: 'Kaziranga National Park, Assam',
    checkInTime: '2025-09-12T07:30:00Z',
    checkOutTime: '2025-09-12T18:00:00Z',
    purpose: 'Wildlife Safari',
    status: 'completed',
  },
  {
    id: '6',
    destination: 'Darjeeling, West Bengal',
    checkInTime: '2025-09-10T10:00:00Z',
    checkOutTime: '',
    purpose: 'Tourism',
    status: 'ongoing',
  },
];

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
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { setTouristPage } = useApp();

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
          <p className="text-muted-foreground text-lg">{t('pleaseLogInHistory')}</p>
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

const HistoryScreen: React.FC = () => {
  const { setTouristPage } = useApp();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [travelHistory, setTravelHistory] = useState<TravelHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Real-time sync for travel history with mock data fallback
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsubscribe = onSnapshot(
      doc(db, 'tourist_profiles', user.uid),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const history = data.travel_history || [];
          setTravelHistory(history.length > 0 ? history : mockTravelHistory);
          setError(null);
        } else {
          setTravelHistory(mockTravelHistory);
          setError(t('profileNotFound'));
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error syncing travel history:', err);
        setTravelHistory(mockTravelHistory);
        setError(t('failedToSyncHistory'));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, t]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDuration = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffHours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    return `${diffHours}h`;
  };

  // Calculate stats
  const destinationsVisited = travelHistory.length;
  const statesVisited = new Set(travelHistory.map(item => item.destination.split(', ')[1])).size;

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
                <Button variant="ghost" size="icon" onClick={() => setTouristPage('home')} aria-label={t('backToHome')}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{t('travelHistory')}</h1>
                <p className="text-sm text-muted-foreground">{t('journey')}</p>
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

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-card shadow-sm rounded-lg">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{destinationsVisited}</div>
                    <div className="text-sm text-muted-foreground">{t('destinations')}</div>
                  </CardContent>
                </Card>
                <Card className="bg-card shadow-sm rounded-lg">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-secondary">{statesVisited}</div>
                    <div className="text-sm text-muted-foreground">{t('statesVisited')}</div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Journey Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="bg-card shadow-sm rounded-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="w-5 h-5 text-primary" />
                    {t('journeyRoute')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center text-muted-foreground p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p>{t('loading')}</p>
                    </div>
                  ) : travelHistory.length === 0 ? (
                    <div className="text-center text-muted-foreground p-8">
                      <Route className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>{t('noTravelHistory')}</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary to-secondary"></div>
                      <div className="space-y-4">
                        {travelHistory.map((record, index) => (
                          <motion.div
                            key={record.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                            className="flex items-start gap-4"
                          >
                            <div className="relative z-10 w-3 h-3 bg-primary rounded-full mt-2"></div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-foreground">{record.destination}</div>
                              <div className="text-xs text-muted-foreground">{formatDate(record.checkInTime)}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Detailed History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="bg-card shadow-sm rounded-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-secondary" />
                    {t('visitDetails')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <div className="text-center text-muted-foreground p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p>{t('loading')}</p>
                    </div>
                  ) : travelHistory.length === 0 ? (
                    <div className="text-center text-muted-foreground p-8">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>{t('noTravelHistory')}</p>
                    </div>
                  ) : (
                    travelHistory.map((record, index) => (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground">{record.destination}</h3>
                            <p className="text-sm text-muted-foreground">{record.purpose}</p>
                          </div>
                          <Badge variant="outline" className="bg-secondary-light text-secondary">
                            <span>{record.status}</span>
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>{t('checkIn')}</span>
                            </div>
                            <div className="font-medium text-foreground">
                              {formatDate(record.checkInTime)} at {formatTime(record.checkInTime)}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{t('duration')}</span>
                            </div>
                            <div className="font-medium text-foreground">
                              {record.checkOutTime
                                ? calculateDuration(record.checkInTime, record.checkOutTime)
                                : t('ongoing')}
                            </div>
                          </div>
                        </div>
                        {record.checkOutTime && (
                          <div className="text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{t('checkOut')}</span>
                            </div>
                            <div className="font-medium text-foreground">
                              {formatDate(record.checkOutTime)} at {formatTime(record.checkOutTime)}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <FloatingPanicButton />
        </motion.div>
      </ProtectedRoute>
    </ErrorBoundary>
  );
};

export default HistoryScreen;