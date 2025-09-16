import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Navigation, MapPin, Clock, Shield, Star,
  Route, AlertTriangle, Phone, Info, Search
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { SafeRoute } from '@/types';
import NavigationScreen from './NavigationScreen';

const RoutesScreen: React.FC = () => {
  const { setTouristPage } = useApp();
  const { t } = useLanguage();
  const [selectedRoute, setSelectedRoute] = useState<SafeRoute | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [safeRoutes, setSafeRoutes] = useState<SafeRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [navigationTarget, setNavigationTarget] = useState<any>(null);

  useEffect(() => {
    loadSafeRoutes();
    getCurrentLocation();
    checkNavigationTarget();
  }, []);

  const loadSafeRoutes = async () => {
    try {
      const { data, error } = await supabase
        .from('safe_routes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform database data to match SafeRoute interface
      const routes = data.map(route => {
        const pathCoords = route.path_coordinates as any;
        return {
          id: route.route_id,
          name: route.name,
          from: 'Start Location',
          to: 'End Location',
          distance: '0 km',
          duration: '0 min',
          safetyRating: route.safety_level === 'safe' ? 4.8 : route.safety_level === 'caution' ? 4.0 : 3.5,
          coordinates: pathCoords?.coordinates || [],
          waypoints: pathCoords?.waypoints || [],
          warnings: pathCoords?.warnings || [],
          lastUpdated: route.updated_at
        };
      });

      setSafeRoutes(routes);
    } catch (error) {
      console.error('Error loading safe routes:', error);
      // Fallback to mock data
      setSafeRoutes(mockRoutes);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setUserLocation({ lat: 25.5788, lng: 91.8933 });
        }
      );
    } else {
      setUserLocation({ lat: 25.5788, lng: 91.8933 });
    }
  };

  const checkNavigationTarget = () => {
    const target = localStorage.getItem('navigationTarget');
    if (target) {
      setNavigationTarget(JSON.parse(target));
      localStorage.removeItem('navigationTarget');
    }
  };

  const mockRoutes: SafeRoute[] = [
    {
      id: '1',
      name: 'Shillong to Cherrapunji',
      from: 'Shillong Police Bazaar',
      to: 'Cherrapunji Main Market',
      distance: '54 km',
      duration: '1.5 hours',
      safetyRating: 4.8,
      coordinates: [
        [91.8933, 25.5788],
        [91.8700, 25.5500],
        [91.8400, 25.5200],
        [91.8000, 25.4800],
        [91.7600, 25.4200],
        [91.7326, 25.3011]
      ],
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
      coordinates: [
        [91.8967, 25.5738],
        [91.8200, 25.4000],
        [91.7800, 25.3000],
        [91.7639, 25.2677],
        [91.7667, 25.1167]
      ],
      waypoints: [
        { lat: 25.5738, lng: 91.8967, name: 'Shillong Bus Stand', type: 'checkpoint' },
        { lat: 25.2677, lng: 91.7639, name: 'Pynursla Police Station', type: 'emergency' },
        { lat: 25.1167, lng: 91.7667, name: 'Dawki Border Checkpoint', type: 'checkpoint' }
      ],
      warnings: ['Border area - carry valid ID', 'Limited fuel stations after Pynursla'],
      lastUpdated: '2024-01-14'
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
              {selectedRoute ? t('routeDetails') : t('safeRoutes')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {selectedRoute ? selectedRoute.name : t('verifiedSafeTravelRoutes')}
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
                    <p className="font-medium text-sm">{t('realTimeRouteMonitoring')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('allRoutesMonitored')}
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
                          <span className="text-xs text-muted-foreground">{t('safetyRating')}</span>
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
                        <span>{t('from')}: {route.from}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{t('to')}: {route.to}</span>
                      </div>
                    </div>

                    {route.warnings.length > 0 && (
                      <div className="bg-warning-light p-2 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-warning">{t('travelAdvisory')}</p>
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
                        {t('viewDetails')}
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
{t('startNavigation')}
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
{t('routeOverview')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{t('distance')}</p>
                    <p className="text-lg font-bold text-primary">{selectedRoute.distance}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{t('duration')}</p>
                    <p className="text-lg font-bold text-primary">{selectedRoute.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Star className={`w-5 h-5 ${getSafetyColor(selectedRoute.safetyRating)}`} />
                  <span className="font-medium">{selectedRoute.safetyRating}</span>
                  <span className="text-sm text-muted-foreground">{t('safetyRating')}</span>
                </div>
              </CardContent>
            </Card>

            {/* Waypoints */}
            <Card>
              <CardHeader>
                <CardTitle>{t('routeWaypoints')}</CardTitle>
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
                    {t('travelAdvisories')}
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
                {t('backToRoutes')}
              </Button>
              <Button 
                className="flex-1"
                onClick={() => setIsNavigating(true)}
              >
                <Navigation className="w-4 h-4 mr-2" />
                {t('startNavigation')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutesScreen;