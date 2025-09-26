import * as L from "leaflet";

declare module "leaflet" {
  function heatLayer(
    latlngs: L.LatLngExpression[] | [number, number, number][],
    options?: {
      minOpacity?: number;
      maxZoom?: number;
      radius?: number;
      blur?: number;
      max?: number;
      gradient?: { [key: number]: string };
    }
  ): L.Layer;
}

export interface EmergencyContact {
  // Define fields as needed
  name: string;
  phone: string;
}

export interface TravelRecord {
  // Define fields as needed
  location: string;
  timestamp: string;
}

export interface Tourist {
  id: string;
  name: string;
  email: string;
  phone: string;
  digitalId: string;
  isVerified: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  emergencyContacts: EmergencyContact[];
  travelHistory: TravelRecord[];
  status: 'active now' | 'active alerts' | 'emergency' | 'resolved today';
  lastActive: string;
  resolvedAt?: string;
}
export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface TravelRecord {
  id: string;
  destination: string;
  checkInTime: string;
  checkOutTime?: string;
  purpose: string;
  companions?: string[];
  notes?: string;
}

export interface Alert {
  id: string;
  type: 'weather' | 'security' | 'health' | 'emergency' | 'geofence';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: {
    lat: number;
    lng: number;
    radius?: number;
  };
  isActive: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export interface Zone {
  id: string;
  name: string;
  description: string;
  category: 'tourist' | 'cultural' | 'adventure' | 'religious' | 'nature';
  safetyLevel: 'high' | 'medium' | 'low';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  features: string[];
  bestTime: string;
  guidelines: string[];
  emergencyContacts: string[];
}

export interface SafeRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  distance: string;
  duration: string;
  safetyRating: number;
  coordinates: [number, number][];
  waypoints: { lat: number; lng: number; name?: string; type?: string }[];
  warnings: string[];
  lastUpdated: string;
}

export interface AuthorityUser {
  id: string;
  name: string;
  email: string;
  role: 'officer' | 'supervisor' | 'admin';
  department: string;
  badge: string;
  permissions: string[];
}

export interface EFir {
  id: string;
  touristId: string;
  incidentType: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  reportedAt: string;
  status: 'pending' | 'investigating' | 'resolved' | 'closed';
  assignedOfficer?: string;
  evidence?: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export type AppView = 'tourist' | 'authority';
export type TouristPage = 'splash' | 'onboarding' | 'digitalId' | 'home' | 'zones' | 'routes' | 'panic' | 'history' | 'settings' | 'map' | 'familyTracking' | 'attractions';
export type AuthorityPage = 'login' | 'dashboard' | 'verification' | 'alerts' | 'efir' | 'analytics' | 'settings';