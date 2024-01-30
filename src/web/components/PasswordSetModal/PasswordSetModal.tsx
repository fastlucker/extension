import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Button from '@common/components/Button'
import Modal from '@common/components/Modal'
import Text from '@common/components/Text'
import spacings, { SPACING_3XL } from '@common/styles/spacings'

import text from '@common/styles/utils/text'
import KeyStoreLogo from '@web/modules/keystore/components/KeyStoreLogo'
import flexbox from '@common/styles/utils/flexbox'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import colors from '@common/styles/colors'

interface Props {
  isOpen: boolean
  onPress: () => void
}

const PasswordSetModal: FC<Props> = ({ isOpen, onPress }) => {
  const { t } = useTranslation()

  return (
    <Modal
      isOpen={isOpen}
      modalStyle={{ minWidth: 'unset', paddingHorizontal: SPACING_3XL * 2, ...spacings.pv4Xl }}
    >
      <Text weight="medium" fontSize={20} style={[text.center, spacings.mbXl]}>
        {t('Device Password')}
      </Text>
      <KeyStoreLogo width={112} height={112} style={[flexbox.alignSelfCenter, spacings.mbXl]} />
      <Text fontSize={16} style={[spacings.mb2Xl, text.center]}>
        {t('Your Device Password is set!')}
      </Text>
      <Button
        text={t('Continue')}
        hasBottomSpacing={false}
        style={{ minWidth: 232 }}
        onPress={onPress}
      >
        <View style={spacings.pl}>
          <RightArrowIcon color={colors.titan} />
        </View>
      </Button>
    </Modal>
  )
}

export default PasswordSetModal
