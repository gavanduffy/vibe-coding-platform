---
name: deploy-ios
description: Deploy the app to iOS devices via EAS internal distribution. Use when the user wants to build and deploy, ship to device, create a new build, or test on their phone.
---

# Deploy iOS

Handles building and deploying the iOS app via EAS internal distribution (ad-hoc provisioning).

## When to Use

- User says "deploy", "build", "ship it", "put it on my phone"
- User wants to test native changes on a real device
- User has made changes that require a new native build (new native modules, config changes)

## Instructions

### Step 1: Pre-flight Checks

1. Run `npm run typecheck` to ensure no TypeScript errors
2. Verify `eas.json` has the `preview` profile with `"distribution": "internal"`
3. Check that `app.json` has a valid `ios.bundleIdentifier`

### Step 2: Commit and Push

1. Stage all changes: `git add -A`
2. Create a descriptive commit message based on what changed
3. Push to the main branch (or current branch)

### Step 3: Trigger Build

Use Expo MCP `build_run` tool:
- Profile: `preview`
- Platform: `ios`

Alternatively, if MCP is not available, run:
```bash
eas build --profile preview --platform ios --non-interactive
```

### Step 4: Monitor Build

Use Expo MCP `build_info` or `build_list` to check status.
- If build fails, use `build_logs` to diagnose
- Common issues: expired provisioning profile, missing device UDIDs

### Step 5: Deliver Result

Once the build succeeds:
1. Get the build URL from EAS
2. Provide the install link to the user
3. Remind them they can scan the QR code or open the link on their iOS device

## Troubleshooting

- **"No registered devices"**: User needs to run `eas device:create` and register their device UDID
- **"Provisioning profile error"**: Run `eas credentials --platform ios` to fix
- **Build timeout**: Check EAS dashboard for queue status

## Notes

- Builds use ad-hoc provisioning (limited to 100 devices per year per Apple Developer account)
- After registering a new device, a new build is required
- For JS-only changes, use `/push-update` instead (much faster, no new build needed)
