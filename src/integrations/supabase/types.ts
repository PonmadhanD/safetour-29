export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          alert_id: string
          expires_at: string | null
          issued_at: string
          issued_by: string
          message: string
          severity: Database["public"]["Enums"]["alert_severity"]
          target_tourist: string | null
          target_zone: string | null
        }
        Insert: {
          alert_id?: string
          expires_at?: string | null
          issued_at?: string
          issued_by: string
          message: string
          severity?: Database["public"]["Enums"]["alert_severity"]
          target_tourist?: string | null
          target_zone?: string | null
        }
        Update: {
          alert_id?: string
          expires_at?: string | null
          issued_at?: string
          issued_by?: string
          message?: string
          severity?: Database["public"]["Enums"]["alert_severity"]
          target_tourist?: string | null
          target_zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_issued_by_fkey"
            columns: ["issued_by"]
            isOneToOne: false
            referencedRelation: "authority_profiles"
            referencedColumns: ["authority_id"]
          },
          {
            foreignKeyName: "alerts_target_tourist_fkey"
            columns: ["target_tourist"]
            isOneToOne: false
            referencedRelation: "tourist_profiles"
            referencedColumns: ["tourist_id"]
          },
          {
            foreignKeyName: "alerts_target_zone_fkey"
            columns: ["target_zone"]
            isOneToOne: false
            referencedRelation: "safe_zones"
            referencedColumns: ["zone_id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action_by: string
          action_type: string
          created_at: string
          details: Json | null
          log_id: string
        }
        Insert: {
          action_by: string
          action_type: string
          created_at?: string
          details?: Json | null
          log_id?: string
        }
        Update: {
          action_by?: string
          action_type?: string
          created_at?: string
          details?: Json | null
          log_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_action_by_fkey"
            columns: ["action_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      authority_profiles: {
        Row: {
          authority_id: string
          badge_id: string
          created_at: string
          department: string
          designation: string
          jurisdiction_area: string | null
          name: string
          updated_at: string
        }
        Insert: {
          authority_id: string
          badge_id: string
          created_at?: string
          department: string
          designation: string
          jurisdiction_area?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          authority_id?: string
          badge_id?: string
          created_at?: string
          department?: string
          designation?: string
          jurisdiction_area?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "authority_profiles_authority_id_fkey"
            columns: ["authority_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      efir_reports: {
        Row: {
          description: string
          filed_at: string
          filed_by: string
          fir_id: string
          handled_by: string | null
          status: Database["public"]["Enums"]["fir_status"]
          updated_at: string
        }
        Insert: {
          description: string
          filed_at?: string
          filed_by: string
          fir_id?: string
          handled_by?: string | null
          status?: Database["public"]["Enums"]["fir_status"]
          updated_at?: string
        }
        Update: {
          description?: string
          filed_at?: string
          filed_by?: string
          fir_id?: string
          handled_by?: string | null
          status?: Database["public"]["Enums"]["fir_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "efir_reports_filed_by_fkey"
            columns: ["filed_by"]
            isOneToOne: false
            referencedRelation: "tourist_profiles"
            referencedColumns: ["tourist_id"]
          },
          {
            foreignKeyName: "efir_reports_handled_by_fkey"
            columns: ["handled_by"]
            isOneToOne: false
            referencedRelation: "authority_profiles"
            referencedColumns: ["authority_id"]
          },
        ]
      }
      panic_requests: {
        Row: {
          latitude: number
          longitude: number
          message: string | null
          panic_id: string
          resolved_at: string | null
          resolved_by: string | null
          tourist_id: string
          triggered_at: string
        }
        Insert: {
          latitude: number
          longitude: number
          message?: string | null
          panic_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          tourist_id: string
          triggered_at?: string
        }
        Update: {
          latitude?: number
          longitude?: number
          message?: string | null
          panic_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          tourist_id?: string
          triggered_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "panic_requests_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "authority_profiles"
            referencedColumns: ["authority_id"]
          },
          {
            foreignKeyName: "panic_requests_tourist_id_fkey"
            columns: ["tourist_id"]
            isOneToOne: false
            referencedRelation: "tourist_profiles"
            referencedColumns: ["tourist_id"]
          },
        ]
      }
      safe_routes: {
        Row: {
          created_at: string
          name: string
          path_coordinates: Json
          route_id: string
          safety_level: Database["public"]["Enums"]["safety_level"]
          updated_at: string
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          name: string
          path_coordinates: Json
          route_id?: string
          safety_level?: Database["public"]["Enums"]["safety_level"]
          updated_at?: string
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          name?: string
          path_coordinates?: Json
          route_id?: string
          safety_level?: Database["public"]["Enums"]["safety_level"]
          updated_at?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "safe_routes_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "authority_profiles"
            referencedColumns: ["authority_id"]
          },
        ]
      }
      safe_zones: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          name: string
          polygon_coordinates: Json
          safety_level: Database["public"]["Enums"]["safety_level"]
          updated_at: string
          zone_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          name: string
          polygon_coordinates: Json
          safety_level?: Database["public"]["Enums"]["safety_level"]
          updated_at?: string
          zone_id?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          name?: string
          polygon_coordinates?: Json
          safety_level?: Database["public"]["Enums"]["safety_level"]
          updated_at?: string
          zone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "safe_zones_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "authority_profiles"
            referencedColumns: ["authority_id"]
          },
        ]
      }
      tourist_locations: {
        Row: {
          latitude: number
          location_id: string
          longitude: number
          status: Database["public"]["Enums"]["location_status"]
          timestamp: string
          tourist_id: string
        }
        Insert: {
          latitude: number
          location_id?: string
          longitude: number
          status?: Database["public"]["Enums"]["location_status"]
          timestamp?: string
          tourist_id: string
        }
        Update: {
          latitude?: number
          location_id?: string
          longitude?: number
          status?: Database["public"]["Enums"]["location_status"]
          timestamp?: string
          tourist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tourist_locations_tourist_id_fkey"
            columns: ["tourist_id"]
            isOneToOne: false
            referencedRelation: "tourist_profiles"
            referencedColumns: ["tourist_id"]
          },
        ]
      }
      tourist_profiles: {
        Row: {
          created_at: string
          date_of_birth: string | null
          digital_id_verified: boolean
          emergency_contact: string | null
          full_name: string
          gender: string | null
          govt_id: string | null
          nationality: string | null
          passport_no: string | null
          photo_url: string | null
          tourist_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          digital_id_verified?: boolean
          emergency_contact?: string | null
          full_name: string
          gender?: string | null
          govt_id?: string | null
          nationality?: string | null
          passport_no?: string | null
          photo_url?: string | null
          tourist_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          digital_id_verified?: boolean
          emergency_contact?: string | null
          full_name?: string
          gender?: string | null
          govt_id?: string | null
          nationality?: string | null
          passport_no?: string | null
          photo_url?: string | null
          tourist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tourist_profiles_tourist_id_fkey"
            columns: ["tourist_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      travel_history: {
        Row: {
          check_in_time: string
          check_out_time: string | null
          history_id: string
          route_id: string | null
          tourist_id: string
          zone_id: string | null
        }
        Insert: {
          check_in_time?: string
          check_out_time?: string | null
          history_id?: string
          route_id?: string | null
          tourist_id: string
          zone_id?: string | null
        }
        Update: {
          check_in_time?: string
          check_out_time?: string | null
          history_id?: string
          route_id?: string | null
          tourist_id?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "travel_history_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "safe_routes"
            referencedColumns: ["route_id"]
          },
          {
            foreignKeyName: "travel_history_tourist_id_fkey"
            columns: ["tourist_id"]
            isOneToOne: false
            referencedRelation: "tourist_profiles"
            referencedColumns: ["tourist_id"]
          },
          {
            foreignKeyName: "travel_history_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "safe_zones"
            referencedColumns: ["zone_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          email?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_authority: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_tourist: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      alert_severity: "info" | "warning" | "critical"
      fir_status: "open" | "in_progress" | "closed"
      location_status: "active" | "sos" | "offline"
      safety_level: "safe" | "caution" | "danger"
      user_role: "tourist" | "authority" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_severity: ["info", "warning", "critical"],
      fir_status: ["open", "in_progress", "closed"],
      location_status: ["active", "sos", "offline"],
      safety_level: ["safe", "caution", "danger"],
      user_role: ["tourist", "authority", "admin"],
    },
  },
} as const
