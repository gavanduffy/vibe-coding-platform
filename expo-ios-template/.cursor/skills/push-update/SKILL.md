---
name: push-update
description: Push an over-the-air (OTA) update to deployed iOS apps using EAS Update. Use when the user wants to push changes without a full rebuild, hot-fix, or update the JS bundle.
---

# Push Update (OTA)

Push JavaScript/asset changes to already-installed apps without requiring a new native build. Uses EAS Update to deliver changes over-the-air.

## When to Use

- User says "push an update", "hot fix", "update the app"
- Changes are JS/TS only (no new native modules, no app.json config changes)
- User wants fast iteration without waiting for a full build

## When NOT to Use

- New native dependencies were added (requires full build via `/deploy-ios`)
- `app.json` iOS config changed (bundleIdentifier, permissions, etc.)
- New Expo config plugins were added
- The `runtimeVersion` policy would produce a new version

## Instructions

### Step 1: Verify Update Eligibility

Check that recent changes are JS-only:
1. No new packages with native code in `package.json`
2. No changes to `app.json` native configuration
3. No new items in the `plugins` array

### Step 2: Type Check

Run `npm run typecheck` to ensure no errors.

### Step 3: Commit Changes

1. Stage all changes: `git add -A`
2. Commit with a descriptive message
3. Push to the appropriate branch

### Step 4: Push the Update

Run the update command targeting the correct channel:

```bash
# For preview/internal distribution builds:
eas update --branch preview --message "Description of changes" --non-interactive

# Or use auto mode which detects the branch:
eas update --auto --non-interactive
```

Use Expo MCP tools if available to trigger and monitor.

### Step 5: Confirm

1. The update will be available on next app launch (or within the configured check interval)
2. Tell the user to close and reopen the app to receive the update
3. Provide the update group URL from EAS dashboard

## How Channels Work

| Build Profile | Channel    | Update Branch |
|--------------|------------|---------------|
| development  | development| development   |
| preview      | preview    | preview       |
| production   | production | production    |

Updates pushed to a branch are served to builds on the matching channel.

## Notes

- Updates are typically available within seconds of publishing
- The app checks for updates on launch by default
- Updates only work for JS/asset changes, not native code
- If unsure whether changes are JS-only, do a full build to be safe
