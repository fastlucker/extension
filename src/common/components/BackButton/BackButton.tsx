import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import Button from '@common/components/Button'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'

interface Props {
  onPress?: () => void
  fallbackBackRoute?: string
}

const BackButton: FC<Props> = ({ onPress, fallbackBackRoute }) => {
  const { t } = useTranslation()
  const { goBack, canGoBack, navigate } = useNavigation()
  const { theme } = useTheme()

  return (
    <Button
      childrenPosition="left"
      size="large"
      hasBottomSpacing={false}
      type="secondary"
      onPress={() => {
        if (onPress) {
          onPress()
          return
        }

        if (!canGoBack && fallbackBackRoute) {
          navigate(fallbackBackRoute)
          return
        }

        goBack()
      }}
      text={t('Back')}
    >
      <LeftArrowIcon color={theme.primary} style={spacings.mrTy} />
    </Button>
  )
}

export default BackButton
