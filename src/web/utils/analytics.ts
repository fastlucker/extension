const getExtensionInstanceId = (keystoreUid: string | null): string | null => {
  if (!keystoreUid || keystoreUid.length < 21) return null

  return keystoreUid.substring(10, 21)
}

export { getExtensionInstanceId }
