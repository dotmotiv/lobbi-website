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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      communication_methods: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon_key: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon_key?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon_key?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          last_message: string | null
          last_message_at: string | null
          updated_at: string | null
          user1_id: string
          user1_unread: number | null
          user2_id: string
          user2_unread: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          updated_at?: string | null
          user1_id: string
          user1_unread?: number | null
          user2_id: string
          user2_unread?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          updated_at?: string | null
          user1_id?: string
          user1_unread?: number | null
          user2_id?: string
          user2_unread?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_types: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon_key: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon_key?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon_key?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          created_at: string | null
          display_order: number | null
          genre: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          platforms: string[] | null
          title: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          genre?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          platforms?: string[] | null
          title: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          genre?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          platforms?: string[] | null
          title?: string
        }
        Relationships: []
      }
      languages: {
        Row: {
          code: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          code?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string | null
          id: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          conversation_id: string
          created_at: string | null
          id: string
          read_at: string | null
          sender_id: string | null
          text: string
          updated_at: string | null
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          sender_id?: string | null
          text: string
          updated_at?: string | null
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          sender_id?: string | null
          text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platforms: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon_key: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon_key?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon_key?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age_range: string | null
          availability: Json | null
          avatar: string | null
          bio: string | null
          communication_methods: string[] | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          game_type: string | null
          gamertag: string | null
          games: string[] | null
          has_completed_onboarding: boolean | null
          has_seen_recruit_tutorial: boolean | null
          id: string
          is_premium: boolean | null
          kids_age_range: string | null
          kids_age_ranges: string[] | null
          kids_count: number | null
          name: string | null
          platforms: string[] | null
          preferred_language: string | null
          preferred_languages: string[] | null
          region: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          age_range?: string | null
          availability?: Json | null
          avatar?: string | null
          bio?: string | null
          communication_methods?: string[] | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          game_type?: string | null
          gamertag?: string | null
          games?: string[] | null
          has_completed_onboarding?: boolean | null
          has_seen_recruit_tutorial?: boolean | null
          id: string
          is_premium?: boolean | null
          kids_age_range?: string | null
          kids_age_ranges?: string[] | null
          kids_count?: number | null
          name?: string | null
          platforms?: string[] | null
          preferred_language?: string | null
          preferred_languages?: string[] | null
          region?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          age_range?: string | null
          availability?: Json | null
          avatar?: string | null
          bio?: string | null
          communication_methods?: string[] | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          game_type?: string | null
          gamertag?: string | null
          games?: string[] | null
          has_completed_onboarding?: boolean | null
          has_seen_recruit_tutorial?: boolean | null
          id?: string
          is_premium?: boolean | null
          kids_age_range?: string | null
          kids_age_ranges?: string[] | null
          kids_count?: number | null
          name?: string | null
          platforms?: string[] | null
          preferred_language?: string | null
          preferred_languages?: string[] | null
          region?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      regions: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon_key: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon_key?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon_key?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          action_taken: string | null
          admin_notes: string | null
          context_id: string | null
          context_type: string | null
          created_at: string | null
          details: string | null
          id: string
          reason: string
          reported_user_id: string
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
        }
        Insert: {
          action_taken?: string | null
          admin_notes?: string | null
          context_id?: string | null
          context_type?: string | null
          created_at?: string | null
          details?: string | null
          id?: string
          reason: string
          reported_user_id: string
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Update: {
          action_taken?: string | null
          admin_notes?: string | null
          context_id?: string | null
          context_type?: string | null
          created_at?: string | null
          details?: string | null
          id?: string
          reason?: string
          reported_user_id?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Relationships: []
      }
      squad_requests: {
        Row: {
          created_at: string
          game_ids: string[] | null
          id: string
          schedule_text: string
          scheduled_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          game_ids?: string[] | null
          id?: string
          schedule_text: string
          scheduled_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          game_ids?: string[] | null
          id?: string
          schedule_text?: string
          scheduled_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      swipes: {
        Row: {
          action: string
          created_at: string | null
          id: string
          swiped_id: string
          swiper_id: string
          updated_at: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          swiped_id: string
          swiper_id: string
          updated_at?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          swiped_id?: string
          swiper_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "swipes_swiped_id_fkey"
            columns: ["swiped_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swipes_swiper_id_fkey"
            columns: ["swiper_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_restriction_history: {
        Row: {
          action: string
          created_at: string | null
          id: string
          target_user_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          target_user_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          target_user_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_restriction_history_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_restriction_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_restrictions: {
        Row: {
          created_at: string | null
          id: string
          target_user_id: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          target_user_id: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          target_user_id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_restrictions_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_restrictions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          app_build: string | null
          app_version: string | null
          auth_provider: string | null
          created_at: string | null
          device_brand: string | null
          device_id: string | null
          device_model: string | null
          device_type: string | null
          id: string
          ip_address: unknown
          is_first_login: boolean | null
          last_active_at: string | null
          os_version: string | null
          user_id: string
        }
        Insert: {
          app_build?: string | null
          app_version?: string | null
          auth_provider?: string | null
          created_at?: string | null
          device_brand?: string | null
          device_id?: string | null
          device_model?: string | null
          device_type?: string | null
          id?: string
          ip_address?: unknown
          is_first_login?: boolean | null
          last_active_at?: string | null
          os_version?: string | null
          user_id: string
        }
        Update: {
          app_build?: string | null
          app_version?: string | null
          auth_provider?: string | null
          created_at?: string | null
          device_brand?: string | null
          device_id?: string | null
          device_model?: string | null
          device_type?: string | null
          id?: string
          ip_address?: unknown
          is_first_login?: boolean | null
          last_active_at?: string | null
          os_version?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_report_count: {
        Args: { since_interval?: unknown; user_id: string }
        Returns: number
      }
      mark_messages_as_read: {
        Args: { p_conversation_id: string; p_user_id: string }
        Returns: undefined
      }
      refresh_games_list: { Args: { game_names: string[] }; Returns: number }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
