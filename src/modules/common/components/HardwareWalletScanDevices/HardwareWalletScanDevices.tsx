import React, { useState } from 'react'
import { ActivityIndicator, RefreshControl, View } from 'react-native'

import { useTranslation } from '@config/localization'
import DevicesList from '@modules/auth/components/DeviceList'
import useHardwareWalletHIDConnect from '@modules/auth/hooks/useHardwareWalletHIDConnect/useHardwareWalletHIDConnect'
import useLedgerConnect from '@modules/auth/hooks/useLedgerConnect'
import Segments from '@modules/common/components/Segments'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import useToast from '@modules/common/hooks/useToast'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

// eslint-disable-next-line @typescript-eslint/naming-convention
enum CONNECTION_TYPE {
  BLUETOOTH = 'Bluetooth',
  USB = 'USB'
}
interface Props {
  onSelectDevice: (device: any) => any
  shouldWrap?: boolean
  shouldScan?: boolean
}

const segments = [{ value: CONNECTION_TYPE.BLUETOOTH }, { value: CONNECTION_TYPE.USB }]

const HardwareWalletScanDevices = ({
  onSelectDevice,
  shouldWrap = true,
  shouldScan = true
}: Props) => {
  const { t } = useTranslation()
  const { addToast } = useToast()

  const [connectionType, setConnectionType] = useState(CONNECTION_TYPE.BLUETOOTH)
  const {
    devices: bluetoothDevices,
    refreshing: bluetoothRefreshing,
    isBluetoothPoweredOn,
    reload: bluetoothReload
  } = useLedgerConnect(shouldScan && connectionType === CONNECTION_TYPE.BLUETOOTH)
  const {
    device: usbDevice,
    reload: usbReload,
    refreshing: usbRefreshing
  } = useHardwareWalletHIDConnect()

  const handleOnRefresh = () => {
    if (connectionType === CONNECTION_TYPE.USB) {
      return usbReload()
    }

    if (!isBluetoothPoweredOn) {
      return addToast(t('Please turn on the Bluetooth first.') as string, { error: true })
    }

    return bluetoothReload()
  }

  const renderBluetoothScanContent = (
    <>
      {!!bluetoothRefreshing && (
        <View style={[flexboxStyles.alignCenter, spacings.mb]}>
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
        type={CONNECTION_TYPE.BLUETOOTH}
        devices={bluetoothDevices}
        refreshing={bluetoothRefreshing}
        onSelectDevice={onSelectDevice}
        onRefresh={handleOnRefresh}
      />
    </>
  )

  const renderUSBScanContent = (
    <>
      <View style={[flexboxStyles.alignCenter, spacings.mb]}>
        <Text style={textStyles.center} color={colors.secondaryTextColor} fontSize={14}>
          {t('Please connect USB cable and enter the PIN code on your device')}
        </Text>
      </View>
      <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, spacings.mbSm]}>
        <Title hasBottomSpacing={false} style={flexboxStyles.flex1}>
          {t('Available devices')}
        </Title>
        {!!usbRefreshing && <ActivityIndicator color={colors.primaryIconColor} />}
      </View>
      <DevicesList
        type={CONNECTION_TYPE.USB}
        devices={usbDevice ? [usbDevice] : []}
        refreshing={usbRefreshing}
        onSelectDevice={onSelectDevice}
        onRefresh={handleOnRefresh}
      />
    </>
  )

  const content = (
    <>
      <View style={spacings.mb}>
        <Segments
          defaultValue={connectionType}
          segments={segments}
          onChange={(value: CONNECTION_TYPE) => setConnectionType(value)}
        />
      </View>
      {connectionType === CONNECTION_TYPE.BLUETOOTH && renderBluetoothScanContent}
      {connectionType === CONNECTION_TYPE.USB && renderUSBScanContent}
    </>
  )

  return shouldWrap ? (
    <Wrapper
      style={flexboxStyles.flex1}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={handleOnRefresh}
          tintColor={colors.primaryIconColor}
          progressBackgroundColor={colors.primaryIconColor}
          enabled={!bluetoothRefreshing}
        />
      }
    >
      {content}
    </Wrapper>
  ) : (
    content
  )
}

export default HardwareWalletScanDevices
