import { useCallback } from 'react'

import LedgerController from '../../controllers/LedgerController'

const useLedger = () => {
  // TODO: Connectivity indicators.
  // const [isConnected, setIsConnected] = useState(false)
  // const onConnect = async ({ device }: { device: HIDDevice }) => {
  //   if (device.vendorId === LedgerController.vendorId) setIsConnected(true)
  // }
  // const onDisconnect = ({ device }: { device: HIDDevice }) => {
  //   if (device.vendorId === LedgerController.vendorId) setIsConnected(false)
  // }
  // const detectDevice = async () => setIsConnected(await LedgerController.isConnected())
  // TODO: Hook up only when needed.
  // useEffect(() => {
  //   detectDevice()

  //   navigator.hid.addEventListener('connect', onConnect)
  //   navigator.hid.addEventListener('disconnect', onDisconnect)
  //   browser.windows.onFocusChanged.addListener(detectDevice)

  //   return () => {
  //     navigator.hid.removeEventListener('connect', onConnect)
  //     navigator.hid.removeEventListener('disconnect', onDisconnect)
  //     browser.windows.onFocusChanged.removeListener(detectDevice)
  //   }
  // }, [])

  const requestLedgerDeviceAccess = useCallback(async () => {
    const isSupported = await LedgerController.isSupported()
    if (!isSupported) {
      const message =
        "Your browser doesn't support WebHID, which is required for the Ledger device. Please try using a different browser."
      throw new Error(message)
    }

    // The WebHID API requires: 1) A user gesture (click) to open the device
    // selection prompt (to allow the extension to access a HID device) and
    // 2) To call this in the extension foreground on a new tab (not in an action window).
    await LedgerController.grantDevicePermissionIfNeeded()
  }, [])

  return { requestLedgerDeviceAccess }
}

export default useLedger
