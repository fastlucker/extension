# Ambire Mobile Wallet

Hybrid (React Native) Mobile App. This project is built with Expo's bare workflow, allowing developers to extend the default Vanilla React Native with additional expo modules in the form of installable expo libraries. Bare template projects come with expo installed and configured, so you're ready to install and use any package from the Expo SDK. A complete list of all expo packages can be found here: https://docs.expo.dev/versions/latest/

## React Native Environment Setup

Read about the environment setup and prerequisites [here](https://reactnative.dev/docs/environment-setup).

## Install

First run:

```bash
yarn install
```

Then, run:

```bash
git submodule update --init
```

- iOS: Then run:

  ```
  cd ios && pod install
  ```

  from the root folder of the project. This command links the native iOS packages using CocoaPods.

- Android:

  No additional steps required.

## Editor Config

Make sure your code editor has plugins that support the following configuration files: `.editorconfig`, `.prettierrc`, `tsconfig.json`, `eslintrc.js`, [`import-sorter.json`](https://github.com/SoominHan/import-sorter).

## Start

iOS:

```bash
yarn ios
```

Note: This command runs `expo run:ios`.

Android:

```bash
yarn android
```

Note: This command runs `expo run:android`.

Development server (Metro bundler):

```bash
yarn start
```

Note: This command runs `react-native start`.

## Translations (Beta)

To scan the project for translation labels and to update translations JSON files, run:

```bash
yarn translations:scan
```

PS: Secondary languages not implemented / translated / fully tested yet.

## Publishing over the air updates

When doing over the air updates, be careful. Adding new packages requires a new build if they require native "linking".

```bash
yarn publish:production
```

## Versioning

When releasing a new version, here are the steps:

1. Our internal app version: X.X.X (example: `1.4.2`). Follows semantic versioning.

   Change in app.json -> `version`

1. Native version: X.X (example: `1.4`). This one is mostly for labeling within the App Store and Google Play. Keep synced with our internal app version when creating a new build. But it could also be behind, if the next internal version we're about to ship doesn't require creating a new build.

   iOS: Change `CFBundleShortVersionString` in the `ios/ambiremobilewallet/Info.plist` file

   Android: Change `versionName` string in the `android/app/build.gradle` file

1. Native build version. Integer. Bump up If the next internal version we're about to ship requires creating a new build (example: `4`):

   iOS: `CFBundleVersion` in the `ios/ambiremobilewallet/Info.plist` file

   Android: `versionCode` in the `android/app/build.gradle` file

1. Runtime version. Integer. Bump up If the next internal version we're about to ship requires creating a new build and shipping it over the air will break the previous (existing) builds: (example: `1`)

   For both platforms: change `runtimeVersion` key in `app.json`. Then run: `eas build:configure`.

   iOS: Change the key `EXUpdatesRuntimeVersion` in the `Expo.plist` file

   Android: Change the `<meta-data>` element with `expo.modules.updates.EXPO_RUNTIME_VERSION` attribute in AndroidManifest.xml file

## Quirks

- If the iOS build fails with the following error:

  ```
  > ❌  ... duplicate symbols for architecture x86_64
  > Failed to build iOS project. "xcodebuild" exited with error code 65.
  ```

  Run:

  ```bash
  rm -rf node_modules/react-native-tcp/ios/CocoaAsyncSocket
  ```

  Then:

  ```bash
  cd ios && pod install
  ```
