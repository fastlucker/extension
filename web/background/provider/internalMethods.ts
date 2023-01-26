import providerController from '@web/background/provider/ProviderController'
import permissionService from '@web/background/services/permission'

const networkIdMap: {
  [key: string]: string
} = {}

const tabCheckin = ({
  data: {
    params: { name, icon }
  },
  session,
  origin
}) => {
  session.setProp({ origin, name, icon })
  // TODO:
  // preferenceService.detectPhishing(origin)
}

const getProviderState = async (req) => {
  const {
    session: { origin }
  } = req

  const chainEnum = permissionService.getWithoutUpdate(origin)?.chain || 'ETH'
  const isUnlocked = true
  const networkVersion = '1'
  if (networkIdMap[chainEnum]) {
    // networkVersion = networkIdMap[chainEnum]
  } else {
    // networkVersion = await providerController.netVersion(req)
    networkIdMap[chainEnum] = '1'
  }

  return {
    chainId: '0x1',
    isUnlocked,
    accounts: isUnlocked ? await providerController.ethAccounts(req) : [],
    networkVersion
  }
}

const providerOverwrite = ({
  data: {
    params: [val]
  }
}) => {
  // preferenceService.setHasOtherProvider(val)
  return true
}

const hasOtherProvider = () => {
  // preferenceService.setHasOtherProvider(true)
  // TODO:
  // const isRabby = preferenceService.getIsDefaultWallet()
  // setPopupIcon(isRabby ? 'rabby' : 'metamask')
  return false
}

const isDefaultWallet = () => {
  // TODO:
  return true
  // return preferenceService.getIsDefaultWallet()
}

export default {
  tabCheckin,
  getProviderState,
  providerOverwrite,
  hasOtherProvider,
  isDefaultWallet
}
