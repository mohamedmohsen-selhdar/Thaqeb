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
          assigned_by: string | null
          client_id: string
          created_at: string
          deadline: string | null
          description: string | null
          final_price: number | null
          id: string
          material: string | null
          priority: Database["public"]["Enums"]["priority_level"] | null
          process: Database["public"]["Enums"]["manufacturing_process"] | null
          production_end: string | null
          production_start: string | null
          qa_notes: string | null
          quantity: number | null
          quote_request_id: string | null
          quoted_price: number | null
          status: Database["public"]["Enums"]["order_status"] | null
          supplier_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_by?: string | null
          client_id: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          final_price?: number | null
          id?: string
          material?: string | null
          priority?: Database["public"]["Enums"]["priority_level"] | null
          process?: Database["public"]["Enums"]["manufacturing_process"] | null
          production_end?: string | null
          production_start?: string | null
          qa_notes?: string | null
          quantity?: number | null
          quote_request_id?: string | null
          quoted_price?: number | null
          status?: Database["public"]["Enums"]["order_status"] | null
          supplier_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string | null
          client_id?: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          final_price?: number | null
          id?: string
          material?: string | null
          priority?: Database["public"]["Enums"]["priority_level"] | null
          process?: Database["public"]["Enums"]["manufacturing_process"] | null
          production_end?: string | null
          production_start?: string | null
          qa_notes?: string | null
          quantity?: number | null
          quote_request_id?: string | null
          quoted_price?: number | null
          status?: Database["public"]["Enums"]["order_status"] | null
          supplier_id?: string | null
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
          company_name: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
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
          on_time_rate: number | null
          quality_score: number | null
          updated_at: string
          user_id: string
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
          on_time_rate?: number | null
          quality_score?: number | null
          updated_at?: string
          user_id: string
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
          on_time_rate?: number | null
          quality_score?: number | null
          updated_at?: string
          user_id?: string
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
      priority_level: "low" | "medium" | "high" | "urgent"
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
      priority_level: ["low", "medium", "high", "urgent"],
    },
  },
} as const
