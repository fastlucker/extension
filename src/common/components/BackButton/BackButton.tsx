import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'

import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import Text from '../Text'

interface Props {
  onPress: () => void
}

const BackButton: FC<Props> = ({ onPress }) => {
  const { t } = useTranslation()
  return (
    <TouchableOpacity
      style={[flexbox.directionRow, flexbox.alignCenter, spacings.mr2Xl]}
      onPress={onPress}
    >
      <LeftArrowIcon />
      <Text style={spacings.plTy} fontSize={16} weight="medium" appearance="secondaryText">
        {t('Back')}
      </Text>
    </TouchableOpacity>
  )
}

export default BackButton
