import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Locate, Navigation, AlertTriangle, Shield, 
  Users, MapPin, Route, Phone 
} from 'lucide-react';
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
const safeZoneIcon = createCustomIcon('bg-green-500', 'S');
const touristIcon = createCustomIcon('bg-blue-500', 'T');
const alertIcon = createCustomIcon('bg-red-500', '!');
const waypointIcon = createCustomIcon('bg-primary', 'W');

interface MapViewProps {
  mode: 'tourist' | 'authority';
  tourists?: Tourist[];
  zones?: Zone[];
  routes?: SafeRoute[];
  alerts?: AlertType[];
  onTouristSelect?: (tourist: Tourist) => void;
  onPanicAlert?: () => void;
  onStartNavigation?: (route: SafeRoute) => void;
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
  onStartNavigation,
  showPanicButton = true,
  className = ''
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const heatmapLayer = useRef<any>(null);
  const routingControl = useRef<any>(null);
  const userMarker = useRef<L.Marker | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<SafeRoute | null>(null);
  const [routingError, setRoutingError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [heatmapMode, setHeatmapMode] = useState<'all' | 'risk'>('all');

  // Utility functions
  const getZoneColor = (safetyLevel: string | number) => {
    const level = typeof safetyLevel === 'string' 
      ? (safetyLevel === 'high' ? 5 : safetyLevel === 'medium' ? 3 : 1) 
      : safetyLevel;
    if (level >= 4) return '#10b981';
    if (level >= 3) return '#f59e0b';
    return '#ef4444';
  };

  const getZoneColorClass = (safetyLevel: string | number) => {
    const level = typeof safetyLevel === 'string' 
      ? (safetyLevel === 'high' ? 5 : safetyLevel === 'medium' ? 3 : 1) 
      : safetyLevel;
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

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current).setView([25.5788, 91.8933], 12);

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

  // Render layers
  useEffect(() => {
    if (!map.current) return;

    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polygon || layer instanceof L.Polyline) {
        map.current!.removeLayer(layer);
      }
    });

    if (heatmapLayer.current) {
      map.current.removeLayer(heatmapLayer.current);
      heatmapLayer.current = null;
    }
    if (routingControl.current) {
      map.current.removeControl(routingControl.current);
      routingControl.current = null;
    }

    if (userLocation && userMarker.current) {
      userMarker.current.addTo(map.current);
    }

    zones.forEach((zone: any) => {
      if (!map.current) return;

      const zoneColor = getZoneColor(zone.safetyLevel);
      const polygon = L.polygon(zone.coordinates, {
        color: zoneColor,
        fillColor: zoneColor,
        fillOpacity: 0.2,
        weight: 2
      }).addTo(map.current);

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

    if (mode === 'authority') {
      routes.forEach((route: SafeRoute) => {
        if (!map.current || !route.coordinates?.length) {
          console.warn(`Skipping route ${route.name}: No coordinates`);
          return;
        }

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

        route.waypoints.forEach((waypoint, index) => {
          if (!map.current) return;
          L.marker([waypoint.lat, waypoint.lng], {
            icon: createCustomIcon('bg-primary', (index + 1).toString())
          }).addTo(map.current).bindPopup(`
            <div class="p-2">
              <h4 class="font-medium">${waypoint.name || `Waypoint ${index + 1}`}</h4>
              <p class="text-sm text-gray-600 capitalize">${waypoint.type || 'unknown'}</p>
            </div>
          `);
        });
      });

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

        marker.on('click', () => onTouristSelect?.(tourist));
      });

      // Heatmap toggle logic
const toHeatTuple = (lat: number, lng: number): [number, number, number] => [lat, lng, 1];

const allTouristsData = tourists
  .filter(t => t.currentLocation)
  .map(t => toHeatTuple(t.currentLocation!.lat, t.currentLocation!.lng));

const riskTouristsData = tourists
  .filter(t => (t.status === 'alert' || t.status === 'emergency') && t.currentLocation)
  .map(t => toHeatTuple(t.currentLocation!.lat, t.currentLocation!.lng));


      if (allTouristsData.length > 0 && window.L?.heatLayer) {
        if (heatmapLayer.current) {
          map.current.removeLayer(heatmapLayer.current);
        }
        heatmapLayer.current = window.L.heatLayer(
          heatmapMode === 'all' ? allTouristsData : riskTouristsData,
          {
            radius: 50,
            blur: 35,
            maxZoom: 17,
            gradient: { 0.2: 'blue', 0.4: 'cyan', 0.6: 'lime', 0.8: 'yellow', 1.0: 'red' }
          }
        ).addTo(map.current);
      }
    }

