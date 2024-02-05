import React from 'react'
import { View } from 'react-native'

import { ExternalKey } from '@ambire-common/interfaces/keystore'
import AmbireDevice from '@common/assets/svg/AmbireDevice'
import DriveIcon from '@common/assets/svg/DriveIcon'
import LeftPointerArrowIcon from '@common/assets/svg/LeftPointerArrowIcon'
import Button from '@common/components/Button'
import Modal from '@common/components/Modal'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import { HARDWARE_WALLET_DEVICE_NAMES } from '../../constants/names'

type Props = {
  isOpen: boolean
  keyType: ExternalKey['type']
  onClose: () => void
  onRetry: () => void
}

const HardwareWalletSigningModal = ({ isOpen, keyType, onClose, onRetry }: Props) => {
  const { t } = useTranslation()

  return (
    <Modal
      modalStyle={{ minWidth: 'auto', height: 'auto' }}
      title={t(`Sign with your ${HARDWARE_WALLET_DEVICE_NAMES[keyType]} device`)}
      isOpen={isOpen}
      onClose={onClose}
    >
      <View
        style={[flexbox.directionRow, flexbox.alignSelfCenter, flexbox.alignCenter, spacings.mv3Xl]}
      >
        <DriveIcon style={spacings.mrLg} />
        <LeftPointerArrowIcon style={spacings.mrLg} />
        <AmbireDevice />
      </View>
      <View style={[flexbox.alignSelfCenter, spacings.mb3Xl]}>
        <Text weight="regular" style={spacings.mbTy} fontSize={20}>
          {t('Sending signing request...')}
        </Text>
      </View>
      <Button text={t('Retry')} type="ghost" style={flexbox.alignSelfCenter} onPress={onRetry} />
    </Modal>
  )
}

export default HardwareWalletSigningModal
