import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "@/lib/supabase";

/**
 * Base API using RTK Query with Supabase.
 *
 * Uses `fakeBaseQuery` because Supabase client handles all HTTP communication.
 * Each endpoint uses `queryFn` to call Supabase directly.
 *
 * Example endpoint:
 * ```ts
 * getItems: builder.query<Item[], void>({
 *   queryFn: async () => {
 *     const { data, error } = await supabase
 *       .from("items")
 *       .select("*")
 *       .order("created_at", { ascending: false });
 *     if (error) return { error: { status: "CUSTOM_ERROR", error: error.message } };
 *     return { data };
 *   },
 *   providesTags: ["Item"],
 * }),
 * ```
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(),
  tagTypes: [
    // Add your tag types here for cache invalidation:
    // "Item",
    // "User",
    // "Profile",
  ],
  endpoints: (builder) => ({
    // Health check endpoint - verifies Supabase connection
    healthCheck: builder.query<{ status: string }, void>({
      queryFn: async () => {
        try {
          const { error } = await supabase.from("_health_check").select("*").limit(1);
          // Table might not exist, but connection works if we get a proper error
          if (error && !error.message.includes("does not exist")) {
            return { error: { status: "CUSTOM_ERROR", error: error.message } };
          }
          return { data: { status: "connected" } };
        } catch (e) {
          return { error: { status: "CUSTOM_ERROR", error: "Connection failed" } };
        }
      },
    }),
  }),
});

export const { useHealthCheckQuery } = baseApi;
