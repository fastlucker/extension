import React, { useCallback, useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Pressable, TouchableOpacity, View } from 'react-native'

import { isValidAddress } from '@ambire-common/services/address'
import CloseIcon from '@common/assets/svg/CloseIcon'
import InfoIcon from '@common/assets/svg/InfoIcon'
import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import { fetchCaught } from '@common/services/fetch'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { delayPromise } from '@common/utils/promises'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent,
  TabLayoutWrapperSideContent,
  TabLayoutWrapperSideContentItem
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
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
  const { theme } = useTheme()
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
      type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_ADD_ACCOUNTS',
      params: { accounts: accountsToAdd }
    })
  }, [accounts, dispatch])

  useEffect(() => {
    if (accountAdderState.addAccountsStatus === 'SUCCESS') {
      const selectedAccount = accountAdderState.readyToAddAccounts[0]
      dispatch({
        type: 'MAIN_CONTROLLER_SELECT_ACCOUNT',
        params: { accountAddr: selectedAccount.addr }
      }).then(() => {
        navigate(WEB_ROUTES.accountPersonalize, {
          state: {
            accounts: accountAdderState.readyToAddAccounts
          }
        })
      })
    }
  }, [
    accountAdderState.addAccountsStatus,
    accountAdderState.readyToAddAccounts,
    dispatch,
    navigate
  ])

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={<Header withAmbireLogo />}
      footer={
        <>
          <BackButton />
          <Button
            textStyle={{ fontSize: 14 }}
            disabled={!isValid || isLoading || duplicateAccountsIndexes.length > 0}
            hasBottomSpacing={false}
            text={isLoading ? t('Loading...') : t('Import View-Only Accounts')}
            onPress={handleFormSubmit}
          >
            <View style={spacings.pl}>
              <RightArrowIcon color={colors.titan} />
            </View>
          </Button>
        </>
      }
    >
      <TabLayoutWrapperMainContent>
        <Panel title={t('View-Only Accounts')}>
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
                <View style={[spacings.mbTy, flexbox.directionRow, flexbox.alignCenter]}>
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
                    <Pressable style={[spacings.ml]} onPress={() => remove(index)}>
                      <CloseIcon color={colors.martinique} />
                    </Pressable>
                  )}
                </View>
              )}
              name={`accounts.${index}.address`}
            />
          ))}
          <View>
            <Pressable onPress={() => append({ address: '' })} style={spacings.ptTy}>
              <Text fontSize={14} underline>
                {t('+ Add one more address')}
              </Text>
            </Pressable>
          </View>
        </Panel>
      </TabLayoutWrapperMainContent>
      <TabLayoutWrapperSideContent>
        <TabLayoutWrapperSideContentItem>
          <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbSm]}>
            <InfoIcon color={theme.infoText} style={spacings.mrTy} />
            <Text fontSize={20} appearance="infoText" weight="medium">
              {t('Importing  view-only accounts')}
            </Text>
          </View>
          <Text fontSize={16} appearance="infoText">
            Importing accounts in view-only mode allows you to import any address on any of our
            supported networks, and just observe it's balances or connect to dApps with it. Of
            course, you cannot sign any transactions or messages, or authorize with this account in
            any form. This is possible due to the public nature of the Web3 itself.
          </Text>
        </TabLayoutWrapperSideContentItem>
      </TabLayoutWrapperSideContent>
    </TabLayoutContainer>
  )
}

export default ViewOnlyScreen
