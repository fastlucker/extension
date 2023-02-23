import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import DashboardIcon from '@assets/svg/DashboardIcon'
import EarnIcon from '@assets/svg/EarnIcon'
import GasTankIcon from '@assets/svg/GasTankIcon'
import SendIcon from '@assets/svg/SendIcon'
import TransferIcon from '@assets/svg/TransferIcon'
import Text from '@modules/common/components/Text'
import { TAB_BAR_HEIGHT } from '@modules/common/constants/router'
import useNavigation from '@modules/common/hooks/useNavigation'
import colors from '@modules/common/styles/colors'
import { IS_SCREEN_SIZE_L } from '@modules/common/styles/spacings'
import flexbox from '@modules/common/styles/utils/flexbox'

import styles from '../styles'

const tabsIconSize = IS_SCREEN_SIZE_L ? 44 : 24

const Item = ({ icon, title, name }: any) => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity
      style={{
        height: TAB_BAR_HEIGHT,
        flex: 1,
        alignItems: 'center',
        paddingVertical: 15
      }}
      onPress={() => navigation.navigate(`/${name}`)}
    >
      <View
        style={{
          marginBottom: 5
        }}
      >
        {icon}
      </View>
      <Text fontSize={10}>{title}</Text>
    </TouchableOpacity>
  )
}

const BottomNav = () => {
  return (
    <View style={[styles.tabBarContainerWeb]}>
      <View style={[styles.backdropBlurWrapper]}>
        <View style={flexbox.directionRow}>
          <Item
            name="dashboard"
            icon={<DashboardIcon width={tabsIconSize} height={tabsIconSize} />}
            title="Dashboard"
          />
          <Item
            name="earn"
            icon={<EarnIcon width={tabsIconSize} height={tabsIconSize} />}
            title="Earn"
          />
          <Item
            name="send"
            icon={<SendIcon width={tabsIconSize} height={tabsIconSize} />}
            title="Send"
          />
          <Item
            name="transactions"
            icon={<TransferIcon width={tabsIconSize} height={tabsIconSize} />}
            title="Transactions"
          />

          <Item
            name="gas-tank"
            icon={<GasTankIcon color={colors.titan} width={tabsIconSize} height={tabsIconSize} />}
            title="Gas Tank"
          />
        </View>
      </View>
    </View>
  )
}

export default BottomNav
