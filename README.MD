# Ambire Mobile Wallet

Hybrid (React Native) Mobile App. This project is built with Expo's bare workflow, allowing developers to extend the default Vanilla React Native with additional expo modules in the form of installable expo libraries. Bare template projects come with expo installed and configured, so you're ready to install and use any package from the Expo SDK. A complete list of all expo packages can be found here: https://docs.expo.dev/versions/latest/

## React Native Environment Setup

https://reactnative.dev/docs/environment-setup

## Install

First run `yarn install`.

iOS:
Then run `cd ios && pod install && cd ..` from the root folder of the project. This command links the native iOS packages using CocoaPods.

Android:
No additional steps required.

## Start

iOS:
`yarn ios`
Note: This command runs `expo run:ios`.

Android:
`yarn android`
Note: This command runs `expo run:android`.

Development server (Metro bundler):
`yarn start`
Note: This command runs `react-native start`.
