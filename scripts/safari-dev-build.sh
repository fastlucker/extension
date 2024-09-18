#!/bin/bash

SCRIPTS_DIR="$(dirname "$(realpath "$0")")"
PROJECT_ROOT="$(cd "$SCRIPTS_DIR"; while [ ! -f "README.md" ] && [ "$PWD" != "/" ]; do cd ..; done; pwd)"
SAFARI_DEV_DIR="$PROJECT_ROOT/build/safari-dev"
SAFARI_XCODE_PROJECT="$PROJECT_ROOT/build/safari-xcode-project-dev"
INDEX="$PROJECT_ROOT/build/safari-dev/index.html"
BACKGROUND="$PROJECT_ROOT/build/safari-dev/background.js"
EXPO_DEV_PORT=19000


cleanup() {
  pkill -P $$
  exit 0
}

trap cleanup SIGINT

rm -rf ./build/safari-dev
rm -rf ./build/safari-xcode-project-dev
mkdir ./build/safari-xcode-project-dev
chmod 777 ./build/safari-xcode-project-dev

WEB_ENGINE=webkit-safari WEBPACK_BUILD_OUTPUT_PATH=safari-dev APP_ENV=development expo start --web &

while [ ! -d "$SAFARI_DEV_DIR" ] || [ ! -f "$INDEX" ] || [ ! -f "$BACKGROUND" ]; do
    echo "Waiting for safari-dev build to complete..."
    sleep 5
done

if [ -d "$SAFARI_DEV_DIR" ] && [ -f "$INDEX" ] && [ -f "$BACKGROUND" ]; then
  sleep 5

  yes | xcrun -v "/Applications/Xcode.app/Contents/Developer/usr/bin/safari-web-extension-converter" "$PROJECT_ROOT/build/safari-dev" --app-name safari-xcode-project-dev --project-location $PROJECT_ROOT/build --swift --force --no-prompt --no-open --macos-only

  while [ ! -d "$SAFARI_XCODE_PROJECT/safari-xcode-project-dev.xcodeproj" ]; do
    echo "Waiting for Xcode project creation to complete..."
    sleep 5
  done

  xcodebuild -project "$PROJECT_ROOT/build/safari-xcode-project-dev/safari-xcode-project-dev.xcodeproj" -configuration Debug build
  fswatch -o $PROJECT_ROOT/build/safari-dev | while read; do
    echo "Changes detected. Rebuilding Xcode project..."
    xcodebuild -project "$PROJECT_ROOT/build/safari-xcode-project-dev/safari-xcode-project-dev.xcodeproj" -configuration Debug build
  done
fi

# Infinite loop to keep the script running
while true; do
  sleep 10  # Sleep for 10 second in each iteration to reduce CPU usage
done
