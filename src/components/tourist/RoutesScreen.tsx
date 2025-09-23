import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Navigation, MapPin, Clock, Shield, Star,
  Route, AlertTriangle, Phone, Info
} from 'lucide-react';
import { SafeRoute } from '@/types';
import NavigationScreen from './NavigationScreen';

const RoutesScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState<SafeRoute | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const safeRoutes: SafeRoute[] = [
  {
    "id": "route_1",
    "name": "Itanagar to Tawang Safe Route",
    "from": "Itanagar",
    "to": "Tawang Monastery",
    "distance": "450 km",
    "duration": "12 hours",
    "safetyRating": 4.2,
    "coordinates": [
      [93.6098, 27.0960],
      [93.5000, 27.0000],
      [92.8000, 26.8000],
      [92.4000, 26.5000],
      [91.8665, 27.5853]
    ],
    "waypoints": [
      { "lat": 27.0960, "lng": 93.6098, "name": "Itanagar Start", "type": "checkpoint" },
      { "lat": 27.0000, "lng": 93.5000, "name": "Papum Pare Checkpoint", "type": "checkpoint" },
      { "lat": 26.5000, "lng": 92.4000, "name": "Bomdila Junction", "type": "landmark" },
      { "lat": 27.5853, "lng": 91.8665, "name": "Tawang Monastery", "type": "checkpoint" }
    ],
    "warnings": [
      "Obtain Inner Line Permit (ILP) mandatory",
      "Travel only during daylight (6 AM to 5 PM)",
      "Check for landslides in monsoon",
      "Roads challenging due to terrain"
    ],
    "lastUpdated": "2025-09-15"
  },
  {
    "id": "route_2",
    "name": "Ziro Valley to Namdapha Trek Route",
    "from": "Ziro Valley",
    "to": "Namdapha National Park",
    "distance": "350 km",
    "duration": "10 hours",
    "safetyRating": 4.0,
    "coordinates": [
      [93.8351, 27.5880],
      [94.0000, 27.4000],
      [94.5000, 27.2000],
      [95.0000, 27.0000],
      [95.5800, 27.4600]
    ],
    "waypoints": [
      { "lat": 27.5880, "lng": 93.8351, "name": "Ziro Valley Start", "type": "checkpoint" },
      { "lat": 27.4000, "lng": 94.0000, "name": "Hapoli Checkpoint", "type": "checkpoint" },
      { "lat": 27.0000, "lng": 95.0000, "name": "Changlang District", "type": "landmark" },
      { "lat": 27.4600, "lng": 95.5800, "name": "Namdapha National Park", "type": "checkpoint" }
    ],
    "warnings": [
      "Wildlife encounters possible - maintain distance",
      "Trekking requires guide and permits",
      "Avoid during heavy rains due to flooding",
      "Carry insect repellent for biodiversity hotspot"
    ],
    "lastUpdated": "2025-09-15"
  },
  {
    "id": "route_3",
    "name": "Guwahati to Kaziranga Safari Route",
    "from": "Guwahati",
    "to": "Kaziranga National Park",
    "distance": "220 km",
    "duration": "4 hours",
    "safetyRating": 4.7,
    "coordinates": [
      [91.7362, 26.1444],
      [92.2000, 26.2000],
      [92.5000, 26.4000],
      [93.0000, 26.6000],
      [93.2076, 26.6745]
    ],
    "waypoints": [
      { "lat": 26.1444, "lng": 91.7362, "name": "Guwahati Start", "type": "checkpoint" },
      { "lat": 26.2000, "lng": 92.2000, "name": "Nagaon Checkpoint", "type": "checkpoint" },
      { "lat": 26.6000, "lng": 93.0000, "name": "Numaligarh", "type": "landmark" },
      { "lat": 26.6745, "lng": 93.2076, "name": "Kaziranga National Park", "type": "checkpoint" }
    ],
    "warnings": [
      "Stick to marked safari routes",
      "Keep safe distance from wildlife like rhinos",
      "Avoid night travel due to banditry risks",
      "Book jeep/elephant safaris in advance"
    ],
    "lastUpdated": "2025-09-15"
  },
  {
    "id": "route_4",
    "name": "Kaziranga to Majuli Island Ferry Route",
    "from": "Kaziranga National Park",
    "to": "Majuli Island",
    "distance": "200 km",
    "duration": "5 hours (including ferry)",
    "safetyRating": 4.6,
    "coordinates": [
      [93.2076, 26.6745],
      [93.5000, 26.8000],
      [93.8000, 26.9000],
      [94.1167, 26.9500]
    ],
    "waypoints": [
      { "lat": 26.6745, "lng": 93.2076, "name": "Kaziranga Start", "type": "checkpoint" },
      { "lat": 26.8000, "lng": 93.5000, "name": "Jorhat Checkpoint", "type": "checkpoint" },
      { "lat": 26.9000, "lng": 93.8000, "name": "Nimati Ghat", "type": "ferry" },
      { "lat": 26.9500, "lng": 94.1167, "name": "Majuli Island", "type": "checkpoint" }
    ],
    "warnings": [
      "Check ferry timings at Nimati Ghat",
      "Monsoon flooding affects access",
      "Respect Vaishnavite satras and local culture",
      "Use licensed boats for river safety"
    ],
    "lastUpdated": "2025-09-15"
  },
  {
    "id": "route_5",
    "name": "Guwahati to Manas National Park Route",
    "from": "Guwahati",
    "to": "Manas National Park",
    "distance": "150 km",
    "duration": "3.5 hours",
    "safetyRating": 4.4,
    "coordinates": [
      [91.7362, 26.1444],
      [91.9000, 26.3000],
      [91.9500, 26.4000],
      [91.7362, 26.1445]
    ],
    "waypoints": [
      { "lat": 26.1444, "lng": 91.7362, "name": "Guwahati Start", "type": "checkpoint" },
      { "lat": 26.3000, "lng": 91.9000, "name": "Barpeta Road Checkpoint", "type": "checkpoint" },
      { "lat": 26.4000, "lng": 91.9500, "name": "Bongaigaon", "type": "landmark" },
      { "lat": 26.1445, "lng": 91.7362, "name": "Manas National Park", "type": "checkpoint" }
    ],
    "warnings": [
      "Tiger reserve - follow guided safaris only",
      "Border area with Bhutan - carry ID",
      "Flood-prone in monsoon",
      "Limited accommodations, book ahead"
    ],
    "lastUpdated": "2025-09-15"
  },
  {
    "id": "route_6",
    "name": "Shillong to Cherrapunji Scenic Route",
    "from": "Shillong",
    "to": "Cherrapunji",
    "distance": "54 km",
    "duration": "1.5 hours",
    "safetyRating": 4.8,
    "coordinates": [
      [91.8933, 25.5788],
      [91.8700, 25.5500],
      [91.8400, 25.5200],
      [91.8000, 25.4800],
      [91.7362, 25.2993]
    ],
    "waypoints": [
      { "lat": 25.5788, "lng": 91.8933, "name": "Shillong Start", "type": "checkpoint" },
      { "lat": 25.5500, "lng": 91.8700, "name": "Mawkdok Checkpoint", "type": "checkpoint" },
      { "lat": 25.4800, "lng": 91.8000, "name": "Sohra Viewpoint", "type": "landmark" },
      { "lat": 25.2993, "lng": 91.7362, "name": "Cherrapunji", "type": "checkpoint" }
    ],
    "warnings": [
      "Heavy rainfall - check weather",
      "Slippery roads near waterfalls",
      "Monsoon restrictions on root bridges",
      "Hire local guides for treks"
    ],
    "lastUpdated": "2025-09-15"
  },
  {
    "id": "route_7",
    "name": "Shillong City to Mawlynnong Eco Route",
    "from": "Shillong",
    "to": "Mawlynnong",
    "distance": "90 km",
    "duration": "2.5 hours",
    "safetyRating": 4.9,
    "coordinates": [
      [91.8933, 25.5788],
      [91.9000, 25.5000],
      [91.8500, 25.4000],
      [91.8500, 25.3000],
      [91.8667, 25.2667]
    ],
    "waypoints": [
      { "lat": 25.5788, "lng": 91.8933, "name": "Shillong Start", "type": "checkpoint" },
      { "lat": 25.5000, "lng": 91.9000, "name": "Pynursla Checkpoint", "type": "checkpoint" },
      { "lat": 25.3000, "lng": 91.8500, "name": "Synthew", "type": "landmark" },
      { "lat": 25.2667, "lng": 91.8667, "name": "Mawlynnong Village", "type": "checkpoint" }
    ],
    "warnings": [
      "Eco-village - no plastics allowed",
      "Short treks to root bridges - wear sturdy shoes",
      "Limited parking, arrive early",
      "Respect cleanliness rules"
    ],
    "lastUpdated": "2025-09-15"
  },
  {
    "id": "route_8",
    "name": "Mawlynnong to Dawki River Route",
    "from": "Mawlynnong",
    "to": "Dawki",
    "distance": "20 km",
    "duration": "45 minutes",
    "safetyRating": 4.7,
    "coordinates": [
      [91.8667, 25.2667],
      [91.8700, 25.2500],
      [91.8800, 25.2000],
      [92.0167, 25.2000]
    ],
    "waypoints": [
      { "lat": 25.2667, "lng": 91.8667, "name": "Mawlynnong Start", "type": "checkpoint" },
      { "lat": 25.2500, "lng": 91.8700, "name": "Shnongpdeng Junction", "type": "checkpoint" },
      { "lat": 25.2000, "lng": 91.8800, "name": "Umngot River View", "type": "landmark" },
      { "lat": 25.2000, "lng": 92.0167, "name": "Dawki Boating Point", "type": "checkpoint" }
    ],
    "warnings": [
      "Border area - carry ID for checks",
      "Boat rides on crystal river - life jackets mandatory",
      "Avoid during high water levels",
      "No swimming in Umngot River"
    ],
    "lastUpdated": "2025-09-15"
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
            onClick={() => navigate(selectedRoute ? '/routes' : '/zones')}
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