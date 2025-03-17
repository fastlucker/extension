import React, { useEffect, useMemo } from 'react'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { ExternalKey } from '@ambire-common/interfaces/keystore'
import AmbireDevice from '@common/assets/svg/AmbireDevice'
import DriveIcon from '@common/assets/svg/DriveIcon'
import LatticeMiniIcon from '@common/assets/svg/LatticeMiniIcon'
import LedgerMiniIcon from '@common/assets/svg/LedgerMiniIcon'
import LeftPointerArrowIcon from '@common/assets/svg/LeftPointerArrowIcon'
import TrezorMiniIcon from '@common/assets/svg/TrezorMiniIcon/TrezorMiniIcon'
import BottomSheet from '@common/components/BottomSheet'
import ModalHeader from '@common/components/BottomSheet/ModalHeader'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import { HARDWARE_WALLET_DEVICE_NAMES } from '../../constants/names'

type Props = {
  keyType: ExternalKey['type']
  isVisible: boolean
  children: React.ReactNode
}

const iconByKeyType = {
  trezor: TrezorMiniIcon,
  ledger: LedgerMiniIcon,
  lattice: LatticeMiniIcon
}

const HardwareWalletSigningModal = ({ keyType, isVisible, children }: Props) => {
  const { t } = useTranslation()
  const { ref, open, close } = useModalize()

  useEffect(() => {
    if (isVisible) open()
    else close()
  }, [open, close, isVisible])

  const titleSuffix = useMemo(() => {
    const Icon = keyType && iconByKeyType[keyType as keyof typeof iconByKeyType]
    if (!Icon) return undefined

    return <Icon />
  }, [keyType])

  return (
    <BottomSheet
      id="hardware-wallet-signing-modal"
      backgroundColor="primaryBackground"
      autoWidth
      sheetRef={ref}
      shouldBeClosableOnDrag={false}
      autoOpen={isVisible}
    >
      <ModalHeader
        title={t('Sign with your {{deviceName}} device', {
          deviceName: HARDWARE_WALLET_DEVICE_NAMES[keyType]
        })}
        titleSuffix={titleSuffix}
      />
      <View
        style={[flexbox.directionRow, flexbox.alignSelfCenter, flexbox.alignCenter, spacings.mv3Xl]}
      >
        <DriveIcon style={spacings.mrLg} />
        <View style={spacings.mrLg}>
          <LeftPointerArrowIcon color={colors.greenHaze} />
          <LeftPointerArrowIcon
            color={colors.greenHaze}
            style={[spacings.mtMi, { transform: [{ rotate: '180deg' }] }]}
          />
        </View>
        <AmbireDevice />
      </View>
      <View style={[flexbox.alignSelfCenter, spacings.mb3Xl]}>
        <Text weight="regular" style={spacings.mbTy} fontSize={20}>
          {t('Sending signing request...')}
        </Text>
        {children}
      </View>
    </BottomSheet>
  )
}

export default React.memo(HardwareWalletSigningModal)
