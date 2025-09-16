import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, AlertTriangle, Shield, Activity, Phone, MapPin } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Tourist } from '@/types';
import MapView from '@/components/MapView';

// Mock tourist data
const mockTourists: Tourist[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91-9876543210',
    digitalId: 'TID001',
    isVerified: true,
    currentLocation: {
      lat: 25.5788,
      lng: 91.8933,
      address: 'Police Bazar, Shillong, Meghalaya, India'
    },
    emergencyContacts: [
      { name: 'Mary Doe', phone: '+91-9988776655', relationship: 'Wife' }
    ],
    travelHistory: [
      {
        location: { lat: 25.5780, lng: 91.8900, address: 'Ward Lake, Shillong' },
        timestamp: '2024-01-07T14:00:00Z'
      }
    ],
    status: 'safe',
    lastActive: '2024-01-08T10:30:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+91-9876543211',
    digitalId: 'TID002',
    isVerified: true,
    currentLocation: {
      lat: 25.5800,
      lng: 91.8950,
      address: 'Laitumkhrah, Shillong, Meghalaya, India'
    },
    emergencyContacts: [
      { name: 'Peter Smith', phone: '+91-9988776656', relationship: 'Husband' }
    ],
    travelHistory: [
      {
        location: { lat: 25.5810, lng: 91.8960, address: 'Don Bosco Square, Shillong' },
        timestamp: '2024-01-07T16:15:00Z'
      }
    ],
    status: 'alert', // Could be an SOS or entered a caution zone
    lastActive: '2024-01-08T10:25:00Z'
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+91-9876543212',
    digitalId: 'TID003',
    isVerified: false, // Example of unverified tourist
    currentLocation: {
      lat: 25.5680,
      lng: 91.8820,
      address: 'Elephant Falls, Shillong, Meghalaya, India'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T10:10:00Z'
  },
  {
    id: '4',
    name: 'Robert Brown',
    email: 'robert@example.com',
    phone: '+91-9876543213',
    digitalId: 'TID004',
    isVerified: true,
    currentLocation: {
      lat: 25.5750,
      lng: 91.8900,
      address: 'Shillong Peak, Shillong, Meghalaya, India'
    },
    emergencyContacts: [
      { name: 'Sarah Brown', phone: '+91-9988776657', relationship: 'Sister' },
      { name: 'Emergency Services', phone: '112', relationship: 'General Emergency' }
    ],
    travelHistory: [
      {
        location: { lat: 25.5700, lng: 91.8850, address: 'Botanical Garden, Shillong' },
        timestamp: '2024-01-07T09:45:00Z'
      },
      {
        location: { lat: 25.5720, lng: 91.8880, address: 'Air Force Museum, Shillong' },
        timestamp: '2024-01-07T11:30:00Z'
      }
    ],
    status: 'sos', // Urgent SOS signal
    lastActive: '2024-01-08T10:05:00Z'
  },
  {
    id: '5',
    name: 'Emily White',
    email: 'emily@example.com',
    phone: '+91-9876543214',
    digitalId: 'TID005',
    isVerified: true,
    currentLocation: {
      lat: 25.5705,
      lng: 91.9020,
      address: 'Don Bosco Museum, Shillong, Meghalaya, India'
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'offline', // Example of a tourist whose app might be offline
    lastActive: '2024-01-08T09:50:00Z' // Last known active
  },
  {
    id: '6',
    name: 'Michael Green',
    email: 'michael@example.com',
    phone: '+91-9876543215',
    digitalId: 'TID006',
    isVerified: true,
    currentLocation: {
      lat: 25.5840,
      lng: 91.8850,
      address: 'Golf Course, Shillong, Meghalaya, India'
    },
    emergencyContacts: [
      { name: 'David Green', phone: '+91-9988776658', relationship: 'Brother' }
    ],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T10:40:00Z'
  },
  {
    id: '7',
    name: 'Sophia Lee',
    email: 'sophia@example.com',
    phone: '+91-9876543216',
    digitalId: 'TID007',
    isVerified: true,
    currentLocation: {
      lat: 25.5600,
      lng: 91.9050,
      address: 'Mawphlang Sacred Forest, Meghalaya, India' // Outside Shillong city, but still Meghalaya
    },
    emergencyContacts: [],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T10:15:00Z'
  },
  {
    id: '8',
    name: 'David Kim',
    email: 'david@example.com',
    phone: '+91-9876543217',
    digitalId: 'TID008',
    isVerified: true,
    currentLocation: {
      lat: 25.5730,
      lng: 91.8800,
      address: 'Lady Hydari Park, Shillong, Meghalaya, India'
    },
    emergencyContacts: [
      { name: 'Anna Kim', phone: '+91-9988776659', relationship: 'Mother' }
    ],
    travelHistory: [],
    status: 'safe',
    lastActive: '2024-01-08T10:00:00Z'
  }
];


const MapDashboard: React.FC = () => {
  const { setAuthorityPage } = useApp();
  const [selectedTourist, setSelectedTourist] = useState<Tourist | null>(null);
  const [tourists] = useState<Tourist[]>(mockTourists);

  const handleTouristSelect = (tourist: Tourist) => {
    setSelectedTourist(tourist);
  };

  const safeCount = tourists.filter(t => t.status === 'safe').length;
  const alertCount = tourists.filter(t => t.status === 'alert').length;
  const emergencyCount = tourists.filter(t => t.status === 'emergency').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Authority Dashboard</h1>
              <p className="text-sm text-muted-foreground">Real-time tourist monitoring</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAuthorityPage('alerts')}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Alerts
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{safeCount}</p>
                <p className="text-xs text-muted-foreground">Safe</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{alertCount}</p>
                <p className="text-xs text-muted-foreground">Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emergency/10 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-emergency" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emergency">{emergencyCount}</p>
                <p className="text-xs text-muted-foreground">Emergency</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{tourists.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map and Tourist Details */}
      <div className="p-4 grid lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="h-[500px]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Live Tourist Map
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[420px]">
              <MapView
                mode="authority"
                tourists={tourists}
                onTouristSelect={handleTouristSelect}
                showPanicButton={false}
                className="w-full h-full rounded-b-lg"
              />
            </CardContent>
          </Card>
        </div>

        {/* Tourist Details */}
        <div className="space-y-4">
          {selectedTourist ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Tourist Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedTourist.name}</h3>
                  <p className="text-sm text-muted-foreground">ID: {selectedTourist.digitalId}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={
                    selectedTourist.status === 'safe' ? 'default' :
                    selectedTourist.status === 'alert' ? 'secondary' : 'destructive'
                  }>
                    {selectedTourist.status.toUpperCase()}
                  </Badge>
                  {selectedTourist.isVerified && (
                    <Badge variant="outline">Verified</Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{selectedTourist.phone}</p>
                  </div>
                  
                  {selectedTourist.currentLocation && (
                    <div>
                      <p className="text-sm font-medium">Current Location</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedTourist.currentLocation.address}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedTourist.currentLocation.lat.toFixed(4)}, {selectedTourist.currentLocation.lng.toFixed(4)}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium">Last Active</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedTourist.lastActive).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button size="sm" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Tourist
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Activity className="w-4 h-4 mr-2" />
                    View History
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Select a Tourist</h3>
                <p className="text-sm text-muted-foreground">
                  Click on a tourist marker on the map to view their details
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setAuthorityPage('verification')}
              >
                <Shield className="w-4 h-4 mr-2" />
                Verify Tourist IDs
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setAuthorityPage('efir')}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                File E-FIR
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setAuthorityPage('analytics')}
              >
                <Activity className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapDashboard;