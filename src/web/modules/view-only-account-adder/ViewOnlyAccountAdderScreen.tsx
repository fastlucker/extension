import React, { useCallback, useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Pressable, View } from 'react-native'

import { isValidAddress } from '@ambire-common/services/address'
import CloseIcon from '@common/assets/svg/CloseIcon'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import { fetchCaught } from '@common/services/fetch'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import { delayPromise } from '@common/utils/promises'
import styles from '@web/components/TabLayoutWrapper/styles'
import { TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'

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
  const accountAdderState = useAccountAdderControllerState()
  const isLoading = accountAdderState.addAccountsStatus === 'LOADING'
  const { t } = useTranslation()
  const {
    control,
    watch,
    formState: { isValid, errors }
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

  useEffect(() => {
    if (!mainControllerState.isReady) return
    if (accountAdderState.isInitialized) return

    dispatch({
      type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_VIEW_ONLY'
    })
  }, [accountAdderState.isInitialized, dispatch, mainControllerState.isReady])

  useEffect(() => {
    return () => {
      dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_RESET' })
    }
  }, [dispatch])

  const handleFormSubmit = useCallback(async () => {
    // wait state update before Wallet calcs because
    // when Wallet method is called on devices with slow CPU the UI freezes
    await delayPromise(100)

    const accountsToAddP = accounts.map(async (account) => {
      const accountIdentityResponse = await fetchCaught(
        `https://staging-relayer.ambire.com/v2/identity/${account.address}`
      )

      const accountIdentity = accountIdentityResponse?.body

      let creation = null

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

      return {
        addr: account.address,
        label: '',
        pfp: '',
        associatedKeys: [],
        creation
      }
    })

    const accountsToAdd = await Promise.all(accountsToAddP)

    dispatch({
      type: 'MAIN_CONTROLLER_ADD_ACCOUNTS',
      params: { accounts: accountsToAdd }
    })
  }, [accounts, dispatch])

  useEffect(() => {
    const newAccountsAddresses = accounts.map((x) => x.address)
    const areNewAccountsAdded = mainControllerState.accounts.some((account) =>
      newAccountsAddresses.includes(account.addr)
    )
    if (areNewAccountsAdded) {
      dispatch({
        type: 'MAIN_CONTROLLER_SELECT_ACCOUNT',
        params: { accountAddr: newAccountsAddresses[0] }
      })

      navigate(WEB_ROUTES.accountPersonalize)
    }
  }, [accounts, dispatch, mainControllerState.accounts, navigate])

  return (
    <TabLayoutWrapperMainContent pageTitle={t('View-Only Accounts')} hideStepper>
      <View style={[styles.mainContentWrapper, { alignItems: 'center' }]}>
        {fields.map((field, index) => (
          <Controller
            key={field.id}
            control={control}
            rules={{
              validate: (value) => {
                if (!value) return 'Please fill in an address.'
                if (!isValidAddress(value)) return 'Please fill in a valid address.'
                if (mainControllerState.accounts.find((account) => account.addr === value))
                  return 'This address is already in your wallet.'
                return true
              },
              required: true
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                style={{
                  flexDirection: 'row',
                  width: 400,
                  ...spacings.mbTy
                }}
              >
                <Input
                  containerStyle={{ width: '100%', marginBottom: 0 }}
                  onBlur={onBlur}
                  placeholder={t('Enter an address')}
                  onChangeText={onChange}
                  value={value}
                  autoFocus
                  isValid={!errors?.accounts?.[index]?.address?.message && value !== ''}
                  validLabel={t('Address is valid.')}
                  error={
                    errors?.accounts?.[index]?.address?.message ||
                    (duplicateAccountsIndexes.includes(index) ? 'Duplicate address' : '')
                  }
                />
                {index !== 0 && (
                  <Pressable style={[spacings.mlMi, spacings.mtMi]} onPress={() => remove(index)}>
                    <CloseIcon color={colors.martinique} />
                  </Pressable>
                )}
              </View>
            )}
            name={`accounts.${index}.address`}
          />
        ))}
        <Pressable
          onPress={() =>
            append({
              address: ''
            })
          }
        >
          <Text
            fontSize={14}
            weight="regular"
            style={[spacings.mbXl, { borderBottomColor: colors.martinique, borderBottomWidth: 1 }]}
          >
            {t('Add one more address')}
          </Text>
        </Pressable>
        <Button
          textStyle={{ fontSize: 14 }}
          disabled={!isValid || isLoading || duplicateAccountsIndexes.length > 0}
          style={{ width: 300 }}
          type="primary"
          text={
            // eslint-disable-next-line no-nested-ternary
            isLoading ? t('Loading...') : t('Import View-Only Accounts')
          }
          onPress={handleFormSubmit}
        />
      </View>
    </TabLayoutWrapperMainContent>
  )
}

export default ViewOnlyScreen
