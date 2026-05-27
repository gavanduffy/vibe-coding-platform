---
name: create-app
description: Create a new iOS app from the template. Use this skill when the user wants to build a new app, start a new project, or says something like "build me a [type] app". This is the master orchestration skill that handles the full pipeline from idea to deployed app.
---

# Create App

This skill orchestrates the full app creation pipeline: from idea to a deployed iOS app on the user's device via EAS internal distribution.

## When to Use

- User wants to build a new app from scratch
- User says "build me a..." or "create a..." or "make a..."
- User describes an app idea and wants it deployed

## Prerequisites

- Expo MCP server is connected and authenticated
- Supabase MCP server is connected and authenticated
- GitHub MCP server is connected and authenticated
- Apple credentials are configured (ASC API key in environment)

## Instructions

Follow these steps in order. Use MCP tools where indicated.

### Step 1: Understand Requirements

Ask the user (if not already clear):
1. What does the app do? (core features)
2. App name and bundle identifier preference
3. Any specific UI/UX requirements

If the user gave a clear description, proceed without asking.

### Step 2: Configure the App Identity

1. Update `app.json`:
   - Set `expo.name` to the app display name
   - Set `expo.slug` to a kebab-case version
   - Set `expo.ios.bundleIdentifier` to `com.yourteam.appname`
   - Set `expo.scheme` to a URL scheme for deep linking
2. Update `package.json` name field

### Step 3: Design the Database Schema

Based on the app requirements:
1. Create SQL migration files in `supabase/migrations/`
2. Every table MUST have RLS enabled
3. Every table MUST have appropriate RLS policies
4. Use the profiles table pattern from the init migration as reference
5. Use Supabase MCP `apply_migration` tool to apply the schema
6. Use Supabase MCP `generate_typescript_types` to update `src/types/database.ts`

### Step 4: Build the RTK Query API Layer

For each data entity:
1. Create a new file in `src/store/api/` (e.g., `itemsApi.ts`)
2. Use `baseApi.injectEndpoints()` pattern
3. Use `queryFn` with Supabase client for all queries
4. Define proper `providesTags` and `invalidatesTags` for cache management
5. Export typed hooks

Example pattern:
```typescript
import { baseApi } from "./baseApi";
import { supabase } from "@/lib/supabase";

export const itemsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<Item[], void>({
      queryFn: async () => {
        const { data, error } = await supabase
          .from("items")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) return { error: { status: "CUSTOM_ERROR", error: error.message } };
        return { data: data ?? [] };
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Item" as const, id })), "Item"]
          : ["Item"],
    }),
    createItem: builder.mutation<Item, Partial<Item>>({
      queryFn: async (newItem) => {
        const { data, error } = await supabase
          .from("items")
          .insert(newItem)
          .select()
          .single();
        if (error) return { error: { status: "CUSTOM_ERROR", error: error.message } };
        return { data };
      },
      invalidatesTags: ["Item"],
    }),
  }),
});
```

### Step 5: Build the UI

1. Create screens in `app/` using Expo Router file-based routing
2. Use tab navigation for main sections (`app/(tabs)/`)
3. Use stack navigation for detail views
4. Keep components in `src/components/`
5. Use React Native StyleSheet (no external styling libraries unless requested)
6. Ensure all screens are iOS-optimized (safe areas, proper keyboard handling)

### Step 6: Create Edge Functions (if needed)

For complex server-side logic that can't be handled by RLS alone:
1. Create function in `supabase/functions/<name>/index.ts`
2. Follow the Deno edge function pattern from the template
3. Use Supabase MCP `deploy_edge_function` to deploy
4. Call from the app via `supabase.functions.invoke()`

### Step 7: Set Up the EAS Project

Use Expo MCP tools:
1. Ensure the project is linked to EAS (check `app.json` extra.eas.projectId)
2. If not linked, the user needs to run `eas init` locally first
3. Verify build profiles in `eas.json` are correct

### Step 8: Initialize Git and Push

1. Initialize git repository if not already done
2. Create a `.gitignore` (already in template)
3. Commit all files
4. Use GitHub MCP to create a new repository
5. Push to the new repository

### Step 9: Trigger the Build

Use Expo MCP `build_run` tool:
1. Trigger an iOS build with the `preview` profile (internal distribution)
2. Monitor build status with `build_info`
3. Once complete, provide the install link to the user

### Step 10: Confirm Deployment

Tell the user:
1. The install link for their iOS device
2. How to register new devices (`eas device:create`)
3. How to push updates (`npm run update` or use `/push-update` skill)
4. How to trigger new builds for native changes

## Important Rules

- NEVER set up Android. iOS only.
- NEVER use a custom server. Supabase Edge Functions + RLS only.
- ALWAYS use RTK Query with `queryFn` for Supabase calls.
- ALWAYS enable RLS on every table.
- ALWAYS use TypeScript strict mode.
- ALWAYS use the `preview` build profile for internal distribution.
