import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Navigation, MapPin, Clock, Shield, Star,
  Route, AlertTriangle, Phone, Info
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { SafeRoute } from '@/types';
import NavigationScreen from './NavigationScreen';

const RoutesScreen: React.FC = () => {
  const { setTouristPage } = useApp();
  const [selectedRoute, setSelectedRoute] = useState<SafeRoute | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const safeRoutes: SafeRoute[] = [
    {
      id: '1',
      name: 'Shillong to Cherrapunji',
      from: 'Shillong Police Bazaar',
      to: 'Cherrapunji Main Market',
      distance: '54 km',
      duration: '1.5 hours',
      safetyRating: 4.8,
      waypoints: [
        { lat: 25.5788, lng: 91.8933, name: 'Shillong Police Bazaar', type: 'checkpoint' },
        { lat: 25.4526, lng: 91.7318, name: 'Mawkdok Police Station', type: 'emergency' },
        { lat: 25.3011, lng: 91.7326, name: 'Cherrapunji Market', type: 'checkpoint' }
      ],
      warnings: ['Steep curves between km 25-35', 'Weather dependent visibility'],
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      name: 'Shillong to Dawki',
      from: 'Shillong Bus Stand',
      to: 'Dawki Border',
      distance: '96 km',
      duration: '2.5 hours',
      safetyRating: 4.5,
      waypoints: [
        { lat: 25.5738, lng: 91.8967, name: 'Shillong Bus Stand', type: 'checkpoint' },
        { lat: 25.2677, lng: 91.7639, name: 'Pynursla Police Station', type: 'emergency' },
        { lat: 25.1167, lng: 91.7667, name: 'Dawki Border Checkpoint', type: 'checkpoint' }
      ],
      warnings: ['Border area - carry valid ID', 'Limited fuel stations after Pynursla'],
      lastUpdated: '2024-01-14'
    },
    {
      id: '3',
      name: 'Guwahati to Shillong',
      from: 'Guwahati Railway Station',
      to: 'Shillong Police Bazaar',
      distance: '100 km',
      duration: '3 hours',
      safetyRating: 4.6,
      waypoints: [
        { lat: 26.1445, lng: 91.7362, name: 'Guwahati Railway Station', type: 'checkpoint' },
        { lat: 25.9441, lng: 91.8014, name: 'Jorabat Police Station', type: 'emergency' },
        { lat: 25.5788, lng: 91.8933, name: 'Shillong Police Bazaar', type: 'checkpoint' }
      ],
      warnings: ['Heavy traffic during peak hours (8-10 AM, 5-7 PM)', 'Toll plaza at Jorabat'],
      lastUpdated: '2024-01-16'
    },
    {
      id: '4',
      name: 'Shillong to Mawlynnong',
      from: 'Shillong Police Bazaar',
      to: 'Mawlynnong Village',
      distance: '90 km',
      duration: '2.5 hours',
      safetyRating: 4.3,
      waypoints: [
        { lat: 25.5788, lng: 91.8933, name: 'Shillong Police Bazaar', type: 'checkpoint' },
        { lat: 25.2677, lng: 91.7639, name: 'Pynursla Police Station', type: 'emergency' },
        { lat: 25.2167, lng: 91.8833, name: 'Mawlynnong Village', type: 'landmark' }
      ],
      warnings: ['Narrow village roads', 'Limited mobile network in some areas'],
      lastUpdated: '2024-01-13'
    }
  ];

  const getSafetyColor = (rating: number) => {
    if (rating >= 4.5) return 'text-success';
    if (rating >= 4.0) return 'text-warning';
    return 'text-destructive';
  };

  const getWaypointIcon = (type: string) => {
    switch (type) {
      case 'emergency': return Phone;
      case 'landmark': return MapPin;
      default: return Shield;
    }
  };

  if (isNavigating && selectedRoute) {
    return (
      <NavigationScreen 
        route={selectedRoute} 
        onBack={() => {
          setIsNavigating(false);
          setSelectedRoute(null);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/30 to-secondary-light/30">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="p-4 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setTouristPage(selectedRoute ? 'routes' : 'zones')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">
              {selectedRoute ? 'Route Details' : 'Safe Routes'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {selectedRoute ? selectedRoute.name : 'Verified safe travel routes'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {!selectedRoute ? (
          <div className="space-y-4">
            {/* Quick Info */}
            <Card className="bg-gradient-to-r from-primary-light/20 to-secondary-light/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-sm">Real-time Route Monitoring</p>
                    <p className="text-xs text-muted-foreground">
                      All routes are monitored 24/7 with regular safety updates
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Routes List */}
            <div className="space-y-4">
              {safeRoutes.map((route) => (
                <Card key={route.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Route className="w-5 h-5 text-primary" />
                          {route.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className={`w-4 h-4 ${getSafetyColor(route.safetyRating)}`} />
                          <span className="text-sm font-medium">{route.safetyRating}</span>
                          <span className="text-xs text-muted-foreground">safety rating</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-muted-foreground" />
                        <span>{route.distance}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{route.duration}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-success" />
                        <span>From: {route.from}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>To: {route.to}</span>
                      </div>
                    </div>

                    {route.warnings.length > 0 && (
                      <div className="bg-warning-light p-2 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-warning">Travel Advisory</p>
                            <p className="text-xs text-muted-foreground">
                              {route.warnings[0]}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedRoute(route)}
                      >
                        <Info className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedRoute(route);
                          setIsNavigating(true);
                        }}
                      >
                        <Navigation className="w-4 h-4 mr-1" />
                        Start Navigation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Route Details View */
          <div className="space-y-4">
            {/* Route Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="w-5 h-5 text-primary" />
                  Route Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Distance</p>
                    <p className="text-lg font-bold text-primary">{selectedRoute.distance}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-lg font-bold text-primary">{selectedRoute.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Star className={`w-5 h-5 ${getSafetyColor(selectedRoute.safetyRating)}`} />
                  <span className="font-medium">{selectedRoute.safetyRating}</span>
                  <span className="text-sm text-muted-foreground">Safety Rating</span>
                </div>
              </CardContent>
            </Card>

            {/* Waypoints */}
            <Card>
              <CardHeader>
                <CardTitle>Route Waypoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedRoute.waypoints.map((waypoint, index) => {
                    const Icon = getWaypointIcon(waypoint.type);
                    return (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                        <Icon className="w-4 h-4 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{waypoint.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{waypoint.type}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Warnings */}
            {selectedRoute.warnings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    Travel Advisories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedRoute.warnings.map((warning, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-warning-light rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                        <p className="text-sm">{warning}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedRoute(null)}>
                Back to Routes
              </Button>
              <Button 
                className="flex-1"
                onClick={() => setIsNavigating(true)}
              >
                <Navigation className="w-4 h-4 mr-2" />
                Start Navigation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutesScreen;