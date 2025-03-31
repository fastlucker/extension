import React, { useCallback, useEffect, useMemo } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { ScrollView, View } from 'react-native'

import { Account } from '@ambire-common/interfaces/account'
import CheckIcon from '@common/assets/svg/CheckIcon'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
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
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import AccountPersonalizeCard from '@web/modules/account-personalize/components/AccountPersonalizeCard'

export const CARD_WIDTH = 400

const AccountPersonalizeScreen = () => {
  const { t } = useTranslation()
  const { goToNextRoute } = useOnboardingNavigation()
  const { theme } = useTheme()
  const { dispatch } = useBackgroundService()

  const accountsState = useAccountsControllerState()
  const accountAdderState = useAccountAdderControllerState()

  const newAccounts: Account[] = useMemo(
    () => accountsState.accounts.filter((a) => a.newlyAdded),
    [accountsState.accounts]
  )

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: { accounts: newAccounts }
  })

  useEffect(() => {
    setValue('accounts', newAccounts)
  }, [newAccounts, setValue])

  const { fields } = useFieldArray({ control, name: 'accounts' })

  const handleSave = useCallback(
    (data: { accounts: Account[] }) => {
      dispatch({
        type: 'ACCOUNTS_CONTROLLER_UPDATE_ACCOUNT_PREFERENCES',
        params: data.accounts.map((a) => ({ addr: a.addr, preferences: a.preferences }))
      })

      goToNextRoute()
    },
    [goToNextRoute, dispatch]
  )

  return (
    <TabLayoutContainer
      width="md"
      backgroundColor={theme.secondaryBackground}
      header={<Header withAmbireLogo />}
    >
      <TabLayoutWrapperMainContent>
        <Panel
          spacingsSize="small"
          style={{
            width: CARD_WIDTH,
            alignSelf: 'center',
            ...common.shadowTertiary
          }}
        >
          <View style={[flexbox.alignCenter, spacings.mbXl]}>
            <View
              style={{
                width: 64,
                height: 64,
                backgroundColor: '#01864926',
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                ...spacings.mb
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: theme.successDecorative,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CheckIcon color={theme.successDecorative} width={28} height={28} />
              </View>
            </View>
            <Text weight="semiBold" fontSize={20}>
              {t('Added Successfully')}
            </Text>
            {/* <Alert type="success" size="sm" style={{ ...spacings.pvTy, ...flexbox.alignCenter }}>
              <Text fontSize={16} appearance="successText">
                {newAccounts.length === 1
                  ? t('Successfully added {{numOfAccounts}} account', {
                      numOfAccounts: newAccounts.length
                    })
                  : t('Successfully added {{numOfAccounts}} accounts', {
                      numOfAccounts: newAccounts.length
                    })}
              </Text>
            </Alert> */}
          </View>
          <ScrollView style={spacings.mbLg}>
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
          <Button
            testID="button-save-and-continue"
            size="large"
            onPress={handleSubmit(handleSave)}
            hasBottomSpacing={false}
            text={t('Get Started')}
          />
          {accountAdderState.subType === 'seed' && (
            <View style={spacings.ptLg}>
              <Button
                type="ghost"
                text={t('Add more accounts from this Recovery Phrase')}
                onPress={() => goToNextRoute(WEB_ROUTES.accountAdder)}
                textStyle={{ fontSize: 14, color: theme.primary, letterSpacing: -0.1 }}
                style={{ ...spacings.ph0, height: 22 }}
                hasBottomSpacing={false}
                childrenPosition="left"
              >
                <Text fontSize={24} weight="light" style={spacings.mrTy} color={theme.primary}>
                  +
                </Text>
              </Button>
            </View>
          )}
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(AccountPersonalizeScreen)
