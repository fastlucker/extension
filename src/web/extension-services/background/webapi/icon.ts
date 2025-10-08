import { browser } from '@web/constants/browserapi'

// Function to determine the file name suffix based on manifest.json icons
const getFileNameSuffix = (): string => {
  try {
    // Get the manifest from the extension runtime
    const manifest = browser.runtime.getManifest()

    // Check the 16px icon first, or fallback to the first available icon
    const iconToCheck = manifest.icons?.['16'] || (Object.values(manifest.icons || {})[0] as string)

    if (iconToCheck?.includes('-dev-build-ONLY')) {
      return '-dev-build-ONLY'
    }

    if (iconToCheck?.includes('-next-build-ONLY')) {
      return '-next-build-ONLY'
    }

    // Default: no suffix for production build
    return ''
  } catch (error) {
    console.warn('Failed to read manifest for file name suffix:', error)
    return ''
  }
}

export const setExtensionIcon = (type: 'default' | 'locked') => {
  const fileNameSuffix = getFileNameSuffix()

  const icons = [16, 48, 96, 128].reduce((res: { [key: number]: string }, size: number) => {
    const sizeWithSuffix = `${size}${fileNameSuffix}`
    if (type === 'locked') {
      res[size] = `assets/images/xicon_locked@${sizeWithSuffix}.png`
    } else {
      res[size] = `assets/images/xicon@${sizeWithSuffix}.png`
    }

    return res
  }, {})

  return browser.action.setIcon({ path: icons })
}
