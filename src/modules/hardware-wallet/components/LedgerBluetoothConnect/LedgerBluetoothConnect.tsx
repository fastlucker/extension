import React from 'react'
import { RefreshControl, View } from 'react-native'

import { useTranslation } from '@config/localization'
import DevicesList from '@modules/auth/components/DeviceList'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
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
        <View style={[flexboxStyles.alignCenter, spacings.mbLg]}>
          <Text style={spacings.mbSm} fontSize={14}>
            {t('Looking for devices')}
          </Text>
          <Text style={textStyles.center} color={colors.chetwode} fontSize={12}>
            {t('Please make sure your Ledger Nano X is unlocked and Bluetooth is enabled.')}
          </Text>
        </View>
      )}
      <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, spacings.mb]}>
        <Text style={flexboxStyles.flex1} fontSize={16} weight="medium">
          {t('Available devices')}
        </Text>
        {!!bluetoothRefreshing && <Spinner />}
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
          tintColor={colors.titan}
          progressBackgroundColor={colors.titan}
          enabled={!bluetoothRefreshing}
        />
      }
    >
      {content}
    </Wrapper>
  )
}

export default LedgerBluetoothConnect
