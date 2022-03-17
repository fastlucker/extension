import React from 'react'
import { ActivityIndicator, RefreshControl, View } from 'react-native'

import { useTranslation } from '@config/localization'
import DevicesList from '@modules/auth/components/DeviceList'
import useLedgerConnect from '@modules/auth/hooks/useLedgerConnect'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

const HardwareWalletScreen = () => {
  const { t } = useTranslation()
  const { devices, refreshing, onSelectDevice, reload } = useLedgerConnect()

  return (
    <Wrapper
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={reload}
          tintColor={colors.primaryIconColor}
          progressBackgroundColor={colors.primaryIconColor}
          enabled={!refreshing}
        />
      }
    >
      {!!refreshing && (
        <View style={[flexboxStyles.alignCenter, spacings.mb]}>
          <Text style={[textStyles.bold, spacings.mbMi]}>{t('Looking for devices')}</Text>
          <Text style={textStyles.center} color={colors.secondaryTextColor} fontSize={14}>
            {t('Please make sure your Ledger Nano X is unlocked and Bluetooth is enabled.')}
          </Text>
        </View>
      )}
      <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, spacings.mbSm]}>
        <Title hasBottomSpacing={false} style={flexboxStyles.flex1}>
          Available devices
        </Title>
        {refreshing && <ActivityIndicator />}
      </View>
      <DevicesList devices={devices} refreshing={refreshing} onSelectDevice={onSelectDevice} />
    </Wrapper>
  )
}

export default HardwareWalletScreen
