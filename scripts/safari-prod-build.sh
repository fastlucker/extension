#!/bin/bash

rm -rf ./safari-prod
rm -rf ./ambire-extension-project-prod
mkdir ambire-extension-project-prod
chmod 777 ambire-extension-project-prod

APP_ENV=production WEB_ENGINE=webkit WEBPACK_BUILD_OUTPUT_PATH=safari-prod expo export:web &&
yes | xcrun "/Applications/Xcode.app/Contents/Developer/usr/bin/safari-web-extension-converter" "/Applications/Ambire/ambire-mobile-wallet/safari-prod" --app-name ambire-extension-project-prod --project-location /Applications/Ambire/ambire-mobile-wallet --swift --force --no-prompt --no-open --macos-only
