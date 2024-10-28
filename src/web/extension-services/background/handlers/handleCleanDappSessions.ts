import storage from '@web/extension-services/background/webapi/storage'
import { getAllOpenedTabs } from '@web/extension-services/background/webapi/tab'

export const handleCleanDappSessions = async () => {
  const openedTabs = await getAllOpenedTabs()
  const dappSessions = await storage.get('dappSessions', {})

  console.log(openedTabs, dappSessions)
  Object.keys(dappSessions).forEach((key) => {
    if (!openedTabs.find((t) => t.id === dappSessions[key].tabId)) {
      delete dappSessions[key]
    }
  })
}
