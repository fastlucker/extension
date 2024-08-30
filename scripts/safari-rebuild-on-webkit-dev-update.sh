#!/bin/bash

yes | xcrun "/Applications/Xcode.app/Contents/Developer/usr/bin/safari-web-extension-converter" "/Applications/Ambire/ambire-mobile-wallet/webkit-dev" --app-name ambire-extension-project --project-location /Applications/Ambire/ambire-mobile-wallet --swift --force --no-prompt --no-open --macos-only

xcodebuild -project "/Applications/Ambire/ambire-mobile-wallet/ambire-extension-project/ambire-extension-project.xcodeproj" -configuration Debug build
fswatch -o /Applications/Ambire/ambire-mobile-wallet/webkit-dev | while read; do
  echo "Changes detected. Rebuilding Xcode project..."
  xcodebuild -project "/Applications/Ambire/ambire-mobile-wallet/ambire-extension-project/ambire-extension-project.xcodeproj" -configuration Debug build
done
