import React, { FC } from 'react'
import { View } from 'react-native'

import { TokenResult } from '@ambire-common/libs/portfolio'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

type Props = Partial<Pick<TokenResult, 'priceIn'>>

const TokenHeader: FC<Props> = ({ priceIn }) => {
  const { t } = useTranslation()

  return (
    <View style={[flexbox.directionRow, flexbox.justifySpaceBetween]}>
      <Text
        fontSize={12}
        weight="medium"
        style={[spacings.mbMd, { flex: 1 }]}
        appearance="secondaryText"
      >
        {t('ASSET/AMOUNT')}
      </Text>

      <Text
        fontSize={12}
        weight="medium"
        style={[spacings.mbMd, { flex: 0.7 }]}
        appearance="secondaryText"
      >
        {t('Price')}
      </Text>
      <Text
        fontSize={12}
        weight="medium"
        style={[
          spacings.mbMd,
          {
            textAlign: 'right',
            flex: priceIn?.length ? 0.7 : 0.12
          }
        ]}
        appearance="secondaryText"
      >
        {t('USD Value')}
      </Text>

      <View style={{ flex: priceIn?.length ? 0.5 : 0 }} />
    </View>
  )
}

export default React.memo(TokenHeader)
