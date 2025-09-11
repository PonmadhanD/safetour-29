import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Locate, Navigation, AlertTriangle, Shield, 
  Users, MapPin, Route, Phone 
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Tourist, Zone, SafeRoute, Alert as AlertType } from '@/types';

// Import mock data
import safeZonesData from '@/mockData/safeZones.json';
import safeRoutesData from '@/mockData/safeRoutes.json';
import touristsData from '@/mockData/tourists.json';

// Fix Leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom icon creators
const createCustomIcon = (color: string, icon: string) => {
  return L.divIcon({
    html: `<div class="w-6 h-6 rounded-full ${color} border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">${icon}</div>`,
    className: 'custom-marker',
    iconSize: [24, 24]
  });
};

// Icon definitions
export const safeZoneIcon = createCustomIcon('bg-green-500', 'S');
export const touristIcon = createCustomIcon('bg-blue-500', 'T');
export const alertIcon = createCustomIcon('bg-red-500', '!');
export const waypointIcon = createCustomIcon('bg-primary', 'W');

interface MapViewProps {
  mode: 'tourist' | 'authority';
  tourists?: Tourist[];
  zones?: Zone[];
  routes?: SafeRoute[];
  alerts?: AlertType[];
  onTouristSelect?: (tourist: Tourist) => void;
  onPanicAlert?: () => void;
  showPanicButton?: boolean;
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({
  mode,
  tourists = touristsData as Tourist[],
  zones = safeZonesData as Zone[],
  routes = safeRoutesData as SafeRoute[],
  alerts = [],
  onTouristSelect,
  onPanicAlert,
  showPanicButton = true,
  className = ''
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const heatmapLayer = useRef<any>(null);
  const routingControl = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<SafeRoute | null>(null);
  const { setEmergencyActive, setTouristPage } = useApp();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current).setView([25.5788, 91.8933], 12);

    // Add OpenStreetMap tiles with tourism-friendly styling
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers and layers when data changes
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers and layers
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polygon || layer instanceof L.Polyline) {
        map.current!.removeLayer(layer);
      }
    });

    // Remove heatmap
    if (heatmapLayer.current) {
      map.current.removeLayer(heatmapLayer.current);
      heatmapLayer.current = null;
    }

    // Remove routing control
    if (routingControl.current) {
      map.current.removeControl(routingControl.current);
      routingControl.current = null;
    }

    // Add safe zones
    zones.forEach((zone: any) => {
      if (!map.current) return;

      const zoneColor = getZoneColor(zone.safetyLevel);
      
      // Add zone polygon
      const polygon = L.polygon(zone.coordinates, {
        color: zoneColor,
        fillColor: zoneColor,
        fillOpacity: 0.2,
        weight: 2
      }).addTo(map.current);

      // Add zone marker
      const marker = L.marker([zone.location.lat, zone.location.lng], {
        icon: createCustomIcon(getZoneColorClass(zone.safetyLevel), 'S')
      }).addTo(map.current);

      marker.bindPopup(`
        <div class="p-3 min-w-48">
          <h3 class="font-semibold text-lg mb-2">${zone.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${zone.description}</p>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs px-2 py-1 rounded ${getZoneColorClass(zone.safetyLevel)} text-white">
              Safety: ${zone.safetyLevel}/5
            </span>
          </div>
          <p class="text-xs text-gray-500">${zone.location.address}</p>
        </div>
      `);
    });

    // Add routes
    routes.forEach((route: any) => {
      if (!map.current || !route.coordinates?.length) return;

      const routeLine = L.polyline(route.coordinates.map(coord => [coord[1], coord[0]]), {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.8
      }).addTo(map.current);

      routeLine.bindPopup(`
        <div class="p-3">
          <h3 class="font-semibold">${route.name}</h3>
          <p class="text-sm text-gray-600">${route.from} → ${route.to}</p>
          <div class="flex gap-2 mt-2">
            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">${route.distance}</span>
            <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">${route.duration}</span>
          </div>
        </div>
      `);

      // Add waypoints
      route.waypoints?.forEach((waypoint: any, index: number) => {
        if (!map.current) return;
        
        L.marker([waypoint.lat, waypoint.lng], {
          icon: createCustomIcon('bg-primary', (index + 1).toString())
        }).addTo(map.current).bindPopup(`
          <div class="p-2">
            <h4 class="font-medium">${waypoint.name}</h4>
            <p class="text-sm text-gray-600 capitalize">${waypoint.type}</p>
          </div>
        `);
      });
    });

    // Add tourists (authority mode)
    if (mode === 'authority') {
      tourists.forEach((tourist) => {
        if (!map.current || !tourist.currentLocation) return;

        const marker = L.marker([tourist.currentLocation.lat, tourist.currentLocation.lng], {
          icon: getTouristIcon(tourist.status)
        }).addTo(map.current);

        marker.bindPopup(`
          <div class="p-3">
            <h3 class="font-semibold">${tourist.name}</h3>
            <p class="text-sm text-gray-600">${tourist.email}</p>
            <p class="text-sm text-gray-600">${tourist.currentLocation.address}</p>
            <div class="mt-2">
              <span class="text-xs px-2 py-1 rounded ${getStatusColor(tourist.status)} text-white">
                ${tourist.status.toUpperCase()}
              </span>
            </div>
          </div>
        `);

        marker.on('click', () => {
          if (onTouristSelect) {
            onTouristSelect(tourist);
          }
        });
      });

      // Add heatmap for tourist density
      if (tourists.length > 0 && window.L && (window.L as any).heatLayer) {
        const heatData = tourists
          .filter(t => t.currentLocation)
          .map(t => [t.currentLocation!.lat, t.currentLocation!.lng, 1]);
        
        if (heatData.length > 0) {
          heatmapLayer.current = (window.L as any).heatLayer(heatData, {
            radius: 50,
            blur: 35,
            maxZoom: 17,
            gradient: {
              0.2: 'blue',
              0.4: 'cyan',
              0.6: 'lime',
              0.8: 'yellow',
              1.0: 'red'
            }
          }).addTo(map.current);
        }
      }
    }

    // Add alerts
    alerts.forEach((alert) => {
      if (!map.current) return;

      L.marker([alert.location.lat, alert.location.lng], {
        icon: alertIcon
      }).addTo(map.current).bindPopup(`
        <div class="p-3">
          <h3 class="font-semibold text-red-600">${alert.type.toUpperCase()}</h3>
          <p class="text-sm text-gray-600">${alert.message}</p>
          <p class="text-xs text-gray-500 mt-2">${new Date().toLocaleString()}</p>
        </div>
      `);
    });

  }, [zones, routes, tourists, alerts, mode, onTouristSelect]);

  const getZoneColor = (safetyLevel: string | number) => {
    const level = typeof safetyLevel === 'string' ? 
      (safetyLevel === 'high' ? 5 : safetyLevel === 'medium' ? 3 : 1) : 
      safetyLevel;
    
    if (level >= 4) return '#10b981';
    if (level >= 3) return '#f59e0b';
    return '#ef4444';
  };

  const getZoneColorClass = (safetyLevel: string | number) => {
    const level = typeof safetyLevel === 'string' ? 
      (safetyLevel === 'high' ? 5 : safetyLevel === 'medium' ? 3 : 1) : 
      safetyLevel;
    
    if (level >= 4) return 'bg-green-500';
    if (level >= 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTouristIcon = (status: string) => {
    switch (status) {
      case 'emergency':
        return createCustomIcon('bg-red-500', '!');
      case 'alert':
        return createCustomIcon('bg-yellow-500', '⚠');
      default:
        return createCustomIcon('bg-green-500', '✓');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'emergency':
        return 'bg-red-500';
      case 'alert':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationError(null);

        if (map.current) {
          map.current.setView([latitude, longitude], 15);
          
          // Add user location marker
          L.marker([latitude, longitude], {
            icon: L.divIcon({
              html: '<div class="user-location-marker"></div>',
              className: 'user-location-wrapper',
              iconSize: [20, 20]
            })
          }).addTo(map.current).bindPopup('Your current location');
        }
      },
      (error) => {
        setLocationError(`Location error: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const startNavigation = useCallback((route: SafeRoute) => {
    if (!map.current || !userLocation) return;

    setSelectedRoute(route);
    
    // Remove existing routing control
    if (routingControl.current) {
      map.current.removeControl(routingControl.current);
    }

    // Create waypoints for routing
    const waypoints = [
      L.latLng(userLocation.lat, userLocation.lng),
      ...route.waypoints.map(wp => L.latLng(wp.lat, wp.lng))
    ];

    // Add routing control using Leaflet Routing Machine
    if (window.L && (window.L as any).Routing) {
      routingControl.current = (window.L as any).Routing.control({
        waypoints: waypoints,
        routeWhileDragging: false,
        addWaypoints: false,
        createMarker: () => null,
        lineOptions: {
          styles: [{ color: '#3b82f6', weight: 4, opacity: 0.8 }]
        }
      }).addTo(map.current);
    }
  }, [userLocation]);

  const handlePanic = () => {
    setEmergencyActive(true);
    setTouristPage('panic');
    if (onPanicAlert) {
      onPanicAlert();
    }
  };

  const findNearestSafeZone = useCallback(() => {
    if (!userLocation || zones.length === 0) return;

    let nearestZone = zones[0];
    let minDistance = calculateDistance(
      userLocation.lat, 
      userLocation.lng, 
      nearestZone.location.lat, 
      nearestZone.location.lng
    );

    zones.forEach(zone => {
      const distance = calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        zone.location.lat, 
        zone.location.lng
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestZone = zone;
      }
    });

    if (map.current) {
      map.current.setView([nearestZone.location.lat, nearestZone.location.lng], 14);
    }
  }, [userLocation, zones]);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full rounded-lg" />

      {/* Tourist Mode Controls */}
      {mode === 'tourist' && (
        <>
          {/* Location Button */}
          <Button
            onClick={getCurrentLocation}
            className="absolute top-4 right-4 z-40 w-12 h-12 rounded-full shadow-lg bg-card hover:bg-card/90"
            size="icon"
            variant="outline"
          >
            <Locate className="w-5 h-5" />
          </Button>

          {/* Quick Actions */}
          {userLocation && (
            <Card className="absolute bottom-4 left-4 right-4 z-40 bg-card/95 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTouristPage('zones')}
                    className="flex flex-col gap-1 h-auto py-3 rounded-xl"
                  >
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-xs">Safe Zones</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTouristPage('routes')}
                    className="flex flex-col gap-1 h-auto py-3 rounded-xl"
                  >
                    <Route className="w-4 h-4 text-primary" />
                    <span className="text-xs">Routes</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={findNearestSafeZone}
                    className="flex flex-col gap-1 h-auto py-3 rounded-xl"
                  >
                    <Navigation className="w-4 h-4 text-primary" />
                    <span className="text-xs">Navigate</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Panic Button */}
          {showPanicButton && (
            <Button
              onClick={handlePanic}
              className="fixed bottom-20 right-4 z-50 w-16 h-16 rounded-full bg-emergency hover:bg-emergency/90 text-emergency-foreground shadow-emergency animate-pulse-emergency"
              size="icon"
            >
              <Phone className="w-6 h-6" />
            </Button>
          )}
        </>
      )}

      {/* Legend */}
      <Card className="absolute top-4 left-4 z-40 bg-card/95 backdrop-blur-sm">
        <CardContent className="p-3">
          <h4 className="text-sm font-medium mb-2">Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Safe Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Safe Route</span>
            </div>
            {mode === 'authority' && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span>Tourist</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Location Error */}
      {locationError && (
        <Card className="absolute top-16 left-4 right-4 z-40 bg-destructive/10 border-destructive">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">{locationError}</span>
            </div>
          </CardContent>
        </Card>
      )}

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

export default MapView;