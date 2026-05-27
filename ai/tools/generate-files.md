Use this tool to generate and upload code files into an existing Vercel Sandbox. It leverages an LLM to create file contents based on the current conversation context and user intent, then writes them directly into the sandbox file system.

All generated files MUST follow the Expo iOS template architecture: React Native with Expo Router, Redux Toolkit + RTK Query, Supabase backend, and strict TypeScript. NEVER generate Next.js, web-only, or non-React-Native code.

All file paths must be relative to the sandbox root (e.g., `app/(tabs)/index.tsx`, `src/store/api/itemsApi.ts`, `package.json`).

## When to Use This Tool

Use Generate Files when:

1. You need to create one or more new files as part of a feature, scaffold, or fix
2. The user requests code that implies file creation (new screens, components, API slices, migrations)
3. You need to bootstrap a new Expo iOS application from the template structure
4. You're completing a multi-step task that involves generating or updating source code
5. A prior command failed due to a missing file, and you need to supply it

## File Generation Rules

- Every file must be complete, valid TypeScript (.ts or .tsx)
- Use React Native `StyleSheet.create` for styling — NO Tailwind, NativeWind, or web CSS
- iOS ONLY — no Android code or `Platform.OS === 'android'` checks
- Use Expo Router file-based routing in `app/`
- Use RTK Query with `queryFn` wrapping Supabase for all data fetching
- Components NEVER call Supabase directly — always through RTK Query hooks
- Use `@/*` path alias for imports from `src/` (e.g., `import { store } from "@/store/store"`)
- `package.json` MUST include `"main": "expo-router/entry"`
- `tsconfig.json` MUST extend `expo/tsconfig.base` with `strict: true` and `@/*` alias
- NEVER generate lock files (package-lock.json, yarn.lock, pnpm-lock.yaml)
- NEVER generate node_modules/ or build artifacts

## Examples of When to Use This Tool

<example>
User: Add a task list screen to the app
Assistant: I'll generate the screen and RTK Query endpoint for tasks.
*Uses Generate Files to create:*
- `app/(tabs)/tasks.tsx` — screen with list, loading, error states
- `src/store/api/tasksApi.ts` — RTK Query endpoints with Supabase
- Updates `src/store/api/baseApi.ts` to add "Task" tag type
- Updates `app/(tabs)/_layout.tsx` to add the Tasks tab
</example>

<example>
User: Build me a notes app
Assistant: I'll scaffold the full Expo iOS app from the template.
*Uses Generate Files to create all template files plus:*
- `src/store/api/notesApi.ts` — CRUD endpoints for notes
- `app/(tabs)/notes.tsx` — notes list screen
- `supabase/migrations/001_notes.sql` — notes table with RLS
</example>

## When NOT to Use This Tool

1. You only need to execute commands (use Run Command)
2. You haven't created a sandbox yet (use Create Sandbox first)

## Output Behavior

Returns a list of created files with paths and contents for reference in subsequent steps.

