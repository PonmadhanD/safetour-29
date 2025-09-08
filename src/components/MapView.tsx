import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, Shield, MapPin, AlertTriangle, Locate, RefreshCw } from 'lucide-react';
import { Tourist, Zone, SafeRoute, Alert as AppAlert } from '@/types';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapViewProps {
  mode: 'tourist' | 'authority';
  tourists?: Tourist[];
  zones?: Zone[];
  routes?: SafeRoute[];
  alerts?: AppAlert[];
  onPanicAlert?: () => void;
  onTouristSelect?: (tourist: Tourist) => void;
  showPanicButton?: boolean;
  className?: string;
}

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing?: number;
  pitch?: number;
}

// Mock data for demonstration
const mockZones: Zone[] = [
  {
    id: '1',
    name: 'Shillong Safe Zone',
    description: 'Main tourist area with high security',
    category: 'tourist',
    safetyLevel: 'high',
    location: { lat: 25.5788, lng: 91.8933, address: 'Police Bazar, Shillong' },
    features: ['24/7 Security', 'Tourist Police', 'Emergency Services'],
    bestTime: 'All day',
    guidelines: ['Stay in groups', 'Keep ID ready'],
    emergencyContacts: ['+91-364-2222222']
  }
];

const mockRoutes: SafeRoute[] = [
  {
    id: '1',
    name: 'Shillong to Cherrapunji Safe Route',
    from: 'Shillong',
    to: 'Cherrapunji',
    distance: '54 km',
    duration: '1.5 hours',
    safetyRating: 4.5,
    waypoints: [
      { lat: 25.5788, lng: 91.8933, name: 'Shillong Start', type: 'checkpoint' },
      { lat: 25.2993, lng: 91.7362, name: 'Cherrapunji', type: 'checkpoint' }
    ],
    warnings: ['Check weather conditions'],
    lastUpdated: '2024-01-08'
  }
];

