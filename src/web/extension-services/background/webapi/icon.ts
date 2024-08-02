import { browser } from '@web/constants/browserapi'

export const setExtensionIcon = (type: 'default' | 'locked') => {
  const icons = [16, 48, 96, 128].reduce((res: { [key: number]: string }, size: number) => {
    if (type === 'locked') {
      res[size] = `assets/images/xicon_locked@${size}.png`
    } else {
      res[size] = `assets/images/xicon@${size}.png`
    }

    return res
  }, {})

  return browser.action.setIcon({ path: icons })
}
