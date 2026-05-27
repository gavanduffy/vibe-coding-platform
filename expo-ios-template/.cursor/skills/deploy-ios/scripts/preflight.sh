#!/bin/bash
# Pre-flight checks before triggering an iOS build

set -e

echo "🔍 Running pre-flight checks..."

# Check TypeScript
echo "  ✓ Type checking..."
npm run typecheck

# Check that eas.json exists
if [ ! -f "eas.json" ]; then
  echo "  ✗ eas.json not found. Run 'eas init' first."
  exit 1
fi
echo "  ✓ eas.json found"

# Check that app.json has bundle identifier
BUNDLE_ID=$(node -e "console.log(require('./app.json').expo.ios.bundleIdentifier || '')")
if [ -z "$BUNDLE_ID" ]; then
  echo "  ✗ ios.bundleIdentifier not set in app.json"
  exit 1
fi
echo "  ✓ Bundle ID: $BUNDLE_ID"

# Check git status
if [ -n "$(git status --porcelain)" ]; then
  echo "  ⚠ Uncommitted changes detected. Committing..."
  git add -A
  git commit -m "chore: pre-build commit"
fi
echo "  ✓ Git clean"

echo ""
echo "✅ All pre-flight checks passed. Ready to build."
