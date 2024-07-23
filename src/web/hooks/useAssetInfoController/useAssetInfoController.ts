import { useContext } from 'react'

import { AssetInfoControllerStateContext } from '@web/contexts/assetInfoControllerStateContext'

export default function useAssetInfoController() {
  const context = useContext(AssetInfoControllerStateContext)

  if (!context) {
    throw new Error('useAssetInfoController must be used within a AssetInfoControllerStateContext')
  }

  return context
}
