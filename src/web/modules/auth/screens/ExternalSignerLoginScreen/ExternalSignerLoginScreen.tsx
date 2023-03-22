import React, { useLayoutEffect, useState } from 'react'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Segments from '@common/components/Segments'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import AmbireLogo from '@common/modules/auth/components/AmbireLogo'
import PrivateKeyForm from '@common/modules/auth/components/PrivateKeyForm'
import RecoveryPhraseForm from '@common/modules/auth/components/RecoveryPhraseForm'
import spacings from '@common/styles/spacings'
import { THEME_TYPES } from '@common/styles/themeConfig'
import flexboxStyles from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import {
  AuthLayoutWrapperMainContent,
  AuthLayoutWrapperSideContent
} from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum FORM_TYPE {
  PRIVATE_KEY = 'Private Key',
  RECOVERY_PHRASE = 'Recovery Phrase'
}

const segments = [{ value: FORM_TYPE.PRIVATE_KEY }, { value: FORM_TYPE.RECOVERY_PHRASE }]

const ExternalSignerLoginScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const [formType, setFormType] = useState<FORM_TYPE>(FORM_TYPE.PRIVATE_KEY)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle:
        formType === FORM_TYPE.RECOVERY_PHRASE
          ? t('Login with Recovery Phrase')
          : t('Login with Private Key')
    })
  }, [formType, navigation, t])

  return (
    <>
      <AuthLayoutWrapperMainContent>
        <PrivateKeyForm themeType={THEME_TYPES.LIGHT} />
        <Text themeType={THEME_TYPES.LIGHT} style={[spacings.mvLg, text.center]}>
          or
        </Text>
        <RecoveryPhraseForm themeType={THEME_TYPES.LIGHT} />
      </AuthLayoutWrapperMainContent>
      <AuthLayoutWrapperSideContent backgroundType="beta">
        <Text shouldScale={false} weight="regular" fontSize={20} style={spacings.mb}>
          Import Legacy Account
        </Text>
        <Text shouldScale={false} weight="regular" fontSize={16}>
          Import Legacy Account
        </Text>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultrices, justo a vulputate
          auctor, est leo egestas nisl, et egestas leo elit et sem. Sed mattis ipsum a ultricies
          porta. Donec efficitur lorem sed scelerisque imperdiet.
        </Text>
      </AuthLayoutWrapperSideContent>
    </>
  )
}

export default ExternalSignerLoginScreen
