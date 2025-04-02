import React, { useMemo, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import AmbireLogo from '@common/assets/svg/AmbireLogo'
import BottomSheet from '@common/components/BottomSheet'
import Checkbox from '@common/components/Checkbox'
import DualChoiceModal from '@common/components/DualChoiceModal'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import { Trans, useTranslation } from '@common/config/localization'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useOnboardingNavigation from '@common/modules/auth/hooks/useOnboardingNavigation'
import Header from '@common/modules/header/components/Header'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import KeyStoreSetupForm from '@web/modules/keystore/components/KeyStoreSetupForm'
import TermsComponent from '@web/modules/terms/components'

export const CARD_WIDTH = 400

const KeyStoreSetupScreen = () => {
  const { params } = useRoute()
  const hideBack = useMemo(() => params?.state?.hideBack || [], [params])
  const { t } = useTranslation()

  const { goToNextRoute, goToPrevRoute } = useOnboardingNavigation()
  const { theme } = useTheme()
  const [agreedWithTerms, setAgreedWithTerms] = useState(true)
  const { ref: termsModalRef, open: openTermsModal, close: closeTermsModal } = useModalize()

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={<Header withAmbireLogo />}
    >
      <TabLayoutWrapperMainContent>
        <Panel
          spacingsSize="small"
          withBackButton={!hideBack}
          onBackButtonPress={goToPrevRoute}
          style={{
            width: CARD_WIDTH,
            alignSelf: 'center',
            ...common.shadowTertiary
          }}
          title={t('Set a Device Password')}
        >
          <KeyStoreSetupForm onContinue={() => goToNextRoute()}>
            <Checkbox
              value={agreedWithTerms}
              onValueChange={setAgreedWithTerms}
              uncheckedBorderColor={theme.primaryText}
              label={
                <Trans>
                  <Text fontSize={14}>I agree to the </Text>
                  <TouchableOpacity onPress={() => openTermsModal()}>
                    <Text fontSize={14} underline color={theme.infoDecorative}>
                      Terms of Service
                    </Text>
                  </TouchableOpacity>
                  .
                </Trans>
              }
            />
          </KeyStoreSetupForm>
        </Panel>
      </TabLayoutWrapperMainContent>
      <BottomSheet
        id="terms-modal"
        style={{ maxWidth: 800 }}
        closeBottomSheet={closeTermsModal}
        backgroundColor="primaryBackground"
        sheetRef={termsModalRef}
      >
        <View style={[flexbox.alignCenter, flexbox.justifyCenter]}>
          <AmbireLogo style={[spacings.mbLg, flexbox.alignCenter]} width={185} height={92} />
          <Text fontSize={32} weight="regular" style={[{ textAlign: 'center' }, spacings.mbXl]}>
            {t('Terms Of Service')}
          </Text>
        </View>
        <DualChoiceModal
          hideHeader
          description={<TermsComponent />}
          primaryButtonText={t('Ok')}
          onPrimaryButtonPress={closeTermsModal}
        />
      </BottomSheet>
    </TabLayoutContainer>
  )
}

export default KeyStoreSetupScreen
