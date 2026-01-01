export type SupabaseDatabase = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          has_completed_onboarding: boolean | null
          first_name: string | null
          last_name: string | null
          full_name: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          has_completed_onboarding?: boolean | null
          first_name?: string | null
          last_name?: string | null
          full_name?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          has_completed_onboarding?: boolean | null
          first_name?: string | null
          last_name?: string | null
          full_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
