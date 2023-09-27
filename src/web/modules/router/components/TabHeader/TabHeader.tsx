import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Pressable, View, ViewStyle } from 'react-native'

import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import NavIconWrapper from '@common/components/NavIconWrapper'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useStepper from '@common/modules/auth/hooks/useStepper'
import routesConfig from '@common/modules/router/config/routesConfig'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import Stepper from '@web/modules/router/components/Stepper'

import styles from './styles'

export const HeaderLeft = ({ handleGoBack }: { handleGoBack: () => void }) => {
  const { t } = useTranslation()

  return (
    <Pressable onPress={handleGoBack} style={styles.headerLeft}>
      <NavIconWrapper onPress={handleGoBack} style={styles.navIconContainerRegular}>
        <LeftArrowIcon width={36} height={36} />
      </NavIconWrapper>
      <Text style={styles.headerLeftText} fontSize={16} weight="medium">
        {t('Back')}
      </Text>
    </Pressable>
  )
}

interface Props {
  hideStepper?: boolean
  pageTitle?: string | React.ReactNode
  forceCanGoBack?: boolean
  image?: string
  onBack?: () => void
  rightSideComponent?: React.ReactNode
  style?: ViewStyle
}

const TabHeader: React.FC<Props> = ({
  hideStepper = false,
  pageTitle = '',
  forceCanGoBack,
  image,
  onBack,
  rightSideComponent,
  style
}) => {
  const { path, params } = useRoute()
  const { stepperState } = useStepper()
  const { navigate } = useNavigation()

  const flow = stepperState?.currentFlow
  const flowStep = stepperState?.currentStep

  const handleGoBack = useCallback(
    () => (onBack ? onBack() : navigate(params?.backTo || -1)),
    [navigate, onBack, params]
  )

  // Primarily, we depend on the existence of the prevRoute to display the Back button.
  // However, there are instances when we lack a previous route (e.g., transitioning from a Popup context to a Tab).
  // To accommodate such cases and ensure button visibility, we introduce the `forceCanGoBack` flag.
  const canGoBack = forceCanGoBack || !!params?.prevRoute

  const nextRoute = path?.substring(1) as unknown as typeof ROUTES
  const { title } = routesConfig[nextRoute]

  const shouldDisplayStepper = flow && !hideStepper

  return (
    <View style={[styles.container, style]}>
      {canGoBack ? (
        <View style={styles.sideContainer}>
          <HeaderLeft handleGoBack={handleGoBack} />
        </View>
      ) : null}
      {!!shouldDisplayStepper && <Stepper step={flowStep} />}
      {!shouldDisplayStepper && (!!title || !!pageTitle) && (
        <View style={styles.content}>
          {!!image && (
            <Image style={{ width: 40, height: 40, borderRadius: 12 }} source={{ uri: image }} />
          )}
          {typeof pageTitle !== 'object' && (
            <Text
              fontSize={20}
              weight="medium"
              style={[styles.title, image ? spacings.mlSm : {}]}
              numberOfLines={2}
            >
              {pageTitle || title || ' '}
            </Text>
          )}
          {typeof pageTitle === 'object' && pageTitle}
        </View>
      )}
      <View style={[styles.sideContainer, styles.sideContainerRight]}>
        {rightSideComponent || null}
      </View>
    </View>
  )
}

export default React.memo(TabHeader)
