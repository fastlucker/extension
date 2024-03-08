import { ProviderController } from '@web/extension-services/background/provider/ProviderController'
import rpcFlow from '@web/extension-services/background/provider/rpcFlow'
import { ProviderRequest } from '@web/extension-services/background/provider/types'

const handleProviderRequests = async (req: ProviderRequest): Promise<any> => {
  const { data, session } = req
  if (data.method === 'tabCheckin') {
    session.setProp({ origin: req.origin, name: data.params.name, icon: data.params.icon })
    return
  }

  if (data.method === 'getProviderState') {
    const providerController = new ProviderController(req.mainCtrl, req.dappsCtrl)
    const isUnlocked = req.mainCtrl.keystore.isUnlocked
    const chainId = await providerController.ethChainId(req)
    let networkVersion = '1'

    try {
      networkVersion = parseInt(chainId, 16).toString()
    } catch (error) {
      networkVersion = '1'
    }

    return {
      chainId,
      isUnlocked,
      accounts: isUnlocked ? await providerController.ethAccounts(req) : [],
      networkVersion
    }
  }

  return rpcFlow(req)
}

export default handleProviderRequests
