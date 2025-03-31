import React, { useRef } from 'react'
import { View } from 'react-native'

import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import useOnboardingNavigation from '@common/modules/auth/hooks/useOnboardingNavigation'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'

import getStyles from './styles'

export const CARD_WIDTH = 400

const ImportExistingAccountSelectorScreen = () => {
  const { theme } = useTheme(getStyles)
  const { t } = useTranslation()

  const wrapperRef: any = useRef(null)

  const { goToPrevRoute, goToNextRoute } = useOnboardingNavigation()

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={<Header withAmbireLogo />}
    >
      <TabLayoutWrapperMainContent wrapperRef={wrapperRef} contentContainerStyle={spacings.mbLg}>
        <Panel
          spacingsSize="small"
          withBackButton
          onBackButtonPress={goToPrevRoute}
          title={t('Select Import Method')}
          style={{
            width: CARD_WIDTH,
            alignSelf: 'center',
            ...common.shadowTertiary
          }}
        >
          <View style={[flexbox.justifySpaceBetween]}>
            <Button
              type="primary"
              text={t('Private Key')}
              onPress={() => goToNextRoute(WEB_ROUTES.importPrivateKey)}
            />
            <Button
              type="secondary"
              text={t('Recovery Phrase')}
              onPress={() => goToNextRoute(WEB_ROUTES.importSeedPhrase)}
            />
          </View>
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(ImportExistingAccountSelectorScreen)
