#!/bin/bash
# Initialize a new project from the template
# Usage: ./init-project.sh <app-name> <bundle-id>

set -e

APP_NAME="${1:-MyApp}"
BUNDLE_ID="${2:-com.yourteam.myapp}"
SLUG=$(echo "$APP_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | sed 's/[^a-z0-9-]//g')

echo "🚀 Initializing project: $APP_NAME"
echo "   Bundle ID: $BUNDLE_ID"
echo "   Slug: $SLUG"

# Update app.json
node -e "
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('app.json', 'utf8'));
config.expo.name = '$APP_NAME';
config.expo.slug = '$SLUG';
config.expo.scheme = '$SLUG';
config.expo.ios.bundleIdentifier = '$BUNDLE_ID';
fs.writeFileSync('app.json', JSON.stringify(config, null, 2));
"

# Update package.json name
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.name = '$SLUG';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# Update constants
sed -i "s/export const APP_NAME = .*/export const APP_NAME = \"$APP_NAME\";/" src/lib/constants.ts

echo ""
echo "✅ Project initialized as '$APP_NAME'"
echo ""
echo "Next steps:"
echo "  1. Run 'npm install'"
echo "  2. Run 'eas init' to link to EAS"
echo "  3. Run 'eas device:create' to register your iOS device"
echo "  4. Configure Supabase credentials in app.json > extra"
