import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import NavIconWrapper from '@common/components/NavIconWrapper'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import routesConfig from '@common/modules/router/config/routesConfig'
import { ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import Stepper from '@web/modules/router/components/Stepper'

import styles from './styles'

export const HeaderLeft = ({ handleGoBack }: { handleGoBack: () => void }) => {
  const { t } = useTranslation()

  return (
    <Pressable
      onPress={handleGoBack}
      style={{ ...flexboxStyles.directionRow, ...flexboxStyles.alignCenter }}
    >
      <NavIconWrapper width={40} height={40} onPress={handleGoBack}>
        <LeftArrowIcon width={40} height={40} color={colors.violet} />
      </NavIconWrapper>
      <Text fontSize={14} weight="regular" color={colors.martinique} style={spacings.mlTy}>
        {t('Back')}
      </Text>
    </Pressable>
  )
}

const TabHeader: React.FC<any> = ({
  hideStepper = false,
  pageTitle = '',
  forceCanGoBack,
  onBack
}) => {
  const { path, params } = useRoute()
  const { navigate } = useNavigation()

  const handleGoBack = useCallback(() => (onBack ? onBack() : navigate(-1)), [navigate, onBack])

  // Primarily, we depend on the existence of the prevRoute to display the Back button.
  // However, there are instances when we lack a previous route (e.g., transitioning from a Popup context to a Tab).
  // To accommodate such cases and ensure button visibility, we introduce the `forceCanGoBack` flag.
  const canGoBack = forceCanGoBack || !!params?.prevRoute
  const nextRoute = path?.substring(1) as keyof typeof ROUTES
  const { title, flow, flowStep } = routesConfig[nextRoute]

  const shouldDisplayStepper = flow && !hideStepper

  return (
    <View style={[styles.container, spacings.pv, spacings.ph]}>
      {canGoBack ? <HeaderLeft handleGoBack={handleGoBack} /> : null}
      {!!shouldDisplayStepper && <Stepper step={flowStep} />}
      {!shouldDisplayStepper && (!!title || !!pageTitle) && (
        <Text
          fontSize={20}
          weight="medium"
          style={[styles.title, spacings.pl, canGoBack ? { paddingRight: 140 } : spacings.pr]}
          numberOfLines={2}
        >
          {pageTitle || title || ' '}
        </Text>
      )}
    </View>
  )
}

export default React.memo(TabHeader)
