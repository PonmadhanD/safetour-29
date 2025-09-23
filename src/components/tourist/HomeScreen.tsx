import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, MapPin, Settings, Bell, Users, Map, AlertTriangle, CheckCircle, Clock, Phone, LogOut, LogIn } from 'lucide-react';
import FloatingPanicButton from './FloatingPanicButton';

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
  welcomeBack: 'Welcome Back',
  safetyScore: 'Safety Score',
  quickActions: 'Quick Actions',
  panicButton: 'Panic Button',
  viewMap: 'View Map',
  familyTracking: 'Family Tracking',
  recentAlerts: 'Recent Alerts',
  currentLocation: 'Current Location',
  recentActivity: 'Recent Activity',
  signOut: 'Sign Out',
};

// Mock generateDigitalId function
const generateDigitalId = async (data: { fullName: string; email: string; phone: string }) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async
  return {
    userId: `user-${Date.now()}`,
    digitalId: `DIGITAL-${data.fullName.replace(/\s+/g, '').toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
    isVerified: true,
  };
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
          <p className="text-gray-600 text-lg">Please log in to access your dashboard</p>
          <Button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => {
              console.log('Navigating to login page');
              // In a real app, navigate to login
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

const HomeScreen: React.FC = () => {
  const [currentTourist, setCurrentTourist] = useState<TouristData | null>(null);
  const navigate = useNavigate();
  const [activeAlerts] = useState([
    {
      id: '1',
      type: 'weather',
      title: 'Heavy Rain Alert',
      message: 'Heavy rainfall expected in Shillong area',
      severity: 'medium',
    },
    {
      id: '2',
      type: 'security',
      title: 'Travel Advisory',
      message: 'Avoid remote areas after 8 PM',
      severity: 'low',
    },
  ]);

  // Load tourist on mount
  useEffect(() => {
    const savedTourist = localStorage.getItem('currentTourist');
    if (savedTourist) {
      setCurrentTourist(JSON.parse(savedTourist));
    } else {
      // Mock default tourist if none exists
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
  }, []);

  // Mock navigation and panic button functions

  // const setEmergencyActive = (active: boolean) => {
  //   console.log(`Emergency active: ${active}`);
  //   if (active) {
  //     alert('Panic button activated (offline mode)');
  //   }
  // };

  const signOut = () => {
    localStorage.removeItem('currentTourist');
    setCurrentTourist(null);
    console.log('User signed out');
    alert('Signed out successfully');
  };

  // Mock translation function
  const t = (key: keyof typeof translations) => translations[key];

  // Calculate safety score (mock logic)
  const getSafetyScore = () => {
    const score = 85; // Mock score
    if (score >= 80) return { score, level: 'safe', color: 'green' };
    if (score >= 60) return { score, level: 'moderate', color: 'yellow' };
    return { score, level: 'risky', color: 'red' };
  };

  const safetyData = getSafetyScore();

  function setTouristPage(page: string): void {
    if (page === 'settings') {
      navigate('/settings');
    }
    // Add more pages as needed
  }

  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 text-gray-900 relative">
          {/* Header */}
          <div className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-40">
            <div className="p-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {t('welcomeBack')}
                </h1>
                <p className="text-sm text-gray-500">{currentTourist?.name || 'Traveler'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`bg-${safetyData.color}-100 text-${safetyData.color}-800`}>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  <span>{safetyData.level}</span>
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTouristPage('settings')}
                >
                  <Settings className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={signOut}
                  title={t('signOut')}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-6 pb-24">
            {/* Tourist Safety Score Card */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className={`bg-${safetyData.color}-500 text-white p-6`}>
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
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>Shillong, Meghalaya • Safe Zone</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions - 3 Main Buttons */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">{t('quickActions')}</h3>

              {/* Emergency Button */}
              <Button
                size="lg"
                className="w-full h-16 bg-red-600 hover:bg-red-700 text-white shadow-lg rounded-2xl"
                onClick={() => {
                  // setEmergencyActive(true);
                  navigate('/panic');
                }}
              >
                <Phone className="w-6 h-6 mr-3" />
                <div className="text-left">
                  <div className="font-bold">🚨 {t('panicButton')}</div>
                  <div className="text-sm opacity-90">Emergency assistance</div>
                </div>
              </Button>

              {/* Map & Safe Zones */}
              <Link
                to="/map"
                className="w-full"
              >
                <Button
                variant="outline"
                size="lg"
                  className="w-full h-16 bg-white hover:bg-blue-50 rounded-2xl"
              >
                <Map className="w-6 h-6 mr-3 text-blue-600" />
                <div className="text-left">
                  <div className="font-bold">🗺️ {t('viewMap')}</div>
                  <div className="text-sm text-gray-500">Navigate safely</div>
                </div>
              </Button>
              </Link>

              {/* Family Tracking */}
              <Link
                to="/family"
                className="w-full"
              >
                <Button
                variant="outline"
                size="lg"
                  className="w-full h-16 bg-white hover:bg-green-50 rounded-2xl"
              >
                <Users className="w-6 h-6 mr-3 text-green-600" />
                <div className="text-left">
                  <div className="font-bold">👨‍👩‍👧 {t('familyTracking')}</div>
                  <div className="text-sm text-gray-500">Stay connected</div>
                </div>
              </Button>
              </Link>
            </div>

            {/* Recent Alerts / Notifications */}
            {activeAlerts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-yellow-600" />
                    {t('recentAlerts')} ({activeAlerts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-1" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{alert.title}</p>
                        <p className="text-xs text-gray-500">{alert.message}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        <span>{alert.severity}</span>
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Current Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  {t('currentLocation')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">Shillong, Meghalaya</p>
                  <p className="text-sm text-gray-500">Police Bazaar Area</p>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Shield className="w-4 h-4" />
                    <span>Safe Zone</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  {t('recentActivity')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Checked in at Police Bazaar</span>
                  <span className="text-gray-500 ml-auto">2 hours ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Digital ID verified</span>
                  <span className="text-gray-500 ml-auto">5 hours ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Entered Meghalaya</span>
                  <span className="text-gray-500 ml-auto">1 day ago</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Floating Panic Button */}
          <FloatingPanicButton />
        </div>
      </ProtectedRoute>
    </ErrorBoundary>
  );
};

export default HomeScreen;