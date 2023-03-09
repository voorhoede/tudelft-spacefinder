export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      access_points_latest_states: {
        Row: {
          access_point_name: string
          building_number: number | null
          device_count: number
          floor: string
          location_hierarchy: string | null
          map_location: string | null
          room_id: string | null
          updated_at: string
        }
        Insert: {
          access_point_name: string
          building_number?: number | null
          device_count: number
          floor: string
          location_hierarchy?: string | null
          map_location?: string | null
          room_id?: string | null
          updated_at: string
        }
        Update: {
          access_point_name?: string
          building_number?: number | null
          device_count?: number
          floor?: string
          location_hierarchy?: string | null
          map_location?: string | null
          room_id?: string | null
          updated_at?: string
        }
      }
      buildings_latest_states: {
        Row: {
          building_number: number
          device_count: number
          updated_at: string
        }
        Insert: {
          building_number: number
          device_count: number
          updated_at: string
        }
        Update: {
          building_number?: number
          device_count?: number
          updated_at?: string
        }
      }
      busy: {
        Row: {
          created_at: string | null
          id: number
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          status?: string | null
        }
      }
      spaces_latest_states: {
        Row: {
          building_number: number
          device_count: number
          room_id: string
          updated_at: string
        }
        Insert: {
          building_number: number
          device_count: number
          room_id: string
          updated_at: string
        }
        Update: {
          building_number?: number
          device_count?: number
          room_id?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
