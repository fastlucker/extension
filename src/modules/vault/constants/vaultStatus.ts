// eslint-disable-next-line @typescript-eslint/naming-convention
export enum VAULT_STATUS {
  LOADING = 'loading',
  NOT_INITIALIZED = 'not-initialized',
  // Initially locked, so it pups the <VaultStack /> and doesn't render
  // anything else until vault gets unlocked
  LOCKED = 'locked',
  // Locked temporarily, when the app goes to background (inactive),
  // but it does not unmount the main app stack.
  LOCKED_TEMPORARILY = 'locked-temporarily',
  UNLOCKED = 'unlocked'
}
