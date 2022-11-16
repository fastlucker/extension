// eslint-disable-next-line @typescript-eslint/naming-convention
export enum APP_LOCK_STATES {
  // The states (keys) have changed, but persist the legacy values them,
  // because the logic stays the same and therefore - users who have set up
  // app lock state before - will loose their settings otherwise
  // (because these flags are cached in the storage)
  UNLOCKED = 'NO_PASSCODE',
  PASSCODE_ONLY = 'PASSCODE_ONLY',
  PASSCODE_AND_BIOMETRICS = 'PASSCODE_AND_LOCAL_AUTH'
}
