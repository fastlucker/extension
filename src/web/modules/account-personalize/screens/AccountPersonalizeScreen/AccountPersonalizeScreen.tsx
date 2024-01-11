import React, { useCallback, useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { Account } from '@ambire-common/interfaces/account'
import { Key } from '@ambire-common/interfaces/keystore'
import { AccountPreferences } from '@ambire-common/interfaces/settings'
import { isSmartAccount } from '@ambire-common/libs/account/account'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import Wrapper from '@common/components/Wrapper'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useStepper from '@common/modules/auth/hooks/useStepper'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent,
  TabLayoutWrapperSideContent,
  TabLayoutWrapperSideContentItem
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import AccountPersonalizeCard from '@web/modules/account-personalize/components/AccountPersonalizeCard'
import { AccountPersonalizeFormValues } from '@web/modules/account-personalize/components/AccountPersonalizeCard/AccountPersonalizeCard'
import {
  getDefaultAccountLabel,
  getDefaultAccountPfp
} from '@web/modules/account-personalize/libs/defaults'
import Stepper from '@web/modules/router/components/Stepper'

const AccountPersonalizeScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { stepperState, updateStepperState } = useStepper()
  const { params } = useRoute()
  const { theme } = useTheme()
  const mainCtrl = useMainControllerState()
  const { dispatch } = useBackgroundService()
  const newAccounts: Account[] = params?.accounts || []
  const keyType: Key['type'] = params?.keyType || ''
  const keyTypeInternalSubtype: 'seed' | 'private-key' = params?.keyTypeInternalSubtype || ''
  const prevAccountsCount = mainCtrl.accounts.length - newAccounts.length
  const { handleSubmit, control, watch } = useForm<AccountPersonalizeFormValues>({
    defaultValues: {
      preferences: newAccounts.map((acc, i) => ({
        account: acc,
        label: getDefaultAccountLabel(acc, prevAccountsCount, i, keyType, keyTypeInternalSubtype),
        pfp: getDefaultAccountPfp(prevAccountsCount, i)
      }))
    }
  })
  const { fields } = useFieldArray({ control, name: 'preferences' })
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
        newAccPreferences[account.addr] = { label, pfp }
      })

      dispatch({
        type: 'MAIN_CONTROLLER_SETTINGS_ADD_ACCOUNT_PREFERENCES',
        params: newAccPreferences
      })

      navigate('/')
    },
    [navigate, dispatch]
  )

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={
        <Header mode="custom-inner-content" withAmbireLogo>
          <Stepper />
        </Header>
      }
      footer={
        <>
          <BackButton />
          <Button
            onPress={handleSubmit(handleSave)}
            hasBottomSpacing={false}
            text={t('Save and Continue')}
          >
            <View style={spacings.pl}>
              <RightArrowIcon color={colors.titan} />
            </View>
          </Button>
        </>
      }
    >
      <TabLayoutWrapperMainContent>
        <Panel title={t('Personalize Your Accounts')} style={{ maxHeight: '100%' }}>
          <Wrapper style={spacings.mb0} contentContainerStyle={[spacings.pl0, spacings.pt0]}>
            {fields.map((field, index) => (
              <AccountPersonalizeCard
                key={field.id} // important to include key with field's id
                control={control}
                index={index}
                isSmartAccount={isSmartAccount(field.account)}
                pfp={watchPreferences[index].pfp}
                address={field.account.addr}
                hasBottomSpacing={index !== fields.length - 1}
              />
            ))}
          </Wrapper>
        </Panel>
      </TabLayoutWrapperMainContent>
      <TabLayoutWrapperSideContent>
        <TabLayoutWrapperSideContentItem title="Account personalization">
          <TabLayoutWrapperSideContentItem.Text noMb>
            Account personalization allows you to assign a label and avatar to any accounts
            you&apos;ve chosen to import. Both options are stored locally on your device and serve
            only to help you organize your accounts. None of these options are uploaded to the
            blockchain or anywhere else.
          </TabLayoutWrapperSideContentItem.Text>
        </TabLayoutWrapperSideContentItem>
      </TabLayoutWrapperSideContent>
    </TabLayoutContainer>
  )
}

export default React.memo(AccountPersonalizeScreen)
