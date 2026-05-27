Use this tool to run a command inside an existing Vercel Sandbox. You can choose whether the command should block until completion or run in the background by setting the `wait` parameter:

- `wait: true` → Command runs and **must complete** before the response is returned.
- `wait: false` → Command starts in the background, and the response returns immediately with its `commandId`.

⚠️ Commands are stateless — each one runs in a fresh shell session with **no memory** of previous commands. You CANNOT rely on `cd`, but installed packages and uploaded files persist.

## Package Manager

Use **`npm`** (not pnpm) for all Expo/React Native projects. Examples:
- `npm install` — install dependencies
- `npx expo start` — start Expo dev server
- `npx tsc --noEmit` — TypeScript type check
- `eas build --profile preview --platform ios --non-interactive` — trigger EAS build

## When to Use This Tool

Use Run Command when:

1. Installing dependencies: `npm install`
2. Running TypeScript checks: `npx tsc --noEmit`
3. Starting the Expo dev server: `npx expo start --port 8081`
4. Triggering EAS builds: `eas build --profile preview --platform ios --non-interactive`
5. Pushing OTA updates: `eas update --branch preview --non-interactive`

## Sequencing Rules

- If two commands depend on each other, **set `wait: true` on the first** to ensure it finishes
  - ✅ `npm install` (wait: true) → then `npx tsc --noEmit` (wait: true)
- Do **not** assume directory state is preserved — use paths relative to sandbox root
- Do **not** combine commands with `&&`

## Command Format

Separate the base command from its arguments:
- ✅ `{ command: "npm", args: ["install"], wait: true }`
- ✅ `{ command: "npx", args: ["tsc", "--noEmit"], wait: true }`
- ❌ `{ command: "npm install --save react" }`

## When to Set `wait` to True

- Installing dependencies before type-checking
- Type-checking before triggering a build
- Any command whose result affects the next step

## When to Set `wait` to False

- Starting the Expo dev server (long-lived process)
- EAS build (runs remotely and completes asynchronously)

## Examples

<example>
User: Install dependencies and validate TypeScript
Assistant:
1. Run Command: `{ command: "npm", args: ["install"], wait: true }`
2. Run Command: `{ command: "npx", args: ["tsc", "--noEmit"], wait: true }`
</example>

<example>
User: Start the Expo dev server
Assistant:
Run Command: `{ command: "npx", args: ["expo", "start", "--port", "8081"], wait: false }`
</example>

<example>
User: Trigger an EAS preview build
Assistant:
Run Command: `{ command: "eas", args: ["build", "--profile", "preview", "--platform", "ios", "--non-interactive"], wait: false }`
</example>

## Summary

Use Run Command to execute shell commands in the sandbox. Use `npm` for package management, `npx` for CLI tools, and control execution flow with the `wait` flag.
