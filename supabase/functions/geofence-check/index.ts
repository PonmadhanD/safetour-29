import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GeofenceCheckRequest {
  tourist_id: string;
  latitude: number;
  longitude: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { tourist_id, latitude, longitude }: GeofenceCheckRequest = await req.json();

    console.log(`Checking geofence for tourist ${tourist_id} at ${latitude}, ${longitude}`);

    // Update tourist location
    const { error: locationError } = await supabaseClient
      .from('tourist_locations')
      .insert({
        tourist_id,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
        status: 'active'
      });

    if (locationError) {
      console.error('Error updating location:', locationError);
    }

    // Get all safe zones
    const { data: safeZones, error: zonesError } = await supabaseClient
      .from('safe_zones')
      .select('*');

    if (zonesError) {
      console.error('Error fetching safe zones:', zonesError);
      throw new Error('Failed to fetch safe zones');
    }

    let isInSafeZone = false;
    let violatedZones: any[] = [];

    // Check if tourist is within any safe zone
    for (const zone of safeZones || []) {
      const isInsideZone = isPointInPolygon(
        { lat: latitude, lng: longitude },
        zone.polygon_coordinates
      );

      if (isInsideZone && zone.safety_level === 'safe') {
        isInSafeZone = true;
        break;
      } else if (isInsideZone && zone.safety_level === 'dangerous') {
        violatedZones.push(zone);
      }
    }

    // Create geofence violation if needed
    if (!isInSafeZone || violatedZones.length > 0) {
      const violationType = violatedZones.length > 0 ? 'danger_zone_entry' : 'zone_exit';
      const severity = violatedZones.length > 0 ? 'high' : 'medium';

      const { error: violationError } = await supabaseClient
        .from('geofence_violations')
        .insert({
          tourist_id,
          zone_id: violatedZones[0]?.zone_id || null,
          violation_type: violationType,
          latitude,
          longitude,
          severity,
          timestamp: new Date().toISOString()
        });

      if (violationError) {
        console.error('Error creating violation:', violationError);
      }

      // Create alert for authorities
      const alertMessage = violationType === 'danger_zone_entry' 
        ? `Tourist entered danger zone: ${violatedZones[0]?.name}`
        : `Tourist exited safe zone`;

      const { error: alertError } = await supabaseClient
        .from('alerts')
        .insert({
          severity: severity === 'high' ? 'critical' : 'medium',
          message: alertMessage,
          target_tourist: tourist_id,
          issued_by: tourist_id // System generated
        });

      if (alertError) {
        console.error('Error creating alert:', alertError);
      }

      console.log(`Geofence violation detected: ${violationType} for tourist ${tourist_id}`);
    }

    const response = {
      success: true,
      isInSafeZone,
      violations: violatedZones.length,
      message: isInSafeZone 
        ? 'Tourist is in a safe zone' 
        : violatedZones.length > 0 
          ? 'Tourist entered danger zone - immediate assistance required!'
          : 'Tourist left safe zone - monitoring required',
      severity: violatedZones.length > 0 ? 'high' : isInSafeZone ? 'low' : 'medium'
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Geofence check error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Helper function to check if a point is inside a polygon
function isPointInPolygon(point: { lat: number; lng: number }, polygon: any): boolean {
  // Simple polygon check - in real implementation, use more robust algorithm
  if (!polygon || !polygon.coordinates) return false;
  
  try {
    const coords = polygon.coordinates[0]; // Assuming GeoJSON format
    let inside = false;
    
    for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
      const xi = coords[i][0], yi = coords[i][1];
      const xj = coords[j][0], yj = coords[j][1];
      
      if (((yi > point.lng) !== (yj > point.lng)) &&
          (point.lat < (xj - xi) * (point.lng - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    
    return inside;
  } catch (error) {
    console.error('Error checking point in polygon:', error);
    return false;
  }
}