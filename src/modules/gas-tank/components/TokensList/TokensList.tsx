import { NetworkId, NetworkType } from 'ambire-common/src/constants/networks'
import { UseAccountsReturnType } from 'ambire-common/src/hooks/useAccounts'
import { UseToastsReturnType } from 'ambire-common/src/hooks/useToasts'
import React from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import useGasTank from '@modules/common/hooks/useGasTank'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import { DepositTokenBottomSheetProvider } from '@modules/gas-tank/contexts/depositTokenBottomSheetContext'

import TokensListItem from './TokensListItem'

interface Props {
  tokens: any[]
  isLoading: boolean
  networkId?: NetworkId
  chainId?: NetworkType['chainId']
  selectedAcc: UseAccountsReturnType['selectedAcc']
  addRequest: any
  addToast: UseToastsReturnType['addToast']
}

const TokensList = ({
  tokens,
  isLoading,
  networkId,
  chainId,
  selectedAcc,
  addRequest,
  addToast
}: Props) => {
  const { t } = useTranslation()
  const { currentAccGasTankState } = useGasTank()
  if (isLoading) {
    return (
      <View style={!currentAccGasTankState.isEnabled && { opacity: 0.2 }}>
        <Text style={spacings.mbTy} fontSize={12}>
          {t('Available fee tokens')}
        </Text>
        <View style={[flexboxStyles.center, spacings.ptMd, spacings.pbLg]}>
          <Spinner />
        </View>
      </View>
    )
  }

  return (
    <DepositTokenBottomSheetProvider
      networkId={networkId}
      chainId={chainId}
      selectedAcc={selectedAcc}
      addRequest={addRequest}
      addToast={addToast}
    >
      <View
        style={!currentAccGasTankState.isEnabled && { opacity: 0.2 }}
        pointerEvents={!currentAccGasTankState.isEnabled ? 'none' : 'auto'}
      >
        <Text style={spacings.mbTy} fontSize={12}>
          {t('Available fee tokens')}
        </Text>
        {!!tokens &&
          tokens.map((token, i: number) => (
            <TokensListItem
              // eslint-disable-next-line react/no-array-index-key
              key={`token-${token.address}-${i}`}
              token={token}
              networkId={networkId}
            />
          ))}
      </View>
    </DepositTokenBottomSheetProvider>
  )
}

export default React.memo(TokensList)
