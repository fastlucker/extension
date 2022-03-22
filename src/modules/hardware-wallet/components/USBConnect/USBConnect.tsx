import React from 'react'
import { ActivityIndicator, RefreshControl, View } from 'react-native'

import { useTranslation } from '@config/localization'
import DevicesList from '@modules/auth/components/DeviceList'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import useHardwareWalletHIDConnect from '@modules/hardware-wallet/hooks/useHardwareWalletHIDConnect/useHardwareWalletHIDConnect'

interface Props {
  onSelectDevice: (device: any) => any
  shouldWrap?: boolean
}

const HardwareWalletConnect = ({ onSelectDevice, shouldWrap = true }: Props) => {
  const { t } = useTranslation()

  const {
    device: usbDevice,
    reload: usbReload,
    refreshing: usbRefreshing
  } = useHardwareWalletHIDConnect()

  const handleOnRefresh = () => {
    return usbReload()
  }

  const content = (
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
        devices={usbDevice ? [usbDevice] : []}
        refreshing={usbRefreshing}
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
          enabled={!usbRefreshing}
        />
      }
    >
      {content}
    </Wrapper>
  ) : (
    content
  )
}

export default HardwareWalletConnect
