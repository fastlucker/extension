import { NetworkId } from 'ambire-common/src/constants/networks'
import React from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import TokensListItem from './TokensListItem'

interface Props {
  tokens: any[]
  isLoading: boolean
  networkId?: NetworkId
}

const TokensList = ({ tokens, isLoading, networkId }: Props) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <View style={[flexboxStyles.center, spacings.pbLg]}>
        <Text style={spacings.mbTy} fontSize={12}>
          {t('Available fee tokens')}
        </Text>
        <Spinner />
      </View>
    )
  }

  return (
    <View>
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
  )
}

export default React.memo(TokensList)
