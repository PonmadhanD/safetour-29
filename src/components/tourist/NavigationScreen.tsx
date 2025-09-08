import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, Navigation, MapPin, Clock, Shield, Phone,
  Compass, AlertTriangle, RefreshCw, Locate
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { SafeRoute } from '@/types';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface NavigationScreenProps {
  route: SafeRoute;
  onBack: () => void;
}

const NavigationScreen: React.FC<NavigationScreenProps> = ({ route, onBack }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userLocationMarker = useRef<mapboxgl.Marker | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [mapboxToken, setMapboxToken] = useState('');

  useEffect(() => {
    // For demo purposes, using a placeholder token input
    // In production, this would come from environment variables
    const token = prompt('Enter your Mapbox public token (get from https://mapbox.com/):');
    if (token) {
      setMapboxToken(token);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12', // Satellite view
      center: [91.8933, 25.5788], // Shillong coordinates as default
      zoom: 12,
      pitch: 0,
      bearing: 0
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add route waypoints
    map.current.on('load', () => {
      if (!map.current) return;

      // Add waypoint markers
      route.waypoints.forEach((waypoint, index) => {
        const el = document.createElement('div');
        el.className = 'waypoint-marker';
        el.style.cssText = `
          width: 30px;
          height: 30px;
          background-color: ${waypoint.type === 'emergency' ? '#ef4444' : waypoint.type === 'checkpoint' ? '#22c55e' : '#3b82f6'};
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;
        el.textContent = (index + 1).toString();

        new mapboxgl.Marker(el)
          .setLngLat([waypoint.lng, waypoint.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <h3 class="font-semibold">${waypoint.name}</h3>
              <p class="text-sm text-gray-600 capitalize">${waypoint.type}</p>
            </div>
          `))
          .addTo(map.current!);
      });

      // Fit map to show all waypoints
      const bounds = new mapboxgl.LngLatBounds();
      route.waypoints.forEach(waypoint => {
        bounds.extend([waypoint.lng, waypoint.lat]);
      });
      map.current!.fitBounds(bounds, { padding: 50 });
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, route]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setIsTracking(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        
        if (map.current) {
          // Remove existing user location marker
          if (userLocationMarker.current) {
            userLocationMarker.current.remove();
          }

          // Create user location marker
          const el = document.createElement('div');
          el.className = 'user-location-marker';
          el.style.cssText = `
            width: 20px;
            height: 20px;
            background-color: #3b82f6;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
            animation: pulse 2s infinite;
          `;

          userLocationMarker.current = new mapboxgl.Marker(el)
            .setLngLat([longitude, latitude])
            .addTo(map.current);

          // Center map on user location
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            duration: 2000
          });
        }

        setIsTracking(false);
      },
      (error) => {
        setLocationError(`Failed to get location: ${error.message}`);
        setIsTracking(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const startLiveTracking = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        
        if (map.current && userLocationMarker.current) {
          userLocationMarker.current.setLngLat([longitude, latitude]);
        }
      },
      (error) => {
        setLocationError(`Live tracking error: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 }
    );

    // Clean up watch on component unmount
    return () => navigator.geolocation.clearWatch(watchId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/30 to-secondary-light/30">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="p-4 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Navigation</h1>
            <p className="text-sm text-muted-foreground">{route.name}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={getCurrentLocation}
            disabled={isTracking}
          >
            {isTracking ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Locate className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Location Status */}
        {locationError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{locationError}</AlertDescription>
          </Alert>
        )}

        {currentLocation && (
          <Alert>
            <MapPin className="h-4 w-4" />
            <AlertDescription>
              Current location: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
            </AlertDescription>
          </Alert>
        )}

        {/* Route Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" />
              Route Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="text-center">
                <p className="font-medium">{route.distance}</p>
                <p className="text-muted-foreground">Distance</p>
              </div>
              <div className="text-center">
                <p className="font-medium">{route.duration}</p>
                <p className="text-muted-foreground">Duration</p>
              </div>
              <div className="text-center">
                <p className="font-medium">{route.safetyRating}</p>
                <p className="text-muted-foreground">Safety</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Container */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div ref={mapContainer} className="w-full h-[400px]" />
          </CardContent>
        </Card>

        {/* Next Waypoint */}
        {route.waypoints.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Compass className="w-5 h-5 text-primary" />
                Next Waypoint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {route.waypoints[0].type === 'emergency' ? (
                  <Phone className="w-5 h-5 text-destructive" />
                ) : route.waypoints[0].type === 'checkpoint' ? (
                  <Shield className="w-5 h-5 text-success" />
                ) : (
                  <MapPin className="w-5 h-5 text-primary" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{route.waypoints[0].name}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {route.waypoints[0].type}
                  </p>
                </div>
                <Badge variant="outline">Next</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={startLiveTracking}
          >
            <Navigation className="w-4 h-4 mr-2" />
            Start Live Tracking
          </Button>
          <Button 
            variant="destructive" 
            className="flex-1"
            onClick={onBack}
          >
            End Navigation
          </Button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
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
        `
      }} />
    </div>
  );
};

export default NavigationScreen;