const MapView: React.FC<MapViewProps> = ({
  mode,
  tourists = [],
  zones = mockZones,
  routes = mockRoutes,
  alerts = [],
  onPanicAlert,
  onTouristSelect,
  showPanicButton = true,
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [viewState, setViewState] = useState<ViewState>({
    longitude: 91.8933,
    latitude: 25.5788,
    zoom: 12,
    bearing: 0,
    pitch: 0
  });
  const [mapboxToken, setMapboxToken] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    // For demo purposes - in production this would come from environment variables
    const token = prompt('Enter your Mapbox public token (get from https://mapbox.com/):');
    if (token) {
      setMapboxToken(token);
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current || !mapboxToken) return;

    // Initialize Mapbox map
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js';
    script.onload = () => {
      const link = document.createElement('link');
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      // @ts-ignore
      mapboxgl.accessToken = mapboxToken;
      
      // @ts-ignore
      mapInstance.current = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom
      });

      // @ts-ignore
      mapInstance.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add zone markers
      zones.forEach(zone => {
        const el = document.createElement('div');
        el.className = `w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer ${
          zone.safetyLevel === 'high' ? 'bg-success' :
          zone.safetyLevel === 'medium' ? 'bg-warning' : 'bg-emergency'
        }`;
        
        // @ts-ignore
        new mapboxgl.Marker(el)
          .setLngLat([zone.location.lng, zone.location.lat])
          // @ts-ignore
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <h3 class="font-semibold">${zone.name}</h3>
              <p class="text-sm text-gray-600">${zone.description}</p>
            </div>
          `))
          .addTo(mapInstance.current);
      });

      // Add route waypoints
      routes.forEach(route => {
        route.waypoints.forEach((waypoint, index) => {
          const el = document.createElement('div');
          el.className = `w-5 h-5 rounded-full border-2 border-white shadow-lg cursor-pointer ${
            waypoint.type === 'emergency' ? 'bg-emergency' :
            waypoint.type === 'checkpoint' ? 'bg-success' : 'bg-primary'
          }`;
          
          // @ts-ignore
          new mapboxgl.Marker(el)
            .setLngLat([waypoint.lng, waypoint.lat])
            // @ts-ignore
            .setPopup(new mapboxgl.Popup().setHTML(`
              <div class="p-2">
                <h3 class="font-semibold">${waypoint.name}</h3>
                <p class="text-sm text-gray-600 capitalize">${waypoint.type}</p>
              </div>
            `))
            .addTo(mapInstance.current);
        });
      });

      // Add tourist markers for authority mode
      if (mode === 'authority') {
        tourists.forEach(tourist => {
          if (tourist.currentLocation) {
            const el = document.createElement('div');
            el.className = `w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer ${
              tourist.status === 'safe' ? 'bg-success' :
              tourist.status === 'alert' ? 'bg-warning' : 'bg-emergency'
            }`;
            el.onclick = () => onTouristSelect?.(tourist);
            
            // @ts-ignore
            new mapboxgl.Marker(el)
              .setLngLat([tourist.currentLocation.lng, tourist.currentLocation.lat])
              // @ts-ignore
              .setPopup(new mapboxgl.Popup().setHTML(`
                <div class="p-2">
                  <h3 class="font-semibold">${tourist.name}</h3>
                  <p class="text-sm text-gray-600">Status: ${tourist.status}</p>
                  <p class="text-sm text-gray-600">ID: ${tourist.digitalId}</p>
                </div>
              `))
              .addTo(mapInstance.current);
          }
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      mapInstance.current?.remove();
    };
  }, [mapboxToken, mode, tourists, zones, routes, onTouristSelect]);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported');
      return;
    }

    setIsTracking(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        if (mapInstance.current) {
          mapInstance.current.flyTo({
            center: [longitude, latitude],
            zoom: 15
          });

          // Add user location marker
          const el = document.createElement('div');
          el.className = 'w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg animate-pulse';
          
          // @ts-ignore
          new mapboxgl.Marker(el)
            .setLngLat([longitude, latitude])
            .addTo(mapInstance.current);
        }
        
        setLocationError(null);
        setIsTracking(false);
      },
      (error) => {
        setLocationError(`Location error: ${error.message}`);
        setIsTracking(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  if (!mapboxToken) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-lg h-96 ${className}`}>
        <div className="text-center p-6">
          <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Mapbox Token Required</h3>
          <p className="text-muted-foreground mb-4">
            Please refresh and enter your Mapbox public token to view the map.
          </p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Location Error Alert */}
      {locationError && (
        <Alert className="absolute top-4 left-4 right-4 z-20 bg-card">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{locationError}</AlertDescription>
        </Alert>
      )}

      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: '400px' }}
      />

      {/* Panic Button (Tourist Mode) */}
      {mode === 'tourist' && showPanicButton && (
        <Button
          onClick={onPanicAlert}
          className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-emergency hover:bg-emergency/90 text-emergency-foreground shadow-emergency animate-pulse-emergency"
          size="icon"
        >
          <Phone className="w-8 h-8" />
        </Button>
      )}

      {/* Location Button */}
      <Button
        onClick={getCurrentLocation}
        disabled={isTracking}
        className="absolute bottom-6 left-6 w-12 h-12 rounded-full bg-card border shadow-md"
        variant="outline"
        size="icon"
      >
        {isTracking ? (
          <RefreshCw className="w-5 h-5 animate-spin" />
        ) : (
          <Locate className="w-5 h-5" />
        )}
      </Button>

      {/* Map Legend (Bottom Center) */}
      <Card className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-card/95 backdrop-blur">
        <CardContent className="p-3">
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-success rounded" />
              <span>Safe Zone</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-1 bg-primary rounded" />
              <span>Safe Route</span>
            </div>
            {mode === 'authority' && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span>Tourist</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapView;