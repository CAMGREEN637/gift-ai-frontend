export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_preferences: {
        Row: {
          user_id: string
          interests: Json
          vibe: Json
        }
        Insert: {
          user_id: string
          interests?: Json
          vibe?: Json
        }
        Update: {
          user_id?: string
          interests?: Json
          vibe?: Json
        }
      }
      feedback: {
        Row: {
          id: number
          user_id: string
          gift_name: string
          liked: boolean
        }
        Insert: {
          user_id: string
          gift_name: string
          liked: boolean
        }
        Update: {
          user_id?: string
          gift_name?: string
          liked?: boolean
        }
      }
      inferred_preferences: {
        Row: {
          id: number
          user_id: string
          category: string
          value: string
          weight: number
        }
        Insert: {
          user_id: string
          category: string
          value: string
          weight?: number
        }
        Update: {
          user_id?: string
          category?: string
          value?: string
          weight?: number
        }
      }
      token_usage: {
        Row: {
          id: number
          ip_address: string
          tokens_used: number
          model_name: string
          endpoint: string
          timestamp: string
        }
        Insert: {
          ip_address: string
          tokens_used: number
          model_name: string
          endpoint: string
          timestamp?: string
        }
        Update: {
          ip_address?: string
          tokens_used?: number
          model_name?: string
          endpoint?: string
          timestamp?: string
        }
      }
      gifts: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          currency: string
          categories: Json
          interests: Json
          occasions: Json
          vibe: Json
          personality_traits: Json
          recipient: Json
          experience_level: string | null
          brand: string | null
          link: string | null
          image_url: string | null
          source: string
          rating: number | null
          review_count: number
          in_stock: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          price: number
          currency?: string
          categories?: Json
          interests?: Json
          occasions?: Json
          vibe?: Json
          personality_traits?: Json
          recipient?: Json
          experience_level?: string | null
          brand?: string | null
          link?: string | null
          image_url?: string | null
          source?: string
          rating?: number | null
          review_count?: number
          in_stock?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          currency?: string
          categories?: Json
          interests?: Json
          occasions?: Json
          vibe?: Json
          personality_traits?: Json
          recipient?: Json
          experience_level?: string | null
          brand?: string | null
          link?: string | null
          image_url?: string | null
          source?: string
          rating?: number | null
          review_count?: number
          in_stock?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
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
  }
}
