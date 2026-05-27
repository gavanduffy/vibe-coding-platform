---
name: new-feature
description: Add a new feature to an existing app. Use when the user wants to add functionality, a new screen, new data model, or enhance the app after initial creation.
---

# New Feature

Add a complete feature to the existing app, including database schema, API layer, and UI.

## When to Use

- User wants to add a new feature to an existing app
- User says "add...", "I want...", "can you make it..."
- User describes new functionality

## Instructions

### Step 1: Analyze the Feature

Determine what the feature needs:
1. **Data model**: What tables/columns are needed?
2. **API layer**: What queries and mutations?
3. **UI**: What screens and components?
4. **Navigation**: Where does it fit in the app structure?

### Step 2: Database Changes (if needed)

Follow the `/setup-supabase` skill patterns:
1. Create migration file with proper naming
2. Add tables with RLS policies
3. Apply migration via Supabase MCP
4. Regenerate TypeScript types

### Step 3: RTK Query Endpoints

Create or extend API slices:

```typescript
// src/store/api/featureApi.ts
import { baseApi } from "./baseApi";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

type Feature = Database["public"]["Tables"]["features"]["Row"];

export const featureApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeatures: builder.query<Feature[], void>({
      queryFn: async () => {
        const { data, error } = await supabase
          .from("features")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) return { error: { status: "CUSTOM_ERROR", error: error.message } };
        return { data: data ?? [] };
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Feature" as const, id })), "Feature"]
          : ["Feature"],
    }),
    // Add more endpoints...
  }),
});

export const { useGetFeaturesQuery } = featureApi;
```

Don't forget to add the tag type to `baseApi.ts`:
```typescript
tagTypes: ["Feature", /* ...existing tags */],
```

### Step 4: Create UI Components

1. Create reusable components in `src/components/`
2. Create screens in `app/` following Expo Router conventions
3. Add to navigation (tabs or stack) as appropriate

### Step 5: Create Redux Slice (if needed for local state)

Only create a slice if there's local UI state that doesn't come from the API:

```typescript
// src/store/featureSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FeatureState {
  // local UI state
}

const initialState: FeatureState = {};

export const featureSlice = createSlice({
  name: "feature",
  initialState,
  reducers: {
    // reducers here
  },
});

export const { /* actions */ } = featureSlice.actions;
export default featureSlice.reducer;
```

Add to store's `combineReducers` and `persistConfig.whitelist` if it should persist.

### Step 6: Wire Everything Together

1. Import and use hooks in screens
2. Handle loading, error, and empty states
3. Add proper TypeScript types throughout
4. Test the feature works end-to-end

### Step 7: Deploy

Ask the user if they want to:
- **Push an OTA update** (if JS-only changes): Use `/push-update`
- **Create a new build** (if native changes): Use `/deploy-ios`

## Rules

- Follow existing patterns in the codebase
- Use RTK Query for ALL server data (never raw fetch/axios)
- Use Supabase client via queryFn pattern
- Keep components focused and composable
- Handle all error states gracefully
- Use TypeScript strictly (no `any` types)
