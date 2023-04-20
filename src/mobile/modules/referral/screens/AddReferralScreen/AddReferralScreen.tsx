import React, { useCallback } from 'react'
import { View } from 'react-native'

import Button from '@common/components/Button'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Text from '@common/components/Text'
import Wrapper, { WRAPPER_TYPES } from '@common/components/Wrapper'
import { isWeb } from '@common/config/env'
import { Trans, useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useStorageController from '@common/hooks/useStorageController'
import AmbireLogo from '@common/modules/auth/components/AmbireLogo'
import { ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import AddReferralForm, {
  AddReferralFormValues
} from '@mobile/modules/referral/components/AddReferralForm'

const AddReferralScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { setItem } = useStorageController()

  const handleSubmit = useCallback(
    (values: AddReferralFormValues) => {
      console.log(values)

      setItem('pendingReferral', values.address)

      navigate(ROUTES.getStarted, { replace: true })
    },
    [navigate, setItem]
  )

  return (
    <GradientBackgroundWrapper>
      <Wrapper
        contentContainerStyle={spacings.pbLg}
        type={WRAPPER_TYPES.KEYBOARD_AWARE_SCROLL_VIEW}
        extraHeight={220}
      >
        <AmbireLogo />
        <View style={[isWeb && spacings.ph, flexboxStyles.flex1, flexboxStyles.justifyEnd]}>
          <View style={[spacings.mbLg, spacings.phTy]}>
            <Text weight="light" style={spacings.mbTy} color={colors.titan} fontSize={20}>
              {t('Enter Referral Address')}
            </Text>
            <Text weight="light" style={spacings.mbTy} color={colors.titan} fontSize={12}>
              {t('Who invited you to Ambire?')}
            </Text>
          </View>

          <AddReferralForm onSubmit={handleSubmit} />
        </View>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default AddReferralScreen
