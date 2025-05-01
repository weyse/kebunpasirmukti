export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accommodations: {
        Row: {
          checkin_date: string
          checkout_date: string
          cost: number
          id: string
          nights_count: number
          registration_id: string
          room_count: number
          room_type: string
        }
        Insert: {
          checkin_date: string
          checkout_date: string
          cost?: number
          id?: string
          nights_count?: number
          registration_id: string
          room_count?: number
          room_type: string
        }
        Update: {
          checkin_date?: string
          checkout_date?: string
          cost?: number
          id?: string
          nights_count?: number
          registration_id?: string
          room_count?: number
          room_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "accommodations_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "guest_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      food_selections: {
        Row: {
          adult_menu: string | null
          buffet_menu: string | null
          children_menu: string | null
          cost: number
          id: string
          registration_id: string
          special_requests: string | null
        }
        Insert: {
          adult_menu?: string | null
          buffet_menu?: string | null
          children_menu?: string | null
          cost?: number
          id?: string
          registration_id: string
          special_requests?: string | null
        }
        Update: {
          adult_menu?: string | null
          buffet_menu?: string | null
          children_menu?: string | null
          cost?: number
          id?: string
          registration_id?: string
          special_requests?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_selections_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "guest_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_classes: {
        Row: {
          class_type: Database["public"]["Enums"]["class_type"]
          id: string
          registration_id: string
        }
        Insert: {
          class_type: Database["public"]["Enums"]["class_type"]
          id?: string
          registration_id: string
        }
        Update: {
          class_type?: Database["public"]["Enums"]["class_type"]
          id?: string
          registration_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_classes_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "guest_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_registrations: {
        Row: {
          address: string | null
          adult_count: number
          bank_name: string | null
          children_count: number
          created_at: string
          discount_percentage: number | null
          discounted_cost: number
          document_url: string | null
          down_payment: number | null
          extra_bed_cost: number
          id: string
          institution_name: string
          notes: string | null
          order_id: string
          package_type: string
          payment_date: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          phone_number: string
          responsible_person: string
          teacher_count: number
          total_cost: number
          updated_at: string
          visit_date: string
          visit_type: Database["public"]["Enums"]["visit_type"]
        }
        Insert: {
          address?: string | null
          adult_count?: number
          bank_name?: string | null
          children_count?: number
          created_at?: string
          discount_percentage?: number | null
          discounted_cost?: number
          document_url?: string | null
          down_payment?: number | null
          extra_bed_cost?: number
          id?: string
          institution_name: string
          notes?: string | null
          order_id: string
          package_type: string
          payment_date?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone_number: string
          responsible_person: string
          teacher_count?: number
          total_cost?: number
          updated_at?: string
          visit_date: string
          visit_type: Database["public"]["Enums"]["visit_type"]
        }
        Update: {
          address?: string | null
          adult_count?: number
          bank_name?: string | null
          children_count?: number
          created_at?: string
          discount_percentage?: number | null
          discounted_cost?: number
          document_url?: string | null
          down_payment?: number | null
          extra_bed_cost?: number
          id?: string
          institution_name?: string
          notes?: string | null
          order_id?: string
          package_type?: string
          payment_date?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone_number?: string
          responsible_person?: string
          teacher_count?: number
          total_cost?: number
          updated_at?: string
          visit_date?: string
          visit_type?: Database["public"]["Enums"]["visit_type"]
        }
        Relationships: []
      }
      packages: {
        Row: {
          description: string | null
          id: string
          name: string
          package_type: string
          price_per_adult: number
          price_per_child: number
          price_per_teacher: number
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          package_type: string
          price_per_adult: number
          price_per_child: number
          price_per_teacher: number
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          package_type?: string
          price_per_adult?: number
          price_per_child?: number
          price_per_teacher?: number
        }
        Relationships: []
      }
      rooms: {
        Row: {
          capacity: number
          id: string
          price_per_night: number
          room_name: string
          room_type: string
          status: Database["public"]["Enums"]["room_status"]
        }
        Insert: {
          capacity?: number
          id?: string
          price_per_night: number
          room_name: string
          room_type: string
          status?: Database["public"]["Enums"]["room_status"]
        }
        Update: {
          capacity?: number
          id?: string
          price_per_night?: number
          room_name?: string
          room_type?: string
          status?: Database["public"]["Enums"]["room_status"]
        }
        Relationships: []
      }
      venues: {
        Row: {
          cost: number
          id: string
          registration_id: string
          venue_name: string
          venue_type: string
        }
        Insert: {
          cost?: number
          id?: string
          registration_id: string
          venue_name: string
          venue_type: string
        }
        Update: {
          cost?: number
          id?: string
          registration_id?: string
          venue_name?: string
          venue_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "venues_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "guest_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      class_type:
        | "kb_tk"
        | "sd_1_2"
        | "sd_3_4"
        | "sd_5_6"
        | "smp"
        | "sma"
        | "umum_a"
        | "umum_b"
        | "abk"
      payment_status: "belum_lunas" | "lunas"
      room_status: "available" | "occupied" | "maintenance"
      visit_type:
        | "wisata_edukasi"
        | "outbound"
        | "camping"
        | "field_trip"
        | "penelitian"
        | "lainnya"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      class_type: [
        "kb_tk",
        "sd_1_2",
        "sd_3_4",
        "sd_5_6",
        "smp",
        "sma",
        "umum_a",
        "umum_b",
        "abk",
      ],
      payment_status: ["belum_lunas", "lunas"],
      room_status: ["available", "occupied", "maintenance"],
      visit_type: [
        "wisata_edukasi",
        "outbound",
        "camping",
        "field_trip",
        "penelitian",
        "lainnya",
      ],
    },
  },
} as const
