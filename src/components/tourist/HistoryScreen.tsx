import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Clock, Calendar, Route, LogIn } from 'lucide-react';
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

// Mock travel history item type
interface TravelHistoryItem {
  id: string;
  destination: string;
  checkInTime: string;
  checkOutTime: string;
  purpose: string;
  status: string;
}

// Mock translations
const translations = {
  travelHistory: 'Travel History',
  journey: 'Your journey so far',
  destinations: 'Destinations Visited',
  statesVisited: 'States Visited',
  journeyRoute: 'Journey Route',
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
          <p className="text-gray-600 text-lg">Please log in to access your travel history</p>
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

const HistoryScreen: React.FC = () => {
  const [currentTourist, setCurrentTourist] = useState<TouristData | null>(null);
  const [travelHistory, setTravelHistory] = useState<TravelHistoryItem[]>([
    {
      id: '1',
      destination: 'Shillong, Meghalaya',
      checkInTime: '2024-01-15T10:30:00Z',
      checkOutTime: '2024-01-15T18:45:00Z',
      purpose: 'Tourism',
      status: 'completed',
    },
    {
      id: '2',
      destination: 'Cherrapunji, Meghalaya',
      checkInTime: '2024-01-14T09:15:00Z',
      checkOutTime: '2024-01-14T16:30:00Z',
      purpose: 'Sightseeing',
      status: 'completed',
    },
    {
      id: '3',
      destination: 'Guwahati, Assam',
      checkInTime: '2024-01-13T14:20:00Z',
      checkOutTime: '2024-01-13T20:15:00Z',
      purpose: 'Transit',
      status: 'completed',
    },
    {
      id: '4',
      destination: 'Kaziranga National Park, Assam',
      checkInTime: '2024-01-12T08:00:00Z',
      checkOutTime: '2024-01-12T17:30:00Z',
      purpose: 'Wildlife Safari',
      status: 'completed',
    },
  ]);

  // Load tourist and travel history on mount
  useEffect(() => {
    const savedTourist = localStorage.getItem('currentTourist');
    if (savedTourist) {
      const tourist = JSON.parse(savedTourist);
      setCurrentTourist(tourist);
      // Load travel history from tourist data or fallback to default
      const savedHistory = tourist.travelHistory || [];
      setTravelHistory(savedHistory.length > 0 ? savedHistory : travelHistory);
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
        travelHistory: travelHistory,
        status: 'safe',
        lastActive: new Date().toISOString(),
      };
      setCurrentTourist(mockTourist);
      localStorage.setItem('currentTourist', JSON.stringify(mockTourist));
    }
  }, [travelHistory]);

  // Mock navigation
  const setTouristPage = (page: string) => {
    console.log(`Navigating to page: ${page}`);
  };

  // Mock translation function
  const t = (key: keyof typeof translations) => translations[key];

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

  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
          {/* Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="p-4 flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setTouristPage('home')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">{t('travelHistory')}</h1>
                <p className="text-sm text-gray-500">{t('journey')}</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{travelHistory.length}</div>
                  <div className="text-sm text-gray-500">{t('destinations')}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">4</div>
                  <div className="text-sm text-gray-500">{t('statesVisited')}</div>
                </CardContent>
              </Card>
            </div>

            {/* Journey Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="w-5 h-5 text-blue-600" />
                  {t('journeyRoute')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-600 to-green-600"></div>
                  <div className="space-y-4">
                    {travelHistory.map((record) => (
                      <div key={record.id} className="flex items-start gap-4">
                        <div className="relative z-10 w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">{record.destination}</div>
                          <div className="text-xs text-gray-500">
                            {formatDate(record.checkInTime)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  Visit Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {travelHistory.map((record) => (
                  <div key={record.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{record.destination}</h3>
                        <p className="text-sm text-gray-500">{record.purpose}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        <span>{record.status}</span>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>Check-in</span>
                        </div>
                        <div className="font-medium">
                          {formatDate(record.checkInTime)} at {formatTime(record.checkInTime)}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>Duration</span>
                        </div>
                        <div className="font-medium">
                          {record.checkOutTime
                            ? calculateDuration(record.checkInTime, record.checkOutTime)
                            : 'Ongoing'}
                        </div>
                      </div>
                    </div>

                    {record.checkOutTime && (
                      <div className="text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>Check-out</span>
                        </div>
                        <div className="font-medium">
                          {formatDate(record.checkOutTime)} at {formatTime(record.checkOutTime)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
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

export default HistoryScreen;