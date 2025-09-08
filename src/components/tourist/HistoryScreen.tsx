import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Clock, Calendar, Route } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const HistoryScreen: React.FC = () => {
  const { setTouristPage } = useApp();

  const travelHistory = [
    {
      id: '1',
      destination: 'Shillong, Meghalaya',
      checkInTime: '2024-01-15T10:30:00Z',
      checkOutTime: '2024-01-15T18:45:00Z',
      purpose: 'Tourism',
      status: 'completed'
    },
    {
      id: '2',
      destination: 'Cherrapunji, Meghalaya',
      checkInTime: '2024-01-14T09:15:00Z',
      checkOutTime: '2024-01-14T16:30:00Z',
      purpose: 'Sightseeing',
      status: 'completed'
    },
    {
      id: '3',
      destination: 'Guwahati, Assam',
      checkInTime: '2024-01-13T14:20:00Z',
      checkOutTime: '2024-01-13T20:15:00Z',
      purpose: 'Transit',
      status: 'completed'
    },
    {
      id: '4',
      destination: 'Kaziranga National Park, Assam',
      checkInTime: '2024-01-12T08:00:00Z',
      checkOutTime: '2024-01-12T17:30:00Z',
      purpose: 'Wildlife Safari',
      status: 'completed'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffHours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    return `${diffHours}h`;
  };

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
            <h1 className="text-xl font-bold">Travel History</h1>
            <p className="text-sm text-muted-foreground">Your journey across Northeast India</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{travelHistory.length}</div>
              <div className="text-sm text-muted-foreground">Destinations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary">4</div>
              <div className="text-sm text-muted-foreground">States Visited</div>
            </CardContent>
          </Card>
        </div>

        {/* Journey Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="w-5 h-5 text-primary" />
              Journey Route
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary to-secondary"></div>
              <div className="space-y-4">
                {travelHistory.map((record, index) => (
                  <div key={record.id} className="flex items-start gap-4">
                    <div className="relative z-10 w-3 h-3 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{record.destination}</div>
                      <div className="text-xs text-muted-foreground">
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
              <Clock className="w-5 h-5 text-secondary" />
              Visit Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {travelHistory.map((record) => (
              <div key={record.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{record.destination}</h3>
                    <p className="text-sm text-muted-foreground">{record.purpose}</p>
                  </div>
                  <Badge variant="outline" className="bg-success-light text-success">
                    {record.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Check-in</span>
                    </div>
                    <div className="font-medium">
                      {formatDate(record.checkInTime)} at {formatTime(record.checkInTime)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Duration</span>
                    </div>
                    <div className="font-medium">
                      {record.checkOutTime ? calculateDuration(record.checkInTime, record.checkOutTime) : 'Ongoing'}
                    </div>
                  </div>
                </div>
                
                {record.checkOutTime && (
                  <div className="text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
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
    </div>
  );
};

export default HistoryScreen;