    alerts.forEach((alert) => {
      if (!map.current) return;

      L.marker([alert.location.lat, alert.location.lng], { icon: alertIcon })
        .addTo(map.current)
        .bindPopup(`
          <div class="p-3">
            <h3 class="font-semibold text-red-600">${alert.type.toUpperCase()}</h3>
            <p class="text-sm text-gray-600">${alert.message}</p>
            <p class="text-xs text-gray-500 mt-2">${new Date().toLocaleString()}</p>
          </div>
        `);
    });

  }, [zones, routes, tourists, alerts, mode, onTouristSelect, userLocation, heatmapMode]);

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
          
          if (userMarker.current) {
            map.current.removeLayer(userMarker.current);
          }
          
          userMarker.current = L.marker([latitude, longitude], {
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
    if (!map.current || !userLocation) {
      setRoutingError('Cannot start navigation: Map or user location not available.');
      console.warn('Navigation failed:', { map: !!map.current, userLocation });
      return;
    }

    setSelectedRoute(route);
    setRoutingError(null);

    if (routingControl.current) {
      map.current.removeControl(routingControl.current);
      routingControl.current = null;
    }

    let waypoints = [L.latLng(userLocation.lat, userLocation.lng)];
    if (route.waypoints.length > 0) {
      waypoints = [...waypoints, ...route.waypoints.map(wp => L.latLng(wp.lat, wp.lng))];
    } else if (route.coordinates.length > 0) {
      const endCoord = route.coordinates[route.coordinates.length - 1];
      waypoints.push(L.latLng(endCoord[1], endCoord[0]));
    } else {
      setRoutingError(`No waypoints or coordinates for route: ${route.name}`);
      console.warn('Invalid route data:', route);
      return;
    }

    if (window.L && (window.L as any).Routing) {
      routingControl.current = (window.L as any).Routing.control({
        waypoints,
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        createMarker: (i: number) => {
          if (i === 0 || i === waypoints.length - 1) {
            return L.marker(waypoints[i], {
              icon: i === 0 ? L.divIcon({
                html: '<div class="user-location-marker"></div>',
                className: 'user-location-wrapper',
                iconSize: [20, 20]
              }) : waypointIcon,
              draggable: false
            });
          }
          return null;
        },
        lineOptions: {
          styles: [{ color: '#3b82f6', weight: 4, opacity: 0.8 }]
        },
        show: false,
        fitSelectedRoutes: true
      }).addTo(map.current);

      routingControl.current.on('routingerror', (e: any) => {
        const errorMsg = 'Unable to compute route. Using static path.';
        setRoutingError(errorMsg);
        console.error('Routing error:', e.error);
        if (route.coordinates.length > 0) {
          L.polyline(route.coordinates.map(coord => [coord[1], coord[0]]), {
            color: '#ef4444',
            weight: 4,
            opacity: 0.8
          }).addTo(map.current).bindPopup(`Fallback: ${route.name}`);
        }
      });
    } else {
      setRoutingError('Routing plugin not loaded.');
      console.error('Leaflet Routing Machine not available.');
      if (route.coordinates.length > 0) {
        L.polyline(route.coordinates.map(coord => [coord[1], coord[0]]), {
          color: '#ef4444',
          weight: 4,
          opacity: 0.8
        }).addTo(map.current).bindPopup(`Fallback: ${route.name}`);
      }
    }
  }, [userLocation]);

  const handlePanic = useCallback(() => {
    navigate('/panic');
    onPanicAlert?.();
  }, [onPanicAlert, navigate]);

  const findNearestSafeZone = useCallback(() => {
    if (!userLocation || zones.length === 0) return;

    let nearestZone = zones[0] as any;
    let minDistance = calculateDistance(
      userLocation.lat, userLocation.lng, 
      nearestZone.location.lat, nearestZone.location.lng
    );

    zones.forEach((zone: any) => {
      const distance = calculateDistance(
        userLocation.lat, userLocation.lng, 
        zone.location.lat, zone.location.lng
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

  const findNearestRoute = useCallback(() => {
    if (!userLocation || routes.length === 0) return null;

    let nearestRoute = routes[0];
    let minDistance = Infinity;

    routes.forEach(route => {
      const points = route.waypoints.length > 0 
        ? route.waypoints 
        : route.coordinates.map(coord => ({ lat: coord[1], lng: coord[0] }));
      if (points.length === 0) return;

      const start = points[0];
      const end = points[points.length - 1];
      const distToStart = calculateDistance(userLocation.lat, userLocation.lng, start.lat, start.lng);
      const distToEnd = calculateDistance(userLocation.lat, userLocation.lng, end.lat, end.lng);
      const routeDist = Math.min(distToStart, distToEnd);
      if (routeDist < minDistance) {
        minDistance = routeDist;
        nearestRoute = route;
      }
    });

    return nearestRoute;
  }, [userLocation, routes]);

  const handleStartNavigation = useCallback((route?: SafeRoute) => {
    const routeToUse = route || findNearestRoute();
    if (routeToUse) {
      startNavigation(routeToUse);
      onStartNavigation?.(routeToUse);
    } else {
      setRoutingError('No safe routes available.');
    }
  }, [startNavigation, onStartNavigation, findNearestRoute]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-[500px] rounded-lg" />

      {/* Heatmap Toggle Switch */}
      <div className="absolute top-4 right-4 z-[1000] bg-white p-2 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2">
          <Switch
            id="heatmap-toggle"
            checked={heatmapMode === 'risk'}
            onCheckedChange={(checked) => setHeatmapMode(checked ? 'risk' : 'all')}
          />
          <Label htmlFor="heatmap-toggle">
            {heatmapMode === 'all' ? 'Normal Heatmap' : 'Risk Heatmap'}
          </Label>
        </div>
      </div>

      {mode === 'tourist' && (
        <>
          <Button
            onClick={getCurrentLocation}
            className="absolute top-4 right-4 z-[1000] w-12 h-12 rounded-full shadow-lg bg-card hover:bg-card/90"
            size="icon"
            variant="outline"
          >
            <Locate className="w-5 h-5" />
          </Button>

          {userLocation && (
            <Card className="absolute bottom-4 left-4 right-4 z-[1000] bg-card/95 backdrop-blur-sm">
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
                    onClick={() => handleStartNavigation()}
                    className="flex flex-col gap-1 h-auto py-3 rounded-xl"
                  >
                    <Navigation className="w-4 h-4 text-primary" />
                    <span className="text-xs">Navigate</span>
                  </Button>
                </div>
                {selectedRoute && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <h4 className="font-medium text-sm mb-1">Navigating: {selectedRoute.name}</h4>
                    <p className="text-xs text-gray-600">{selectedRoute.from} → {selectedRoute.to}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{selectedRoute.distance}</Badge>
                      <Badge variant="secondary" className="text-xs">{selectedRoute.duration}</Badge>
                    </div>
                    {selectedRoute.warnings.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-yellow-600">Warnings:</p>
                        <ul className="text-xs text-gray-600 list-disc list-inside">
                          {selectedRoute.warnings.map((warning, i) => (
                            <li key={i}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {showPanicButton && (
            <Button
              onClick={handlePanic}
              className="fixed bottom-20 right-4 z-[1000] w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg animate-pulse"
              size="icon"
            >
              <Phone className="w-6 h-6" />
            </Button>
          )}
        </>
      )}

      <Card className="absolute top-24 left-4 z-[1000] bg-card/95 backdrop-blur-sm">
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

      {locationError && (
        <Card className="absolute top-40 left-4 right-4 z-[1000] bg-destructive/10 border-destructive">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">{locationError}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {routingError && (
        <Card className="absolute top-56 left-4 right-4 z-[1000] bg-destructive/10 border-destructive">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">{routingError}</span>
            </div>
          </CardContent>
        </Card>
      )}

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
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }

        .custom-marker, .user-location-wrapper {
          background: none !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
};

export default MapView;