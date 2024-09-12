#!/bin/bash

SAFARI_XCODE_PROJECT="/Applications/Ambire/ambire-mobile-wallet/ambire-extension-project-prod"

rm -rf ./safari-prod
rm -rf ./ambire-extension-project-prod
mkdir ambire-extension-project-prod
chmod 777 ambire-extension-project-prod

APP_ENV=production WEB_ENGINE=webkit-safari WEBPACK_BUILD_OUTPUT_PATH=safari-prod expo export:web &&
yes | xcrun "/Applications/Xcode.app/Contents/Developer/usr/bin/safari-web-extension-converter" "/Applications/Ambire/ambire-mobile-wallet/safari-prod" --app-name ambire-extension-project-prod --project-location /Applications/Ambire/ambire-mobile-wallet --swift --force --no-prompt --no-open --macos-only

while [ ! -d "$SAFARI_XCODE_PROJECT/ambire-extension-project-prod.xcodeproj" ]; do
  echo "Waiting for Xcode project creation to complete..."
  sleep 5
done

xcodebuild -project "/Applications/Ambire/ambire-mobile-wallet/ambire-extension-project-prod/ambire-extension-project-prod.xcodeproj" -configuration Debug build

