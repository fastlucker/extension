import { nanoid } from 'nanoid'

export const sendSigningSuccessBrowserNotification = async (
  type: 'message' | 'typed-data' | 'account-op'
) => {
  let message = ''
  if (type === 'message') {
    message = 'Message was successfully signed'
  }
  if (type === 'typed-data') {
    message = 'TypedData was successfully signed'
  }
  if (type === 'account-op') {
    message = 'Your transaction was successfully signed and broadcasted to the network'
  }

  // service_worker (mv3) - without await the notification doesn't show
  try {
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
