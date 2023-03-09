import React from 'react'
import { RefreshControl, View } from 'react-native'

import Button from '@common/components/Button'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import Wrapper, { WRAPPER_TYPES } from '@common/components/Wrapper'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import textStyles from '@common/styles/utils/text'
import { useTranslation } from '@config/localization'
import DevicesList from '@mobile/auth/components/DeviceList'
import useLedgerConnect from '@mobile/hardware-wallet/hooks/useLedgerConnect'

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
        {!bluetoothRefreshing && (
          <Button text="Rescan" type="outline" size="small" onPress={bluetoothReload} />
        )}
      </View>
      <DevicesList
        devices={bluetoothDevices}
        refreshing={bluetoothRefreshing}
        onSelectDevice={onSelectDevice}
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
