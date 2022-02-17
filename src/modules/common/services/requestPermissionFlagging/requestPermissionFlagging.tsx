// Wraps a request permission promise and sets / un-sets the appropriate flag.
// This is needed for Android because the permission requests, even thought
// they're already accepted or not redirect the app to settings (only display modal),
// they all trigger AppState change (to `background` and then `active`).
// Which triggers the AppState listeners, like the one on the PasscodeContext,
// that locks the app (in case lock when inactive option is active).
// Apply this for both iOS and Android, for consistency.
export default function requestPermissionFlagging<R>(p: () => Promise<R>): Promise<R> {
  global.isAskingForPermission = true

  return p().finally(() => {
    global.isAskingForPermission = false
  })
}
