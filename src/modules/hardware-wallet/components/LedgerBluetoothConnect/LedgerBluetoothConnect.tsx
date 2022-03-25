import React from 'react'
import { ActivityIndicator, RefreshControl, View } from 'react-native'

import { useTranslation } from '@config/localization'
import DevicesList from '@modules/auth/components/DeviceList'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper, { WRAPPER_TYPES } from '@modules/common/components/Wrapper'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import useLedgerConnect from '@modules/hardware-wallet/hooks/useLedgerConnect'

interface Props {
  onSelectDevice: (device: any) => any
  shouldScan?: boolean
  shouldWrap?: boolean
}

const LedgerBluetoothConnect = ({
  onSelectDevice,
  shouldScan = true,
  shouldWrap = true
}: Props) => {
  const { t } = useTranslation()

  const {
    devices: bluetoothDevices,
    refreshing: bluetoothRefreshing,
    reload: bluetoothReload
  } = useLedgerConnect(shouldScan)

  const content = (
    <>
      {!!bluetoothRefreshing && (
        <View style={[flexboxStyles.alignCenter, spacings.mb, !shouldWrap && spacings.ptSm]}>
          <Text style={[textStyles.bold, spacings.mbMi]}>{t('Looking for devices')}</Text>
          <Text style={textStyles.center} color={colors.secondaryTextColor} fontSize={14}>
            {t('Please make sure your Ledger Nano X is unlocked and Bluetooth is enabled.')}
          </Text>
        </View>
      )}
      <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, spacings.mbSm]}>
        <Title hasBottomSpacing={false} style={flexboxStyles.flex1}>
          {t('Available devices')}
        </Title>
        {!!bluetoothRefreshing && <ActivityIndicator color={colors.primaryIconColor} />}
      </View>
      <DevicesList
        devices={bluetoothDevices}
        refreshing={bluetoothRefreshing}
        onSelectDevice={onSelectDevice}
        onRefresh={bluetoothReload}
      />
    </>
  )

  return (
    <Wrapper
      type={shouldWrap ? WRAPPER_TYPES.SCROLL_VIEW : WRAPPER_TYPES.VIEW}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={bluetoothReload}
          tintColor={colors.primaryIconColor}
          progressBackgroundColor={colors.primaryIconColor}
          enabled={!bluetoothRefreshing}
        />
      }
    >
      {content}
    </Wrapper>
  )
}

export default LedgerBluetoothConnect
