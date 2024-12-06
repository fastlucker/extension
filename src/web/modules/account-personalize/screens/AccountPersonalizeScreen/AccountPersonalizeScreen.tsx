import React, { useCallback, useEffect, useMemo } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { ScrollView, View } from 'react-native'

import { Account } from '@ambire-common/interfaces/account'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Alert from '@common/components/Alert'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
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
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import AccountPersonalizeCard from '@web/modules/account-personalize/components/AccountPersonalizeCard'
import Stepper from '@web/modules/router/components/Stepper'

const AccountPersonalizeScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { stepperState, updateStepperState } = useStepper()
  const { theme } = useTheme()
  const { dispatch } = useBackgroundService()
  const { maxWidthSize } = useWindowSize()

  const accountsState = useAccountsControllerState()

  const newAccounts: Account[] = useMemo(
    () => accountsState.accounts.filter((a) => a.newlyAdded),
    [accountsState.accounts]
  )

  const { handleSubmit, control } = useForm({
    defaultValues: { accounts: newAccounts }
  })
  const { fields } = useFieldArray({ control, name: 'accounts' })

  useEffect(() => {
    if (accountsState.accounts.length && !newAccounts.length) {
      navigate('/')
    }
  }, [accountsState.accounts.length, navigate, newAccounts.length])

  useEffect(() => {
    dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_RESET_IF_NEEDED' })
  }, [dispatch])

  useEffect(() => {
    if (!stepperState?.currentFlow) return

    updateStepperState(WEB_ROUTES.accountPersonalize, stepperState.currentFlow)
  }, [stepperState?.currentFlow, updateStepperState])

  const handleSave = useCallback(
    (data: { accounts: Account[] }) => {
      dispatch({
        type: 'ACCOUNTS_CONTROLLER_UPDATE_ACCOUNT_PREFERENCES',
        params: data.accounts.map((a) => ({ addr: a.addr, preferences: a.preferences }))
      })

      if (stepperState?.currentFlow === 'seed-with-option-to-save') {
        navigate(WEB_ROUTES.saveImportedSeed)
      } else {
        navigate('/')
      }
    },
    [navigate, dispatch, stepperState]
  )

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
              {t('Name your accounts')}
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
                account={field}
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
