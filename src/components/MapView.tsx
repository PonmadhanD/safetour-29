import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, Shield, MapPin, AlertTriangle, Locate, RefreshCw } from 'lucide-react';
import { Tourist, Zone, SafeRoute, Alert as AppAlert } from '@/types';

// Import mock data
import safeZonesData from '@/mockData/safeZones.json';
import safeRoutesData from '@/mockData/safeRoutes.json';
import touristsData from '@/mockData/tourists.json';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color: string, size: [number, number] = [25, 41]) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="
      background-color: ${color};
      width: ${size[0]}px;
      height: ${size[1]}px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1]],
    popupAnchor: [0, -size[1]]
  });
};

const safeZoneIcon = createCustomIcon('#10b981'); // green
const cautionZoneIcon = createCustomIcon('#f59e0b'); // orange
const dangerZoneIcon = createCustomIcon('#ef4444'); // red
const touristSafeIcon = createCustomIcon('#3b82f6', [20, 32]); // blue
const touristAlertIcon = createCustomIcon('#f59e0b', [20, 32]); // orange
const touristEmergencyIcon = createCustomIcon('#ef4444', [20, 32]); // red
const waypointIcon = createCustomIcon('#6366f1', [15, 24]); // indigo

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

// Simplified HeatMap component without dynamic script loading
const HeatmapLayer: React.FC<{ tourists: Tourist[] }> = ({ tourists }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || tourists.length === 0) return;
      
    // Only proceed if leaflet heat is already available
    if (!(window as any).L?.heatLayer) {
      console.warn('Leaflet heatLayer not available. Skipping heatmap rendering.');
      return;
    }
      
    // Create heat map data points
    const heatData = tourists
      .filter(tourist => tourist.currentLocation)
      .map(tourist => [
        tourist.currentLocation!.lat,
        tourist.currentLocation!.lng,
        tourist.status === 'emergency' ? 1.0 : tourist.status === 'alert' ? 0.7 : 0.5
      ]);

    if (heatData.length === 0) return;

    const heatLayer = (window as any).L.heatLayer(heatData, {
      radius: 20,
      blur: 15,
      maxZoom: 17,
      gradient: {
        0.0: '#10b981', // green
        0.5: '#f59e0b', // orange
        1.0: '#ef4444'  // red
      }
    });
    
    heatLayer.addTo(map);

    return () => {
      if (map.hasLayer(heatLayer)) {
        map.removeLayer(heatLayer);
      }
    };
  }, [tourists, map]);

  return null;
};

const MapView: React.FC<MapViewProps> = ({
  mode,
  tourists = touristsData as Tourist[],
  zones = safeZonesData as Zone[],
  routes = safeRoutesData as SafeRoute[],
  alerts = [],
  onPanicAlert,
  onTouristSelect,
  showPanicButton = true,
  className = ''
}) => {
  const mapRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Get zone color based on safety level
  const getZoneColor = (safetyLevel: string) => {
    switch (safetyLevel) {
      case 'high': return '#10b981'; // green
      case 'medium': return '#f59e0b'; // orange
      case 'low': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  // Get tourist marker icon based on status
  const getTouristIcon = (status: string) => {
    switch (status) {
      case 'safe': return touristSafeIcon;
      case 'alert': return touristAlertIcon;
      case 'emergency': return touristEmergencyIcon;
      default: return touristSafeIcon;
    }
  };

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
        
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 15);
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

  return (
    <div className={`relative ${className}`}>
      {/* Location Error Alert */}
      {locationError && (
        <Alert className="absolute top-4 left-4 right-4 z-[1000] bg-card">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{locationError}</AlertDescription>
        </Alert>
      )}

      {/* Map Container */}
      <MapContainer
        center={[25.5788, 91.8933]}
        zoom={12}
        ref={mapRef}
        className={`w-full h-full rounded-lg ${className}`}
        style={{ minHeight: '400px', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Safe Zones as Polygons */}
        {zones.map((zone: any) => (
          <Polygon
            key={zone.id}
            positions={zone.coordinates}
            color={getZoneColor(zone.safetyLevel)}
            fillColor={getZoneColor(zone.safetyLevel)}
            fillOpacity={0.3}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{zone.name}</h3>
                <p className="text-sm text-gray-600">{zone.description}</p>
                <p className="text-xs text-gray-500 mt-1">Safety: {zone.safetyLevel}</p>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Safe Routes as Polylines */}
        {routes.map((route: any) => (
          <Polyline
            key={route.id}
            positions={route.coordinates}
            color="#003366"
            weight={4}
            opacity={0.8}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{route.name}</h3>
                <p className="text-sm text-gray-600">{route.from} → {route.to}</p>
                <p className="text-xs text-gray-500">Distance: {route.distance}</p>
                <p className="text-xs text-gray-500">Duration: {route.duration}</p>
              </div>
            </Popup>
          </Polyline>
        ))}

        {/* Route Waypoints */}
        {routes.map((route: any) =>
          route.waypoints?.map((waypoint: any, index: number) => (
            <Marker
              key={`${route.id}-waypoint-${index}`}
              position={[waypoint.lat, waypoint.lng]}
              icon={waypointIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{waypoint.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{waypoint.type}</p>
                </div>
              </Popup>
            </Marker>
          )) || []
        )}

        {/* Tourists (Authority Mode) */}
        {mode === 'authority' && tourists.filter(tourist => tourist.currentLocation).map((tourist) => (
          <Marker
            key={tourist.id}
            position={[tourist.currentLocation!.lat, tourist.currentLocation!.lng]}
            icon={getTouristIcon(tourist.status)}
            eventHandlers={{
              click: () => onTouristSelect?.(tourist)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{tourist.name}</h3>
                <p className="text-sm text-gray-600">Status: {tourist.status}</p>
                <p className="text-sm text-gray-600">ID: {tourist.digitalId}</p>
                <p className="text-xs text-gray-500">{tourist.currentLocation?.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createCustomIcon('#3b82f6', [15, 24])}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">Your Location</h3>
                <p className="text-sm text-gray-600">Current position</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Heatmap Layer for Tourist Density */}
        {mode === 'authority' && typeof (window as any).L?.heatLayer === 'function' && (
          <HeatmapLayer tourists={tourists} />
        )}
      </MapContainer>

      {/* Panic Button (Tourist Mode) */}
      {mode === 'tourist' && showPanicButton && (
        <Button
          onClick={onPanicAlert}
          className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-emergency hover:bg-emergency/90 text-emergency-foreground shadow-lg z-[1000] animate-pulse"
          size="icon"
        >
          <Phone className="w-8 h-8" />
        </Button>
      )}

      {/* Location Button */}
      <Button
        onClick={getCurrentLocation}
        disabled={isTracking}
        className="absolute bottom-6 left-6 w-12 h-12 rounded-full bg-card border shadow-md z-[1000]"
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
      <Card className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-card/95 backdrop-blur z-[1000]">
        <CardContent className="p-3">
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3" style={{ backgroundColor: '#10b981' }} />
              <span>Safe Zone</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-1" style={{ backgroundColor: '#003366' }} />
              <span>Safe Route</span>
            </div>
            {mode === 'authority' && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
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