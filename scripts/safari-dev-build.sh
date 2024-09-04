#!/bin/bash

SAFARI_DEV_DIR="/Applications/Ambire/ambire-mobile-wallet/safari-dev"
SAFARI_XCODE_PROJECT="/Applications/Ambire/ambire-mobile-wallet/ambire-extension-project"
INDEX="/Applications/Ambire/ambire-mobile-wallet/safari-dev/index.html"
BACKGROUND="/Applications/Ambire/ambire-mobile-wallet/safari-dev/background.js"
EXPO_DEV_PORT=19000


cleanup() {
  PID=$(lsof -t -i :$EXPO_DEV_PORT)
  if [ -n "$PID" ]; then
    kill $PID
  fi
  pkill -P $$
  exit 0
}

trap cleanup SIGINT

rm -rf ./safari-dev
rm -rf ./ambire-extension-project
mkdir ambire-extension-project
chmod 777 ambire-extension-project

WEB_ENGINE=webkit WEBPACK_BUILD_OUTPUT_PATH=safari-dev APP_ENV=development expo start --web &

while [ ! -d "$SAFARI_DEV_DIR" ] || [ ! -f "$INDEX" ] || [ ! -f "$BACKGROUND" ]; do
    echo "Waiting for safari-dev build to complete..."
    sleep 5
done

if [ -d "$SAFARI_DEV_DIR" ] && [ -f "$INDEX" ] && [ -f "$BACKGROUND" ]; then
  sleep 5

  yes | xcrun -v "/Applications/Xcode.app/Contents/Developer/usr/bin/safari-web-extension-converter" "/Applications/Ambire/ambire-mobile-wallet/safari-dev" --app-name ambire-extension-project --project-location /Applications/Ambire/ambire-mobile-wallet --swift --force --no-prompt --no-open --macos-only

  while [ ! -d "$SAFARI_XCODE_PROJECT/build/ambire-extension-project.build" ]; do
    echo "Waiting for Xcode project creation to complete..."
    sleep 5
  done

  xcodebuild -project "/Applications/Ambire/ambire-mobile-wallet/ambire-extension-project/ambire-extension-project.xcodeproj" -configuration Debug build
  fswatch -o /Applications/Ambire/ambire-mobile-wallet/safari-dev | while read; do
    echo "Changes detected. Rebuilding Xcode project..."
    xcodebuild -project "/Applications/Ambire/ambire-mobile-wallet/ambire-extension-project/ambire-extension-project.xcodeproj" -configuration Debug build
  done
fi

# Infinite loop to keep the script running
while true; do
  sleep 10  # Sleep for 10 second in each iteration to reduce CPU usage
done
