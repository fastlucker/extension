export const SECURE_STORE_KEY_PASSCODE = 'passcode'
export const SECURE_STORE_KEY_KEYSTORE_PASSWORD = 'keystore-password'

// Persist the legacy values for this key, because the logic stays the same
// and therefore - users who have activated biometrics before - will loose
// their settings otherwise (because these flags are cached in the storage).
export const IS_BIOMETRICS_UNLOCK_ACTIVE_KEY = 'isLocalAuthActivated'

export const LOCK_ON_STARTUP_KEY = 'lockOnStartup'
export const LOCK_WHEN_INACTIVE_KEY = 'lockWhenInactive'
