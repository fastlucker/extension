import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Trans } from 'react-i18next'
import { Keyboard, View } from 'react-native'

import { EmailVaultState } from '@ambire-common/controllers/emailVault/emailVault'
import { Account } from '@ambire-common/interfaces/account'
import { EmailVaultAccountInfo } from '@ambire-common/interfaces/emailVault'
import { isEmail } from '@ambire-common/services/validations'
import Button from '@common/components/Button'
import Checkbox from '@common/components/Checkbox'
import Input from '@common/components/Input'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import EmailAnimation from '@common/modules/auth/components/EmailAnimation'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import alert from '@common/services/alert'
import colors from '@common/styles/colors'
import spacings, { SPACING_MD } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import { delayPromise } from '@common/utils/promises'
import styles from '@web/components/TabLayoutWrapper/styles'
import {
  TabLayoutWrapperMainContent,
  TabLayoutWrapperSideContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useEmailVaultControllerState from '@web/hooks/useEmailVaultControllerState'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import { getDefaultSelectedAccount } from '@web/modules/account-adder/helpers/account'

const EmailVaultScreen = () => {
  const emailVaultState = useEmailVaultControllerState()
  const accountAdderState = useAccountAdderControllerState()
  const { updateStepperState } = useStepper()
  const { params } = useRoute()
  const { hideStepper, hideFormTitle }: any = params
  const { t } = useTranslation()
  const [enableKeyRecovery, onEnableKeyRecoveryChange] = useState(false)
  const { navigate } = useNavigation()
  const keystoreState = useKeystoreControllerState()

  console.log('emailVaultState', emailVaultState)
  const { dispatch } = useBackgroundService()
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      email: ''
    }
  })

  const email = watch('email')

  useEffect(() => {
    if (
      ['uploadKeyStoreSecret', 'getEmailVaultInfo'].includes(
        emailVaultState.latestMethodCall as string
      ) &&
      emailVaultState.latestMethodStatus === 'DONE'
    ) {
      const hasAccountsAddedToEmailVault = Object.keys(
        emailVaultState?.emailVaultStates?.email?.[email]?.availableAccounts || {}
      ).length
      if (hasAccountsAddedToEmailVault) {
        const emailVaultAccounts: { [addr: string]: EmailVaultAccountInfo } =
          emailVaultState?.emailVaultStates?.email?.[email]?.availableAccounts

        const accountsToAdd: Account[] = Object.keys(emailVaultAccounts).map((addr) => {
          const accountData = emailVaultAccounts.addr
          return {
            addr: accountData.addr,
            label: '',
            pfp: '',
            associatedKeys: [], // TODO: ?
            initialPrivileges: [], // TODO: ?
            creation: accountData.creation
          }
        })
        dispatch({
          type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_ADD_EXISTING_EMAIL_ACCOUNTS',
          params: {
            accounts: accountsToAdd
          }
        })
      } else {
        dispatch({
          type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_CREATE_AND_ADD_EMAIL_ACCOUNT',
          params: {
            email,
            recoveryKey: emailVaultState?.emailVaultStates?.email?.[email]?.recoveryKey
          }
        })
      }
    }
  }, [emailVaultState, email, dispatch])

  useEffect(() => {
    if (accountAdderState.addAccountsStatus === 'SUCCESS') {
      const defaultSelectedAccount = getDefaultSelectedAccount(accountAdderState.readyToAddAccounts)
      if (!defaultSelectedAccount) {
        // TODO: display error toast instead
        // eslint-disable-next-line no-alert
        alert(
          'Failed to select default account. Please try to start the process of selecting accounts again. If the problem persist, please contact support.'
        )
        return
      }

      dispatch({
        type: 'MAIN_CONTROLLER_SELECT_ACCOUNT',
        params: { accountAddr: defaultSelectedAccount.addr }
      })
    }
  }, [accountAdderState.addAccountsStatus, accountAdderState.readyToAddAccounts, dispatch])

  const completeStep = useCallback(
    (hasAccountsToImport: boolean = true) => {
      navigate(hasAccountsToImport ? WEB_ROUTES.accountPersonalize : '/')
    },
    [navigate]
  )

  useEffect(() => {
    if (keystoreState.status === 'DONE' && keystoreState.latestMethodCall === 'addKeys') {
      completeStep()
    }
  }, [completeStep, keystoreState])

  const handleFormSubmit = useCallback(() => {
    !isWeb && Keyboard.dismiss()
    handleSubmit(async () => {
      // wait state update before Wallet calcs because
      // when Wallet method is called on devices with slow CPU the UI freezes
      await delayPromise(100)

      if (emailVaultState?.emailVaultStates?.email?.[email]) {
        alert('')
        return
      }

      if (enableKeyRecovery) {
        dispatch({ type: 'EMAIL_VAULT_CONTROLLER_UPLOAD_KEYSTORE_SECRET', params: { email } })
      } else {
        dispatch({ type: 'EMAIL_VAULT_CONTROLLER_GET_INFO', params: { email } })
      }
    })()
  }, [emailVaultState?.emailVaultStates?.email, enableKeyRecovery, handleSubmit, dispatch, email])

  const isWaitingEmailConfirmation = useMemo(
    () => emailVaultState.currentState === EmailVaultState.WaitingEmailConfirmation,
    [emailVaultState.currentState]
  )

  useEffect(() => {
    // If we are showing email confirmation the step should be email-confirmation
    if (!isWaitingEmailConfirmation) {
      updateStepperState(WEB_ROUTES.emailVault, 'email')
    } else {
      updateStepperState('email-confirmation', 'email')
    }
  }, [updateStepperState, isWaitingEmailConfirmation])

  return (
    <>
      <TabLayoutWrapperMainContent
        pageTitle={
          !isWaitingEmailConfirmation
            ? 'Create Or Enter Email Vault'
            : 'Email Confirmation Required'
        }
        hideStepper={hideStepper}
      >
        <View style={[styles.mainContentWrapper, hideFormTitle && { ...spacings.mt }]}>
          {!hideFormTitle && (
            <Text
              weight="medium"
              fontSize={16}
              color={colors.martinique}
              style={[spacings.mbLg, text.center]}
            >
              {t(
                !isWaitingEmailConfirmation
                  ? 'Create Or Enter Email Vault'
                  : 'Email Confirmation Required'
              )}
            </Text>
          )}
          <>
            {isWaitingEmailConfirmation ? (
              <>
                <EmailAnimation />
                <Text
                  fontSize={14}
                  weight="regular"
                  style={[text.center, { marginBottom: SPACING_MD * 2 }]}
                >
                  {t(
                    'We sent an email to {{email}}, please check your inbox and click Authorize New Device.',
                    { email: 'email@gmail.com' }
                  )}
                </Text>
              </>
            ) : (
              ''
            )}
            {!isWaitingEmailConfirmation ? (
              <>
                <Controller
                  control={control}
                  rules={{
                    validate: isEmail || !emailVaultState?.emailVaultStates?.email?.[email]
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label={t('Please insert your email')}
                      onBlur={onBlur}
                      placeholder={t('Email Address')}
                      onChangeText={onChange}
                      onSubmitEditing={handleFormSubmit}
                      value={value}
                      autoFocus={isWeb}
                      isValid={isEmail(value) && !emailVaultState?.emailVaultStates?.email?.[email]}
                      error={
                        (!!errors.email && (t('Please fill in a valid email.') as string)) ||
                        (!!emailVaultState?.emailVaultStates?.email?.[email] &&
                          (t('You are already logged into a vault with this email.') as string))
                      }
                    />
                  )}
                  name="email"
                />
                <Checkbox
                  value={enableKeyRecovery}
                  onValueChange={() => onEnableKeyRecoveryChange((prev) => !prev)}
                  label={
                    <Trans>
                      <Text>
                        <Text fontSize={12} weight="regular">
                          Enable
                        </Text>
                        <Text fontSize={12} weight="semiBold">
                          {' local '}
                        </Text>
                        <Text fontSize={12} weight="regular">
                          key store recovery with email
                        </Text>
                      </Text>
                    </Trans>
                  }
                />

                <Button
                  textStyle={{ fontSize: 14 }}
                  disabled={
                    emailVaultState.currentState === EmailVaultState.Loading ||
                    isSubmitting ||
                    !email ||
                    !!emailVaultState?.emailVaultStates?.email?.[email]
                  }
                  type="primary"
                  text={
                    // eslint-disable-next-line no-nested-ternary
                    isSubmitting || emailVaultState.currentState === EmailVaultState.Loading
                      ? t('Loading...')
                      : t('Continue')
                  }
                  onPress={handleFormSubmit}
                />
              </>
            ) : (
              <Text
                fontSize={14}
                style={{ ...flexbox.alignSelfCenter, marginBottom: 60 }}
                color={colors.violet}
              >
                {t('Waiting Email Confirmation')}
              </Text>
            )}
          </>
        </View>
      </TabLayoutWrapperMainContent>
      {!isWaitingEmailConfirmation && (
        <TabLayoutWrapperSideContent backgroundType="beta">
          <Text weight="medium" style={spacings.mb} color={colors.zircon} fontSize={16}>
            {t('Email Vaults')}
          </Text>
          <Text
            shouldScale={false}
            weight="regular"
            style={spacings.mbTy}
            color={colors.zircon}
            fontSize={14}
          >
            {t(
              "Email vaults are stored in the cloud, on Ambire's infrastructure and they are used for recovery of smart accounts, recovery of your extension passphrase, as well as optionally backing up your keys."
            )}
          </Text>
        </TabLayoutWrapperSideContent>
      )}
    </>
  )
}

export default EmailVaultScreen
