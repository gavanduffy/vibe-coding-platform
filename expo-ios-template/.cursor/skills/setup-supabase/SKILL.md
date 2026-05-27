---
name: setup-supabase
description: Set up or modify the Supabase backend including database tables, RLS policies, and edge functions. Use when the user needs database changes, new tables, new API endpoints, or backend logic.
---

# Setup Supabase

Manages the Supabase backend: database schema, RLS policies, edge functions, and type generation.

## When to Use

- User needs new database tables
- User needs to modify existing schema
- User needs server-side logic (edge functions)
- User needs to update RLS policies
- Initial project setup for Supabase

## Instructions

### Creating Tables

1. Create a new migration file in `supabase/migrations/` with timestamp prefix:
   - Format: `YYYYMMDDHHMMSS_description.sql`
   - Example: `20240101000000_create_items.sql`

2. Every table MUST follow this pattern:

```sql
-- Create the table
create table if not exists public.table_name (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  -- your columns here
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ALWAYS enable RLS
alter table public.table_name enable row level security;

-- ALWAYS create RLS policies
-- Read: users can only see their own data
create policy "Users can view own table_name"
  on public.table_name for select
  using (auth.uid() = user_id);

-- Insert: users can only insert their own data
create policy "Users can create own table_name"
  on public.table_name for insert
  with check (auth.uid() = user_id);

-- Update: users can only update their own data
create policy "Users can update own table_name"
  on public.table_name for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Delete: users can only delete their own data
create policy "Users can delete own table_name"
  on public.table_name for delete
  using (auth.uid() = user_id);

-- Updated_at trigger
create trigger table_name_updated_at
  before update on public.table_name
  for each row execute procedure public.handle_updated_at();
```

3. Apply the migration using Supabase MCP `apply_migration` tool

### RLS Policy Patterns

| Pattern | Policy |
|---------|--------|
| User owns the row | `using (auth.uid() = user_id)` |
| Public read, private write | Select: `using (true)`, Insert/Update/Delete: `using (auth.uid() = user_id)` |
| Shared within a group | `using (auth.uid() in (select user_id from group_members where group_id = table.group_id))` |
| Admin override | `using (auth.uid() = user_id OR exists(select 1 from admins where id = auth.uid()))` |

### Creating Edge Functions

For logic that cannot be expressed in RLS or requires external API calls:

1. Create directory: `supabase/functions/<function-name>/`
2. Create `index.ts` following the Deno pattern:

```typescript
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    // Your logic here

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
```

3. Deploy using Supabase MCP `deploy_edge_function` tool

### Generating Types

After schema changes, regenerate TypeScript types:
- Use Supabase MCP `generate_typescript_types` tool
- Or run: `npm run supabase:types`
- Output goes to `src/types/database.ts`

### Updating RTK Query

After schema changes, update the corresponding RTK Query API:
1. Add/modify endpoints in `src/store/api/`
2. Update tag types in `baseApi.ts` if new entities were created
3. Export new hooks

## Rules

- NEVER create tables without RLS
- NEVER use `service_role` key in client code
- ALWAYS use `auth.uid()` in RLS policies for user-scoped data
- ALWAYS add `created_at` and `updated_at` columns
- ALWAYS use UUID primary keys
- Edge functions are for complex logic only; simple CRUD should use RLS + direct queries
