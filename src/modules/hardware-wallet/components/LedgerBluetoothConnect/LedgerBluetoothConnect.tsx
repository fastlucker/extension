import React from 'react'
import { ActivityIndicator, RefreshControl, View } from 'react-native'

import { useTranslation } from '@config/localization'
import DevicesList from '@modules/auth/components/DeviceList'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import useToast from '@modules/common/hooks/useToast'
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
  const { addToast } = useToast()

  const {
    devices: bluetoothDevices,
    refreshing: bluetoothRefreshing,
    isBluetoothPoweredOn,
    reload: bluetoothReload
  } = useLedgerConnect(shouldScan)

  const handleOnRefresh = () => {
    if (!isBluetoothPoweredOn) {
      return addToast(t('Please turn on the Bluetooth first.') as string, { error: true })
    }

    return bluetoothReload()
  }

  const content = (
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
        devices={bluetoothDevices}
        refreshing={bluetoothRefreshing}
        onSelectDevice={onSelectDevice}
        onRefresh={handleOnRefresh}
      />
    </>
  )

  return shouldWrap ? (
    <Wrapper
      contentContainerStyle={spacings.pt0}
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

export default LedgerBluetoothConnect
