#!/bin/bash

SCRIPTS_DIR="$(dirname "$(realpath "$0")")"
PROJECT_ROOT="$(cd "$SCRIPTS_DIR"; while [ ! -f "README.md" ] && [ "$PWD" != "/" ]; do cd ..; done; pwd)"
SAFARI_XCODE_PROJECT_PROD="$PROJECT_ROOT/safari-extension/ambire-safari-prod"

rm -rf ./build/safari-prod

if [ ! -d "$SAFARI_XCODE_PROJECT_PROD" ]; then
  mkdir ./safari-extension/ambire-safari-prod
  chmod 777 ./safari-extension/ambire-safari-prod
  APP_ENV=production WEB_ENGINE=webkit-safari WEBPACK_BUILD_OUTPUT_PATH=safari-prod expo export:web &&
  yes | xcrun "/Applications/Xcode.app/Contents/Developer/usr/bin/safari-web-extension-converter" "$PROJECT_ROOT/build/safari-prod" --app-name "ambire-safari-prod" --project-location "$PROJECT_ROOT/safari-extension" --swift --force --no-prompt --no-open --macos-only
  while [ ! -d "$SAFARI_XCODE_PROJECT_PROD/ambire-safari-prod.xcodeproj" ]; do
    echo "Waiting for Xcode project creation to complete..."
    sleep 5
  done
  xcodebuild -project "$PROJECT_ROOT/safari-extension/ambire-safari-prod/ambire-safari-prod.xcodeproj" -configuration Debug build
else
  APP_ENV=production WEB_ENGINE=webkit-safari WEBPACK_BUILD_OUTPUT_PATH=safari-prod expo export:web &&
  sleep 3 &&
  xcodebuild -project "$PROJECT_ROOT/safari-extension/ambire-safari-prod/ambire-safari-prod.xcodeproj" -configuration Debug build
fi

