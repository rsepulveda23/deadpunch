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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      articles: {
        Row: {
          author_id: string | null
          body: string | null
          category: string
          created_at: string | null
          dek: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_featured: boolean
          likes_count: number
          published_at: string | null
          rubric: string | null
          sketch_prompt: string | null
          slug: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          category: string
          created_at?: string | null
          dek?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean
          likes_count?: number
          published_at?: string | null
          rubric?: string | null
          sketch_prompt?: string | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          body?: string | null
          category?: string
          created_at?: string | null
          dek?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean
          likes_count?: number
          published_at?: string | null
          rubric?: string | null
          sketch_prompt?: string | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
        }
        Relationships: []
      }
      crm_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      crm_sync_log: {
        Row: {
          error_message: string | null
          finished_at: string | null
          id: string
          job_name: string
          rows_changed: number | null
          rows_processed: number | null
          started_at: string
        }
        Insert: {
          error_message?: string | null
          finished_at?: string | null
          id?: string
          job_name: string
          rows_changed?: number | null
          rows_processed?: number | null
          started_at?: string
        }
        Update: {
          error_message?: string | null
          finished_at?: string | null
          id?: string
          job_name?: string
          rows_changed?: number | null
          rows_processed?: number | null
          started_at?: string
        }
        Relationships: []
      }
      deadpunch_email_capture: {
        Row: {
          created_at: string | null
          email: string
          id: string
          metadata: Json | null
        }
        Insert: {
          created_at?: string | null
          email?: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      email_log: {
        Row: {
          body_html: string
          contact_email: string
          created_at: string
          error_message: string | null
          gmail_draft_id: string | null
          id: string
          sent_at: string | null
          status: Database["public"]["Enums"]["email_log_status"]
          subject: string
          template_slug: string | null
        }
        Insert: {
          body_html: string
          contact_email: string
          created_at?: string
          error_message?: string | null
          gmail_draft_id?: string | null
          id?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_log_status"]
          subject: string
          template_slug?: string | null
        }
        Update: {
          body_html?: string
          contact_email?: string
          created_at?: string
          error_message?: string | null
          gmail_draft_id?: string | null
          id?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_log_status"]
          subject?: string
          template_slug?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body_html: string
          created_at: string
          id: string
          merge_fields: string[]
          name: string
          slug: string
          subject: string
          updated_at: string
        }
        Insert: {
          body_html: string
          created_at?: string
          id?: string
          merge_fields?: string[]
          name: string
          slug: string
          subject: string
          updated_at?: string
        }
        Update: {
          body_html?: string
          created_at?: string
          id?: string
          merge_fields?: string[]
          name?: string
          slug?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      game_events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string | null
          event_id: number
          event_type: string
          regime_id: number | null
          source_snapshot_id: number | null
          source_url: string | null
          title: string
          verification_status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: number
          event_type: string
          regime_id?: number | null
          source_snapshot_id?: number | null
          source_url?: string | null
          title: string
          verification_status?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: number
          event_type?: string
          regime_id?: number | null
          source_snapshot_id?: number | null
          source_url?: string | null
          title?: string
          verification_status?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          current_url: string | null
          email: string
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          current_url?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          current_url?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          last_contacted: string | null
          name: string | null
          source: string
          status: string | null
          subscribed_at: string | null
          tags: Json
        }
        Insert: {
          email: string
          id?: string
          last_contacted?: string | null
          name?: string | null
          source?: string
          status?: string | null
          subscribed_at?: string | null
          tags?: Json
        }
        Update: {
          email?: string
          id?: string
          last_contacted?: string | null
          name?: string | null
          source?: string
          status?: string | null
          subscribed_at?: string | null
          tags?: Json
        }
        Relationships: []
      }
      organizer_profiles: {
        Row: {
          about_bio: string | null
          contact_email: string
          contact_phone: string | null
          created_at: string
          organizer_name: string
          profile_image_url: string | null
          region: string | null
          social_media_links: Json | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          about_bio?: string | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          organizer_name: string
          profile_image_url?: string | null
          region?: string | null
          social_media_links?: Json | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          about_bio?: string | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          organizer_name?: string
          profile_image_url?: string | null
          region?: string | null
          social_media_links?: Json | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      page_views: {
        Row: {
          country: string | null
          created_at: string
          device_type: string | null
          id: string
          page_path: string
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          page_path: string
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          page_path?: string
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          handle: string | null
          id: string
          role: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_current_period_end: string | null
          subscription_price_cents: number | null
          subscription_status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          handle?: string | null
          id: string
          role?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_current_period_end?: string | null
          subscription_price_cents?: number | null
          subscription_status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          handle?: string | null
          id?: string
          role?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_current_period_end?: string | null
          subscription_price_cents?: number | null
          subscription_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      quick_news: {
        Row: {
          body: string
          created_at: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          title: string
          updated_at: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          title: string
          updated_at?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      simulations: {
        Row: {
          created_at: string
          draw_count: number
          parameters_json: Json | null
          random_seed: number | null
          regime_id: number | null
          result_json: Json | null
          simulation_id: number
          simulation_name: string
          trial_count: number
        }
        Insert: {
          created_at?: string
          draw_count: number
          parameters_json?: Json | null
          random_seed?: number | null
          regime_id?: number | null
          result_json?: Json | null
          simulation_id?: number
          simulation_name: string
          trial_count: number
        }
        Update: {
          created_at?: string
          draw_count?: number
          parameters_json?: Json | null
          random_seed?: number | null
          regime_id?: number | null
          result_json?: Json | null
          simulation_id?: number
          simulation_name?: string
          trial_count?: number
        }
        Relationships: []
      }
      ticker_messages: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          message: string
          sort_order: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          message: string
          sort_order?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          message?: string
          sort_order?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      tournaments: {
        Row: {
          address: string
          city: string
          created_at: string
          date: string
          description: string | null
          entry_fee: number
          flyer_image_url: string | null
          game_type: string
          id: string
          latitude: number | null
          location_name: string
          longitude: number | null
          name: string
          organizer_email: string
          organizer_name: string
          organizer_phone: string
          prize_pool: string | null
          state: string
          time: string
          user_id: string
          website_link: string | null
          zip_code: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          date: string
          description?: string | null
          entry_fee?: number
          flyer_image_url?: string | null
          game_type: string
          id?: string
          latitude?: number | null
          location_name: string
          longitude?: number | null
          name: string
          organizer_email: string
          organizer_name: string
          organizer_phone: string
          prize_pool?: string | null
          state: string
          time: string
          user_id: string
          website_link?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          date?: string
          description?: string | null
          entry_fee?: number
          flyer_image_url?: string | null
          game_type?: string
          id?: string
          latitude?: number | null
          location_name?: string
          longitude?: number | null
          name?: string
          organizer_email?: string
          organizer_name?: string
          organizer_phone?: string
          prize_pool?: string | null
          state?: string
          time?: string
          user_id?: string
          website_link?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      get_public_tournaments: {
        Args: never
        Returns: {
          address: string
          city: string
          created_at: string
          description: string
          entry_fee: number
          flyer_image_url: string
          game_type: string
          id: string
          latitude: number
          location_name: string
          longitude: number
          name: string
          organizer_email: string
          organizer_name: string
          organizer_phone: string
          prize_pool: string
          state: string
          tournament_date: string
          tournament_time: string
          user_id: string
          website_link: string
          zip_code: string
        }[]
      }
      get_tournament_by_id: {
        Args: { tournament_id: string }
        Returns: {
          address: string
          city: string
          created_at: string
          description: string
          entry_fee: number
          flyer_image_url: string
          game_type: string
          id: string
          latitude: number
          location_name: string
          longitude: number
          name: string
          organizer_email: string
          organizer_name: string
          organizer_phone: string
          prize_pool: string
          state: string
          tournament_date: string
          tournament_time: string
          user_id: string
          website_link: string
          zip_code: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_article_likes: {
        Args: { article_slug: string }
        Returns: number
      }
      is_admin: { Args: { user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      email_log_status: "draft" | "sent" | "failed"
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
      app_role: ["admin", "moderator", "user"],
      email_log_status: ["draft", "sent", "failed"],
    },
  },
} as const
