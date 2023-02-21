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
      <View style={[flexboxStyles.alignCenter, spacings.mbSm]}>
        <Text style={textStyles.center} color={colors.chetwode} fontSize={12}>
          {t('Please connect USB cable and enter the PIN code on your device.')}
        </Text>
      </View>
      <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, spacings.mbSm]}>
        {usbDevice && (
          <>
            <Text fontSize={16} weight="medium" style={flexboxStyles.flex1}>
              {t('Connected device')}
            </Text>
            {!!usbRefreshing && <Spinner />}
          </>
        )}
      </View>
      <DevicesList
        devices={usbDevice ? [usbDevice] : []}
        refreshing={usbRefreshing}
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
          onRefresh={handleOnRefresh}
          tintColor={colors.titan}
          progressBackgroundColor={colors.titan}
          enabled={!usbRefreshing}
        />
      }
    >
      {content}
    </Wrapper>
  )
}

export default HardwareWalletConnect
