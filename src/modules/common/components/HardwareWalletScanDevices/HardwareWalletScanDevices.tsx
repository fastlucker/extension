import React from 'react'
import { ActivityIndicator, RefreshControl, View } from 'react-native'

import { useTranslation } from '@config/localization'
import DevicesList from '@modules/auth/components/DeviceList'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper, { WRAPPER_TYPES } from '@modules/common/components/Wrapper'
import useToast from '@modules/common/hooks/useToast'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

interface Props {
  onSelectDevice: (deviceId: any) => any
  shouldWrap?: boolean

  // Props coming from the useLedgerConnect hook
  devices: any[]
  refreshing: boolean
  isBluetoothPoweredOn: boolean
  reload: () => Promise<void>
}

const HardwareWalletScanDevices = ({
  onSelectDevice,
  devices,
  refreshing,
  isBluetoothPoweredOn,
  reload,
  shouldWrap = true
}: Props) => {
  const { t } = useTranslation()
  const { addToast } = useToast()

  const handleOnRefresh = () => {
    if (!isBluetoothPoweredOn) {
      return addToast(t('Please turn on the Bluetooth first.') as string, { error: true })
    }

    return reload()
  }

  return (
    <Wrapper
      type={shouldWrap ? WRAPPER_TYPES.SCROLL_VIEW : WRAPPER_TYPES.VIEW}
      style={!shouldWrap && flexboxStyles.flex1}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={handleOnRefresh}
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
          {t('Available devices')}
        </Title>
        {!!refreshing && <ActivityIndicator color={colors.primaryIconColor} />}
      </View>
      <DevicesList
        devices={devices}
        refreshing={refreshing}
        onSelectDevice={onSelectDevice}
        onRefresh={handleOnRefresh}
      />
    </Wrapper>
  )
}

export default HardwareWalletScanDevices
