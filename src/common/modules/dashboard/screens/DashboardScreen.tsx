import React from 'react'
import { View } from 'react-native'

import NavIconWrapper from '@common/components/NavIconWrapper'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

const DashboardScreen = () => {
  const { t } = useTranslation()
  const totalBalance = 20500.9
  return (
    <Wrapper
      contentContainerStyle={[spacings.pv, spacings.ph]}
      style={{ backgroundColor: 'white', flex: 1 }}
    >
      <View>
        <Text color={colors.martinique_65} shouldScale={false} weight="regular" fontSize={20}>
          {t('Balance')}
        </Text>
        <View style={[flexbox.directionRow, flexbox.alignEnd]}>
          <Text fontSize={36} weight="regular">
            $ {Number(totalBalance.toFixed(2).split('.')[0]).toLocaleString('en-US')}
          </Text>
          <Text fontSize={23} weight="regular">
            .{Number(totalBalance.toFixed(2).split('.')[1])}
          </Text>
        </View>
        <View>
          <NavIconWrapper />
        </View>
      </View>
      <View />
    </Wrapper>
  )
}

export default DashboardScreen
