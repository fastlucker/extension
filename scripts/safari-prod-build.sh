#!/bin/bash

SCRIPTS_DIR="$(dirname "$(realpath "$0")")"
PROJECT_ROOT="$(cd "$SCRIPTS_DIR"; while [ ! -f "README.md" ] && [ "$PWD" != "/" ]; do cd ..; done; pwd)"
SAFARI_XCODE_PROJECT="$PROJECT_ROOT/build/ambire-extension-project-prod"

rm -rf ./build/safari-prod
rm -rf ./build/ambire-extension-project-prod
mkdir ./build/ambire-extension-project-prod
chmod 777 ./build/ambire-extension-project-prod

APP_ENV=production WEB_ENGINE=webkit-safari WEBPACK_BUILD_OUTPUT_PATH=safari-prod expo export:web &&
yes | xcrun "/Applications/Xcode.app/Contents/Developer/usr/bin/safari-web-extension-converter" "$PROJECT_ROOT/build/safari-prod" --app-name ambire-extension-project-prod --project-location $PROJECT_ROOT/build --swift --force --no-prompt --no-open --macos-only

while [ ! -d "$SAFARI_XCODE_PROJECT/ambire-extension-project-prod.xcodeproj" ]; do
  echo "Waiting for Xcode project creation to complete..."
  sleep 5
done

xcodebuild -project "$PROJECT_ROOT/build/ambire-extension-project-prod/ambire-extension-project-prod.xcodeproj" -configuration Debug build

