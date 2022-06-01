import { Token } from 'ambire-common/src/hooks/usePortfolio'
import React from 'react'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { Trans } from '@config/localization'
import Text from '@modules/common/components/Text'
import TokenIcon from '@modules/common/components/TokenIcon'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

interface Props extends Token {
  onPress?: () => void
}

const TokenItem: React.FC<Props> = ({
  tokenImageUrl,
  address,
  network,
  name,
  symbol,
  balance,
  onPress
}) => (
  <View style={[flexboxStyles.directionRow, spacings.mbLg]}>
    <TokenIcon withContainer uri={tokenImageUrl} address={address} networkId={network} />

    <View style={[spacings.mlTy, flexboxStyles.flex1]}>
      <Text>
        {name} ({symbol})
      </Text>

      <Trans>
        <Text>
          Balance: <Text style={textStyles.highlightSecondary}>{balance}</Text>{' '}
          <Text weight="medium">{symbol}</Text>
        </Text>
      </Trans>
    </View>
    {!!onPress && (
      <TouchableOpacity style={spacings.mlTy} onPress={onPress}>
        <Text>➖</Text>
      </TouchableOpacity>
    )}
  </View>
)

export default React.memo(TokenItem)
