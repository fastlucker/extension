#!/bin/bash

yes | xcrun "/Applications/Xcode.app/Contents/Developer/usr/bin/safari-web-extension-converter" "/Applications/Ambire/ambire-mobile-wallet/webkit-prod" --app-name ambire-extension-project-prod --project-location /Applications/Ambire/ambire-mobile-wallet --swift --force --no-prompt --no-open --macos-only
