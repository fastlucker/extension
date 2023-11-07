import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'

import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import useNavigation from '@common/hooks/useNavigation'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import Text from '../Text'

interface Props {
  onPress?: () => void
}

const BackButton: FC<Props> = ({ onPress }) => {
  const { t } = useTranslation()
  const { goBack } = useNavigation()

  return (
    <TouchableOpacity
      style={[flexbox.directionRow, flexbox.alignCenter, spacings.mr2Xl]}
      onPress={() => {
        if (onPress) {
          onPress()
          return
        }

        goBack()
      }}
    >
      <LeftArrowIcon />
      <Text style={spacings.plTy} fontSize={16} weight="medium" appearance="secondaryText">
        {t('Back')}
      </Text>
    </TouchableOpacity>
  )
}

export default BackButton
