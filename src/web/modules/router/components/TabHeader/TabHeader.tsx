import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import NavIconWrapper from '@common/components/NavIconWrapper'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import routesConfig from '@common/modules/router/config/routesConfig'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import Stepper from '@web/modules/router/components/Stepper'

import styles from './styles'

const TabHeader: React.FC<any> = ({ hideStepper = false, pageTitle = '' }) => {
  const { t } = useTranslation()
  const { path, params } = useRoute()
  const { navigate } = useNavigation()

  const handleGoBack = useCallback(() => navigate(-1), [navigate])

  const canGoBack = !!params?.prevRoute

  const renderHeaderLeft = () => {
    if (canGoBack) {
      return (
        <NavIconWrapper
          onPress={handleGoBack}
          style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}
        >
          <LeftArrowIcon width={36} height={36} color={colors.violet} />
          <Text fontSize={14} weight="regular" color={colors.martinique} style={spacings.ml}>
            {t('Back')}
          </Text>
        </NavIconWrapper>
      )
    }

    return null
  }

  const nextRoute = path?.substring(1) as ROUTES
  const { title, flow, flowStep } = routesConfig[nextRoute]

  const shouldDisplayStepper = flow && !hideStepper

  return (
    <View style={[styles.container, spacings.pv, spacings.ph]}>
      <View>{renderHeaderLeft()}</View>
      {!!shouldDisplayStepper && <Stepper step={flowStep} />}
      {!shouldDisplayStepper && (!!title || !!pageTitle) && (
        <Text
          fontSize={20}
          weight="medium"
          style={[styles.title, spacings.pl, canGoBack ? { paddingRight: 140 } : spacings.pr]}
          numberOfLines={2}
        >
          {title || pageTitle || ' '}
        </Text>
      )}
    </View>
  )
}

export default React.memo(TabHeader)
