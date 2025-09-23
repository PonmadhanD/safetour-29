import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, Navigation, MapPin, Clock, Shield, Phone,
  Compass, AlertTriangle, RefreshCw, Locate
} from 'lucide-react';
import { SafeRoute } from '@/types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface NavigationScreenProps {
  route: SafeRoute;
  onBack: () => void;
}

const NavigationScreen: React.FC<NavigationScreenProps> = ({ route, onBack }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const routingControl = useRef<any>(null);
  const userLocationMarker = useRef<L.Marker | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [routeStarted, setRouteStarted] = useState(false);
  const navigate = useNavigate();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current).setView([25.5788, 91.8933], 12);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.current);

    // Add waypoint markers
    const waypoints = route.waypoints || [];
    waypoints.forEach((waypoint, index) => {
      if (!map.current) return;

      const marker = L.marker([waypoint.lat, waypoint.lng])
        .addTo(map.current)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold">${waypoint.name}</h3>
            <p class="text-sm text-gray-600 capitalize">${waypoint.type}</p>
          </div>
        `);

      // Custom marker for start/end points
      if (index === 0) {
        marker.setIcon(L.divIcon({
          html: '<div class="bg-green-500 w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">S</div>',
          className: 'custom-marker',
          iconSize: [24, 24]
        }));
      } else if (index === waypoints.length - 1) {
        marker.setIcon(L.divIcon({
          html: '<div class="bg-red-500 w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">E</div>',
          className: 'custom-marker',
          iconSize: [24, 24]
        }));
      }
    });

    // Fit map to show all waypoints
    if (waypoints.length > 0) {
      const group = new L.FeatureGroup(waypoints.map(wp => L.marker([wp.lat, wp.lng])));
      map.current.fitBounds(group.getBounds().pad(0.1));
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [route]);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });

        if (map.current) {
          // Remove existing user marker
          if (userLocationMarker.current) {
            map.current.removeLayer(userLocationMarker.current);
          }

          // Add pulsing user location marker
          const userIcon = L.divIcon({
            html: '<div class="user-location-marker"></div>',
            className: 'user-location-wrapper',
            iconSize: [20, 20]
          });

          userLocationMarker.current = L.marker([latitude, longitude], { icon: userIcon })
            .addTo(map.current)
            .bindPopup('Your current location');

          // Center map on user location
          map.current.setView([latitude, longitude], 15);
        }
      },
      (error) => {
        setLocationError(`Location error: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const startLiveTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setIsTracking(true);
    setLocationError(null);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });

        if (map.current && userLocationMarker.current) {
          userLocationMarker.current.setLatLng([latitude, longitude]);
        }
      },
      (error) => {
        setLocationError(`Live tracking error: ${error.message}`);
        setIsTracking(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      setIsTracking(false);
    };
  }, []);

  const startNavigation = useCallback(() => {
    if (!map.current || !currentLocation || !route.waypoints.length) return;

    // Remove existing routing control
    if (routingControl.current) {
      map.current.removeControl(routingControl.current);
    }

    // Create waypoints for routing
    const waypoints = [
      L.latLng(currentLocation.lat, currentLocation.lng),
      ...route.waypoints.map(wp => L.latLng(wp.lat, wp.lng))
    ];

    // Add routing control using Leaflet Routing Machine
    if (window.L && (window.L as any).Routing) {
      routingControl.current = (window.L as any).Routing.control({
        waypoints: waypoints,
        routeWhileDragging: false,
        addWaypoints: false,
        createMarker: () => null, // We handle markers ourselves
        lineOptions: {
          styles: [{ color: '#3b82f6', weight: 4, opacity: 0.8 }]
        }
      }).addTo(map.current);
    }

    setRouteStarted(true);
  }, [currentLocation, route]);

  const handlePanic = () => {
    navigate('/panic');
  };

  const getSafetyColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-500';
    if (rating >= 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const nextWaypoint = route.waypoints?.[0];

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b p-4 flex items-center gap-4 z-10">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-foreground">{route.name}</h1>
          <p className="text-sm text-muted-foreground">Turn-by-turn navigation</p>
        </div>
        <Button
          onClick={handlePanic}
          className="w-10 h-10 rounded-full bg-emergency hover:bg-emergency/90 text-emergency-foreground animate-pulse-emergency"
          size="icon"
        >
          <Phone className="w-4 h-4" />
        </Button>
      </div>

      {/* Location Status */}
      {locationError && (
        <Alert className="m-4 border-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{locationError}</AlertDescription>
        </Alert>
      )}

      {/* Route Info */}
      <Card className="m-4 mb-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{route.distance}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{route.duration}</span>
            </div>
            <Badge className={`${getSafetyColor(route.safetyRating)} text-white`}>
              <Shield className="w-3 h-3 mr-1" />
              {route.safetyRating}/5
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Map Container */}
      <div className="flex-1 relative mx-4 mb-4">
        <div 
          ref={mapContainer} 
          className="w-full h-full rounded-lg border shadow-lg"
        />
      </div>

      {/* Next Waypoint */}
      {nextWaypoint && routeStarted && (
        <Card className="mx-4 mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Navigation className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Next: {nextWaypoint.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{nextWaypoint.type}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="p-4 space-y-3 bg-card border-t">
        {!currentLocation ? (
          <Button onClick={getCurrentLocation} className="w-full rounded-xl" size="lg">
            <Locate className="w-4 h-4 mr-2" />
            Get Current Location
          </Button>
        ) : !routeStarted ? (
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={startNavigation} className="w-full rounded-xl" size="lg">
              <Navigation className="w-4 h-4 mr-2" />
              Start Navigation
            </Button>
            <Button 
              onClick={startLiveTracking} 
              variant="outline" 
              className="w-full rounded-xl" 
              size="lg"
              disabled={isTracking}
            >
              <Compass className="w-4 h-4 mr-2" />
              {isTracking ? 'Tracking...' : 'Live Track'}
            </Button>
          </div>
        ) : (
          <Button onClick={onBack} variant="outline" className="w-full rounded-xl" size="lg">
            End Navigation
          </Button>
        )}
      </div>

      {/* User Location Marker Styles */}
      <style>{`
        .user-location-marker {
          width: 20px;
          height: 20px;
          background-color: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }

        .custom-marker {
          background: none !important;
          border: none !important;
        }

        .user-location-wrapper {
          background: none !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
};

export default NavigationScreen;