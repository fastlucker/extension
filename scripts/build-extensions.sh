#!/bin/bash

# Exit the script immediately if any command fails.
set -e

echo "This script automates the process of building the browser extension and their source maps"

# Get version from app.json
VERSION=$(grep '"version"' ./app.json | head -n1 | cut -d':' -f2 | tr -d ' ",')

if [ -z "$VERSION" ]; then
  echo "Version not found in app.json. Make sure the 'expo.version' key exists."
  exit 1
fi

# Read the build target
TARGET="$1"

# Injects debug ids and uploads source maps to Sentry
# Must be done before separating the source maps from the build directories
inject_debug_ids() {
  echo "Step 2: Injecting debug ids and uploading source maps to Sentry"
  # Check if sentry-cli is installed, if not install it
  if ! command -v sentry-cli &> /dev/null; then
    echo "sentry-cli not found, installing..."
    curl -sL https://sentry.io/get-cli/ | bash
  fi
  
  SENTRY_PROJECT=extension
  sentry-cli --version
  # sentry-cli releases new extension-$ENGINE@$VERSION --project=$SENTRY_PROJECT
  sentry-cli sourcemaps inject build/
  # sentry-cli sourcemaps upload --release=extension-$ENGINE@$VERSION --project=$SENTRY_PROJECT build/$ENGINE-prod-source-maps/
  # sentry-cli releases finalize extension-$ENGINE@$VERSION --project=$SENTRY_PROJECT
}

# Function to build and zip Webkit
build_webkit() {
  echo "Step 1: Building the webkit extension"
  yarn build:web:webkit
  
}

# Function to build and zip Gecko
build_gecko() {
  echo "Step 1: Building the gecko extension"
  yarn build:web:gecko  
}

# Decide what to build
case "$TARGET" in
  --webkit)
    build_webkit
    ;;
  --gecko)
    build_gecko
    ;;
  *)
    build_webkit
    build_gecko
    ;;
esac

## Step 2: Inject debug ids and upload source maps to Sentry
inject_debug_ids

## Step 3: Separate source maps from the build directories
echo "Step 3: Separating source maps from the build directories"
case "$TARGET" in
  --webkit)
    yarn export:web:webkit:sourcemaps
    ;;
  --gecko)
    yarn export:web:gecko:sourcemaps
    ;;
  *)
    yarn export:web:webkit:sourcemaps
    yarn export:web:gecko:sourcemaps
    ;;
esac


# Create .zip files
cd build
for dir in */; do
  if [ -d "$dir" ]; then
    # Remove -prod suffix and add prefix with version
    clean_name=$(echo "${dir%/}" | sed 's/-prod//g')
    # Create zip with contents of directory, not the directory itself
    (cd "$dir" && zip -r "../ambire-extension-v${VERSION}-${clean_name}.zip" .)
  fi
done

echo -e "\nAll ready! Good luck with the build reviews 🤞"
