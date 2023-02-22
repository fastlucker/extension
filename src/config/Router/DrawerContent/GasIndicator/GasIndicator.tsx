import { ACTION_GAS_COSTS, AMBIRE_OVERHEAD_COST } from 'ambire-common/src/constants/actionGasCosts'
import useCacheBreak from 'ambire-common/src/hooks/useCacheBreak'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'

import GasTankIcon from '@assets/svg/GasTankIcon'
import CONFIG from '@config/env'
import Text from '@modules/common/components/Text'
import useNetwork from '@modules/common/hooks/useNetwork'
import { fetchGet } from '@modules/common/services/fetch'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

interface Props {
  handleNavigate: (route: string) => void
}
const relayerURL = CONFIG.RELAYER_URL

const GAS_COST_ERC20_TRANSFER =
  ACTION_GAS_COSTS?.find((c) => c.name === 'ERC20: Transfer')?.gas + AMBIRE_OVERHEAD_COST

const GasIndicator = ({ handleNavigate }: Props) => {
  const [gasData, setGasData] = useState<any>(null)
  const { cacheBreak } = useCacheBreak()
  const { network } = useNetwork()

  useEffect(() => {
    let unmounted = false
    const url = `${relayerURL}/gasPrice/${network?.id}?cacheBreak=${cacheBreak}`

    fetchGet(url)
      .then((res) => {
        if (unmounted) return

        setGasData(res.data)
      })
      .catch((err) => {
        if (unmounted) return
        console.log('fetch error', err)
      })
    return () => {
      unmounted = true
    }
  }, [network?.id, cacheBreak])

  if (gasData) {
    return (
      <TouchableOpacity
        style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}
        activeOpacity={0.6}
        hitSlop={{
          left: 5,
          right: 5,
          top: 10,
          bottom: 5
        }}
        onPress={() => handleNavigate('/gas-information')}
      >
        <Text fontSize={14} color={colors.titan_50}>
          {network?.nativeAssetSymbol}
          {': '}
          {Number(gasData.gasFeeAssets.native).toLocaleString('en-US', {
            minimumFractionDigits: 2
          })}
        </Text>
        <Text style={[spacings.prMi, spacings.plTy]} color={colors.heliotrope} fontSize={16}>
          |
        </Text>
        <GasTankIcon />
        <Text fontSize={14} color={colors.titan_50}>
          $
          {(
            (((gasData.gasPrice.maxPriorityFeePerGas
              ? gasData.gasPrice.maxPriorityFeePerGas.medium + gasData.gasPrice.medium
              : gasData.gasPrice.medium) *
              GAS_COST_ERC20_TRANSFER) /
              10 ** 18) *
            gasData.gasFeeAssets.native
          ).toFixed(2)}
        </Text>
      </TouchableOpacity>
    )
  }
  return null
}

export default GasIndicator
