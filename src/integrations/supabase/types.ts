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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      machines: {
        Row: {
          accuracy: string | null
          available_hours_per_day: number | null
          capacity_description: string | null
          created_at: string
          id: string
          idle_capacity_percent: number | null
          is_active: boolean | null
          machine_type: Database["public"]["Enums"]["machine_type"]
          name: string
          supplier_id: string
          table_size: string | null
          tonnage: number | null
          updated_at: string
          xyz_capacity: string | null
        }
        Insert: {
          accuracy?: string | null
          available_hours_per_day?: number | null
          capacity_description?: string | null
          created_at?: string
          id?: string
          idle_capacity_percent?: number | null
          is_active?: boolean | null
          machine_type: Database["public"]["Enums"]["machine_type"]
          name: string
          supplier_id: string
          table_size?: string | null
          tonnage?: number | null
          updated_at?: string
          xyz_capacity?: string | null
        }
        Update: {
          accuracy?: string | null
          available_hours_per_day?: number | null
          capacity_description?: string | null
          created_at?: string
          id?: string
          idle_capacity_percent?: number | null
          is_active?: boolean | null
          machine_type?: Database["public"]["Enums"]["machine_type"]
          name?: string
          supplier_id?: string
          table_size?: string | null
          tonnage?: number | null
          updated_at?: string
          xyz_capacity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "machines_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      order_timeline: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_timeline_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          admin_notes: string | null
          admin_selected_supplier_id: string | null
          assigned_by: string | null
          client_id: string
          created_at: string
          deadline: string | null
          description: string | null
          final_price: number | null
          id: string
          internal_po_number: string | null
          material: string | null
          priority: Database["public"]["Enums"]["priority_level"] | null
          process: Database["public"]["Enums"]["manufacturing_process"] | null
          production_end: string | null
          production_start: string | null
          qa_notes: string | null
          quantity: number | null
          quotation_pdf_url: string | null
          quote_request_id: string | null
          quoted_price: number | null
          selection_reason: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          suggested_material: string | null
          suggested_process: string | null
          supplier_id: string | null
          supplier_lead_days: number | null
          supplier_price: number | null
          supplier_submitted_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          admin_selected_supplier_id?: string | null
          assigned_by?: string | null
          client_id: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          final_price?: number | null
          id?: string
          internal_po_number?: string | null
          material?: string | null
          priority?: Database["public"]["Enums"]["priority_level"] | null
          process?: Database["public"]["Enums"]["manufacturing_process"] | null
          production_end?: string | null
          production_start?: string | null
          qa_notes?: string | null
          quantity?: number | null
          quotation_pdf_url?: string | null
          quote_request_id?: string | null
          quoted_price?: number | null
          selection_reason?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          suggested_material?: string | null
          suggested_process?: string | null
          supplier_id?: string | null
          supplier_lead_days?: number | null
          supplier_price?: number | null
          supplier_submitted_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          admin_selected_supplier_id?: string | null
          assigned_by?: string | null
          client_id?: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          final_price?: number | null
          id?: string
          internal_po_number?: string | null
          material?: string | null
          priority?: Database["public"]["Enums"]["priority_level"] | null
          process?: Database["public"]["Enums"]["manufacturing_process"] | null
          production_end?: string | null
          production_start?: string | null
          qa_notes?: string | null
          quantity?: number | null
          quotation_pdf_url?: string | null
          quote_request_id?: string | null
          quoted_price?: number | null
          selection_reason?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          suggested_material?: string | null
          suggested_process?: string | null
          supplier_id?: string | null
          supplier_lead_days?: number | null
          supplier_price?: number | null
          supplier_submitted_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          business_name: string | null
          business_type: Database["public"]["Enums"]["business_type"] | null
          company_name: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          location_address: string | null
          location_lat: number | null
          location_lng: number | null
          phone: string | null
          profile_completed: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          business_name?: string | null
          business_type?: Database["public"]["Enums"]["business_type"] | null
          company_name?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          phone?: string | null
          profile_completed?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          business_name?: string | null
          business_type?: Database["public"]["Enums"]["business_type"] | null
          company_name?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          phone?: string | null
          profile_completed?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          ai_analysis: Json | null
          client_id: string
          complexity: string | null
          created_at: string
          description: string | null
          dimensions: string | null
          estimated_time: string | null
          file_urls: string[] | null
          id: string
          material: string | null
          notes: string | null
          process: Database["public"]["Enums"]["manufacturing_process"] | null
          quantity: number | null
          status: Database["public"]["Enums"]["order_status"] | null
          surface_finish: string | null
          title: string
          tolerances: string | null
          updated_at: string
        }
        Insert: {
          ai_analysis?: Json | null
          client_id: string
          complexity?: string | null
          created_at?: string
          description?: string | null
          dimensions?: string | null
          estimated_time?: string | null
          file_urls?: string[] | null
          id?: string
          material?: string | null
          notes?: string | null
          process?: Database["public"]["Enums"]["manufacturing_process"] | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["order_status"] | null
          surface_finish?: string | null
          title: string
          tolerances?: string | null
          updated_at?: string
        }
        Update: {
          ai_analysis?: Json | null
          client_id?: string
          complexity?: string | null
          created_at?: string
          description?: string | null
          dimensions?: string | null
          estimated_time?: string | null
          file_urls?: string[] | null
          id?: string
          material?: string | null
          notes?: string | null
          process?: Database["public"]["Enums"]["manufacturing_process"] | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["order_status"] | null
          surface_finish?: string | null
          title?: string
          tolerances?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      supplier_recommendations: {
        Row: {
          capability_score: number | null
          created_at: string
          id: string
          location_score: number | null
          order_id: string
          payment_score: number | null
          performance_score: number | null
          rank: number | null
          specialty_score: number | null
          supplier_id: string
          total_score: number | null
        }
        Insert: {
          capability_score?: number | null
          created_at?: string
          id?: string
          location_score?: number | null
          order_id: string
          payment_score?: number | null
          performance_score?: number | null
          rank?: number | null
          specialty_score?: number | null
          supplier_id: string
          total_score?: number | null
        }
        Update: {
          capability_score?: number | null
          created_at?: string
          id?: string
          location_score?: number | null
          order_id?: string
          payment_score?: number | null
          performance_score?: number | null
          rank?: number | null
          specialty_score?: number | null
          supplier_id?: string
          total_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_recommendations_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_recommendations_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          capabilities:
            | Database["public"]["Enums"]["manufacturing_process"][]
            | null
          capacity_3d_printing: number | null
          capacity_cnc: number | null
          capacity_other: number | null
          capacity_sheet_metal: number | null
          certifications: string[] | null
          company_name: string
          contact_email: string
          contact_phone: string | null
          created_at: string
          id: string
          is_active: boolean | null
          location_lat: number | null
          location_lng: number | null
          on_time_rate: number | null
          operating_hours_end: string | null
          operating_hours_start: string | null
          payment_preference:
            | Database["public"]["Enums"]["payment_preference"]
            | null
          performance_score: number | null
          profile_completed: boolean | null
          provides_raw_material: boolean | null
          quality_score: number | null
          specialties:
            | Database["public"]["Enums"]["supplier_specialty"][]
            | null
          total_jobs_completed: number | null
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          address?: string | null
          capabilities?:
            | Database["public"]["Enums"]["manufacturing_process"][]
            | null
          capacity_3d_printing?: number | null
          capacity_cnc?: number | null
          capacity_other?: number | null
          capacity_sheet_metal?: number | null
          certifications?: string[] | null
          company_name: string
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          on_time_rate?: number | null
          operating_hours_end?: string | null
          operating_hours_start?: string | null
          payment_preference?:
            | Database["public"]["Enums"]["payment_preference"]
            | null
          performance_score?: number | null
          profile_completed?: boolean | null
          provides_raw_material?: boolean | null
          quality_score?: number | null
          specialties?:
            | Database["public"]["Enums"]["supplier_specialty"][]
            | null
          total_jobs_completed?: number | null
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          address?: string | null
          capabilities?:
            | Database["public"]["Enums"]["manufacturing_process"][]
            | null
          capacity_3d_printing?: number | null
          capacity_cnc?: number | null
          capacity_other?: number | null
          capacity_sheet_metal?: number | null
          certifications?: string[] | null
          company_name?: string
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          on_time_rate?: number | null
          operating_hours_end?: string | null
          operating_hours_start?: string | null
          payment_preference?:
            | Database["public"]["Enums"]["payment_preference"]
            | null
          performance_score?: number | null
          profile_completed?: boolean | null
          provides_raw_material?: boolean | null
          quality_score?: number | null
          specialties?:
            | Database["public"]["Enums"]["supplier_specialty"][]
            | null
          total_jobs_completed?: number | null
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
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
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "client" | "supplier" | "internal_ops" | "admin"
      business_type: "factory" | "startup" | "trader" | "other"
      machine_type:
        | "cnc_milling"
        | "cnc_lathe"
        | "laser_cutting"
        | "plasma_cutting"
        | "bending"
        | "wire_cutting"
        | "die_casting"
        | "metal_3d_printing"
        | "welding"
        | "surface_finishing"
        | "other"
      manufacturing_process:
        | "cnc_machining"
        | "sheet_metal"
        | "3d_printing"
        | "injection_molding"
        | "casting"
        | "laser_cutting"
        | "welding"
        | "other"
      order_status:
        | "draft"
        | "pending_review"
        | "quoted"
        | "accepted"
        | "in_production"
        | "qa_review"
        | "completed"
        | "cancelled"
      payment_preference: "cash" | "partial" | "credit"
      priority_level: "low" | "medium" | "high" | "urgent"
      supplier_specialty:
        | "cnc_spare_parts"
        | "sheet_metal_fabrication"
        | "gear_machining"
        | "tube_cutting"
        | "wire_cutting"
        | "die_casting"
        | "metal_3d_printing"
        | "welding_assembly"
        | "surface_finishing"
        | "galvanization"
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
      app_role: ["client", "supplier", "internal_ops", "admin"],
      business_type: ["factory", "startup", "trader", "other"],
      machine_type: [
        "cnc_milling",
        "cnc_lathe",
        "laser_cutting",
        "plasma_cutting",
        "bending",
        "wire_cutting",
        "die_casting",
        "metal_3d_printing",
        "welding",
        "surface_finishing",
        "other",
      ],
      manufacturing_process: [
        "cnc_machining",
        "sheet_metal",
        "3d_printing",
        "injection_molding",
        "casting",
        "laser_cutting",
        "welding",
        "other",
      ],
      order_status: [
        "draft",
        "pending_review",
        "quoted",
        "accepted",
        "in_production",
        "qa_review",
        "completed",
        "cancelled",
      ],
      payment_preference: ["cash", "partial", "credit"],
      priority_level: ["low", "medium", "high", "urgent"],
      supplier_specialty: [
        "cnc_spare_parts",
        "sheet_metal_fabrication",
        "gear_machining",
        "tube_cutting",
        "wire_cutting",
        "die_casting",
        "metal_3d_printing",
        "welding_assembly",
        "surface_finishing",
        "galvanization",
      ],
    },
  },
} as const
