/**
 * Auto-generated Supabase database types.
 *
 * Regenerate with: npm run supabase:types
 *
 * Or via Supabase MCP: "generate typescript types for my project"
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // Tables will be generated here by `supabase gen types`
      // Example:
      // profiles: {
      //   Row: { id: string; username: string; avatar_url: string | null; created_at: string };
      //   Insert: { id: string; username?: string; avatar_url?: string | null };
      //   Update: { id?: string; username?: string; avatar_url?: string | null };
      // };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
