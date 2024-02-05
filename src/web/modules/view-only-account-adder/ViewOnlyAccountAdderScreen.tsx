import { ethers } from 'ethers'
import React, { useCallback, useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Pressable, View } from 'react-native'

import { isValidAddress } from '@ambire-common/services/address'
import DeleteIcon from '@common/assets/svg/DeleteIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import Header from '@common/modules/header/components/Header'
import { ROUTES, WEB_ROUTES } from '@common/modules/router/constants/common'
import { fetchCaught } from '@common/services/fetch'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { RELAYER_URL } from '@env'
import { TabLayoutContainer, TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

const getDuplicateAccountIndexes = (accounts: { address: string }[]) => {
  const accountAddresses = accounts.map((account) => account.address.toLowerCase())

  const duplicates: number[] = []

  accountAddresses.forEach((address, index) => {
    if (address.trim() === '') return

    if (accountAddresses.indexOf(address.toLowerCase()) !== index && !duplicates.includes(index)) {
      duplicates.push(index, accountAddresses.indexOf(address.toLowerCase()))
    }
  })
  return duplicates
}

const ViewOnlyScreen = () => {
  const { navigate } = useNavigation()
  const { dispatch } = useBackgroundService()
  const mainControllerState = useMainControllerState()
  const settingsControllerState = useSettingsControllerState()
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { theme } = useTheme()
  const {
    control,
    watch,
    handleSubmit,
    formState: { isValid, errors, isSubmitting }
  } = useForm({
    mode: 'all',
    defaultValues: {
      accounts: [{ address: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'accounts'
  })

  const accounts = watch('accounts')

  const duplicateAccountsIndexes = getDuplicateAccountIndexes(accounts)

  const handleFormSubmit = useCallback(async () => {
    const accountsToAddPromises = accounts.map(async (account) => {
      // Use `fetchCaught` because the endpoint could return 404 if the account
      // is not found, which should not throw an error
      const accountIdentityResponse = await fetchCaught(
        `${RELAYER_URL}/v2/identity/${account.address}`
      )

      // Trick to determine if there is an error throw. When the request 404s,
      // there is no error message incoming, which is enough to treat it as a
      // no-error, 404 response is expected for EOAs.
      if (accountIdentityResponse?.errMsg) throw new Error(accountIdentityResponse.errMsg)

      const accountIdentity: any = accountIdentityResponse?.body
      let creation = null
      let associatedKeys = [account.address]
      if (
        typeof accountIdentity === 'object' &&
        accountIdentity !== null &&
        'identityFactoryAddr' in accountIdentity &&
        typeof accountIdentity.identityFactoryAddr === 'string' &&
        'bytecode' in accountIdentity &&
        typeof accountIdentity.bytecode === 'string' &&
        'salt' in accountIdentity &&
        typeof accountIdentity.salt === 'string'
      ) {
        creation = {
          factoryAddr: accountIdentity.identityFactoryAddr,
          bytecode: accountIdentity.bytecode,
          salt: accountIdentity.salt
        }
      }

      if (accountIdentity?.associatedKeys) {
        associatedKeys = Object.keys(accountIdentity?.associatedKeys || {})
      }

      return {
        addr: ethers.getAddress(account.address),
        associatedKeys,
        initialPrivileges: accountIdentity?.initialPrivileges || [],
        creation
      }
    })

    try {
      const accountsToAdd = await Promise.all(accountsToAddPromises)

      return await dispatch({
        type: 'MAIN_CONTROLLER_ADD_VIEW_ONLY_ACCOUNTS',
        params: { accounts: accountsToAdd }
      })
    } catch (e: any) {
      addToast(
        t(
          `Import unsuccessful. We were unable to fetch the necessary data.${
            e?.message ? ` Error: ${e?.message}` : ''
          }`
        ),
        { type: 'error' }
      )

      throw e
    }
  }, [accounts, addToast, dispatch, t])

  useEffect(() => {
    // Prevents navigating when user is in the middle of adding accounts,
    // user adds account that is not valid and clicks "+ add one more address".
    // This use effect gets triggered, because the `accounts` change.
    if (!isValid) return
    if (duplicateAccountsIndexes.length > 0) return

    const newAccountsAddresses = accounts.map((x) => x.address.toLowerCase())
    const newAccountsAdded = mainControllerState.accounts.filter((account) =>
      newAccountsAddresses.includes(account.addr.toLowerCase())
    )
    const newAccountsDefaultPreferencesImported = Object.keys(
      settingsControllerState.accountPreferences
    ).some((accountAddr) => newAccountsAddresses.includes(accountAddr.toLowerCase()))

    // Navigate when the new accounts and their default preferences are imported,
    // indicating the final step for the view-only account adding flow completes.
    if (newAccountsAdded.length && newAccountsDefaultPreferencesImported) {
      navigate(WEB_ROUTES.accountPersonalize, {
        state: { accounts: newAccountsAdded }
      })
    }
  }, [
    accounts,
    dispatch,
    duplicateAccountsIndexes.length,
    isValid,
    mainControllerState.accounts,
    navigate,
    settingsControllerState.accountPreferences
  ])

  const disabled = !isValid || isSubmitting || duplicateAccountsIndexes.length > 0

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      width="md"
      header={<Header withAmbireLogo />}
      footer={
        <>
          <BackButton fallbackBackRoute={ROUTES.getStarted} />
          <Button
            textStyle={{ fontSize: 14 }}
            size="large"
            disabled={disabled}
            hasBottomSpacing={false}
            text={isSubmitting ? t('Importing...') : t('Import')}
            onPress={handleSubmit(handleFormSubmit)}
          >
            <View style={spacings.pl}>
              <RightArrowIcon color={colors.titan} />
            </View>
          </Button>
        </>
      }
    >
      <TabLayoutWrapperMainContent>
        <Panel title={t('Import A Wallet In View-Only Mode')}>
          {fields.map((field, index) => (
            <Controller
              key={field.id}
              control={control}
              rules={{
                validate: (value) => {
                  if (!value) return 'Please fill in an address.'
                  if (!isValidAddress(value)) return 'Please fill in a valid address.'
                  if (
                    mainControllerState.accounts.find(
                      (account) => account.addr.toLowerCase() === value.toLocaleLowerCase()
                    )
                  )
                    return 'This address is already in your wallet.'
                  return true
                },
                required: true
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[spacings.mbTy, flexbox.directionRow, flexbox.alignCenter]}>
                  <Input
                    testID='view-only-address-field'
                    containerStyle={{ ...spacings.mb0, ...flexbox.flex1 }}
                    onBlur={onBlur}
                    placeholder={t('View-Only Accounts')}
                    onChangeText={onChange}
                    value={value}
                    autoFocus
                    disabled={isSubmitting}
                    isValid={!errors?.accounts?.[index]?.address?.message && value !== ''}
                    validLabel={t('Address is valid.')}
                    error={
                      errors?.accounts?.[index]?.address?.message ||
                      (duplicateAccountsIndexes.includes(index) ? 'Duplicate address' : '')
                    }
                    onSubmitEditing={disabled ? undefined : handleSubmit(handleFormSubmit)}
                    button={index !== 0 ? <DeleteIcon /> : null}
                    buttonProps={{
                      onPress: () => remove(index)
                    }}
                  />
                </View>
              )}
              name={`accounts.${index}.address`}
            />
          ))}
          <View>
            <Pressable
              disabled={isSubmitting}
              onPress={() => append({ address: '' })}
              style={spacings.ptTy}
            >
              <Text fontSize={14} underline>
                {t('+ Add one more address')}
              </Text>
            </Pressable>
          </View>
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(ViewOnlyScreen)
