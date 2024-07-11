import { nanoid } from 'nanoid'

import { browser } from '@web/constants/browserapi'

export const sendBrowserNotification = async (message: string) => {
  try {
    // service_worker (mv3) - without await the notification doesn't show
    await browser.notifications.create(nanoid(), {
      type: 'basic',
      iconUrl: browser.runtime.getURL('assets/images/xicon@96.png'),
      title: 'Successfully signed',
      message
    })
  } catch (err) {
    console.warn(`Failed to register browser notification: ${err}`)
  }
}
