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

# Define filenames
WEBKIT_FILENAME="ambire-extension-v${VERSION}-webkit.zip"
GECKO_FILENAME="ambire-extension-v${VERSION}-gecko.zip"
WEBKIT_SOURCEMAPS_FILENAME="ambire-extension-v${VERSION}-webkit-sourcemaps.zip"
GECKO_SOURCEMAPS_FILENAME="ambire-extension-v${VERSION}-gecko-sourcemaps.zip"

# Define build directories
WEBKIT_BUILD_DIR="./build/webkit-prod"
GECKO_BUILD_DIR="./build/gecko-prod"
WEBKIT_SOURCEMAPS_BUILD_DIR="./build/webkit-prod-source-maps"
GECKO_SOURCEMAPS_BUILD_DIR="./build/gecko-prod-source-maps"

# Function to build and zip Webkit
build_webkit() {
  echo "Step 1: Building the webkit extension"
  yarn build:web:webkit

  echo "Step 2: Exporting webkit extension sourcemaps"
  yarn export:web:webkit:sourcemaps
}

# Function to build and zip Gecko
build_gecko() {
  echo "Step 1: Building the gecko extension"
  yarn build:web:gecko

  echo "Step 2: Exporting gecko extension sourcemaps"
  yarn export:web:gecko:sourcemaps
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

echo -e "\nAll ready! Good luck with the build reviews 🤞"
