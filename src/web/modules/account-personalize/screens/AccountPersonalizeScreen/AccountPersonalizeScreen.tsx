import React, { useCallback, useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { ScrollView, View } from 'react-native'

import { Account } from '@ambire-common/interfaces/account'
import { AccountPreferences } from '@ambire-common/interfaces/settings'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Alert from '@common/components/Alert'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import useStepper from '@common/modules/auth/hooks/useStepper'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useOnEnterKeyPress from '@web/hooks/useOnEnterKeyPress'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import AccountPersonalizeCard from '@web/modules/account-personalize/components/AccountPersonalizeCard'
import { AccountPersonalizeFormValues } from '@web/modules/account-personalize/components/AccountPersonalizeCard/AccountPersonalizeCard'
import Stepper from '@web/modules/router/components/Stepper'

const AccountPersonalizeScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { stepperState, updateStepperState } = useStepper()
  const { params } = useRoute()
  const { theme } = useTheme()
  const settingsCtrl = useSettingsControllerState()
  const { dispatch } = useBackgroundService()
  const newAccounts: Account[] = params?.accounts || []
  const { maxWidthSize } = useWindowSize()
  const { handleSubmit, control, watch } = useForm<AccountPersonalizeFormValues>({
    defaultValues: {
      preferences: newAccounts.map((acc) => ({
        account: acc,
        label: settingsCtrl.accountPreferences[acc.addr].label,
        pfp: settingsCtrl.accountPreferences[acc.addr].pfp
      }))
    }
  })
  const { fields } = useFieldArray({
    control,
    name: 'preferences'
  })
  const watchPreferences = watch('preferences')

  useEffect(() => {
    if (!newAccounts.length) {
      navigate('/')
    }
  }, [navigate, newAccounts.length])

  useEffect(() => {
    if (!stepperState?.currentFlow) return

    updateStepperState(WEB_ROUTES.accountPersonalize, stepperState.currentFlow)
  }, [stepperState?.currentFlow, updateStepperState])

  const handleSave = useCallback(
    (data: AccountPersonalizeFormValues) => {
      const newAccPreferences: AccountPreferences = {}

      data.preferences.forEach(({ account, label, pfp }) => {
        newAccPreferences[account.addr] = {
          label: label || settingsCtrl.accountPreferences[account.addr].label,
          pfp
        }
      })

      dispatch({
        type: 'SETTINGS_CONTROLLER_ADD_ACCOUNT_PREFERENCES',
        params: newAccPreferences
      })

      navigate('/', { state: { openOnboardingCompleted: true } })
    },
    [navigate, dispatch, settingsCtrl.accountPreferences]
  )

  useOnEnterKeyPress({ action: handleSubmit(handleSave) })

  return (
    <TabLayoutContainer
      width="md"
      backgroundColor={theme.secondaryBackground}
      header={
        <Header mode="custom-inner-content" withAmbireLogo>
          <Stepper />
        </Header>
      }
      footer={
        <View style={[flexbox.flex1, flexbox.alignEnd]}>
          <Button
            testID="button-save-and-continue"
            size="large"
            onPress={handleSubmit(handleSave)}
            hasBottomSpacing={false}
            text={t('Save and Continue')}
          >
            <View style={spacings.pl}>
              <RightArrowIcon color={colors.titan} />
            </View>
          </Button>
        </View>
      }
    >
      <TabLayoutWrapperMainContent>
        <Panel style={{ maxHeight: '100%' }}>
          <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbMd, { height: 40 }]}>
            <Text
              fontSize={maxWidthSize('xl') ? 20 : 18}
              weight="medium"
              appearance="primaryText"
              numberOfLines={1}
              style={[spacings.mrTy, flexbox.flex1]}
            >
              {t('Personalize your accounts')}
            </Text>

            <Alert type="success" size="sm" style={{ ...spacings.pvTy, ...flexbox.alignCenter }}>
              <Text fontSize={16} appearance="successText">
                {newAccounts.length === 1
                  ? t('Successfully added {{numOfAccounts}} account', {
                      numOfAccounts: newAccounts.length
                    })
                  : t('Successfully added {{numOfAccounts}} accounts', {
                      numOfAccounts: newAccounts.length
                    })}
              </Text>
            </Alert>
          </View>
          <ScrollView>
            {fields.map((field, index) => (
              <AccountPersonalizeCard
                key={field.id} // important to include key with field's id
                control={control}
                index={index}
                account={field.account}
                pfp={watchPreferences[index].pfp}
                hasBottomSpacing={index !== fields.length - 1}
              />
            ))}
          </ScrollView>
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(AccountPersonalizeScreen)
