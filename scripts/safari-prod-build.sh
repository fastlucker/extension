#!/bin/bash

SAFARI_XCODE_PROJECT="/Applications/Ambire/ambire-mobile-wallet/build/ambire-extension-project-prod"

rm -rf ./build/safari-prod
rm -rf ./build/ambire-extension-project-prod
mkdir ./build/ambire-extension-project-prod
chmod 777 ./build/ambire-extension-project-prod

APP_ENV=production WEB_ENGINE=webkit-safari WEBPACK_BUILD_OUTPUT_PATH=safari-prod expo export:web &&
yes | xcrun "/Applications/Xcode.app/Contents/Developer/usr/bin/safari-web-extension-converter" "/Applications/Ambire/ambire-mobile-wallet/build/safari-prod" --app-name ambire-extension-project-prod --project-location /Applications/Ambire/ambire-mobile-wallet/build --swift --force --no-prompt --no-open --macos-only

while [ ! -d "$SAFARI_XCODE_PROJECT/ambire-extension-project-prod.xcodeproj" ]; do
  echo "Waiting for Xcode project creation to complete..."
  sleep 5
done

xcodebuild -project "/Applications/Ambire/ambire-mobile-wallet/build/ambire-extension-project-prod/ambire-extension-project-prod.xcodeproj" -configuration Debug build

