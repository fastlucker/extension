import React, { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { isValidPrivateKey } from '@ambire-common/libs/keyIterator/keyIterator'
import Alert from '@common/components/Alert'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import TextArea from '@common/components/TextArea'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import useOnboardingNavigation from '@common/modules/auth/hooks/useOnboardingNavigation'
import Header from '@common/modules/header/components/Header'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'

export const CARD_WIDTH = 400

const PrivateKeyImportScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    mode: 'all',
    defaultValues: {
      privateKey: ''
    }
  })
  const { goToPrevRoute, goToNextRoute } = useOnboardingNavigation()
  const { t } = useTranslation()

  const { theme } = useTheme()
  const { dispatch } = useBackgroundService()

  const handleFormSubmit = useCallback(async () => {
    await handleSubmit(({ privateKey }) => {
      const trimmedPrivateKey = privateKey.trim()
      const noPrefixPrivateKey =
        trimmedPrivateKey.slice(0, 2) === '0x' ? trimmedPrivateKey.slice(2) : trimmedPrivateKey

      dispatch({
        type: 'ADD_NEXT_ACCOUNT_FROM_SEED_OR_PRIVATE_KEY',
        params: { privKeyOrSeed: noPrefixPrivateKey }
      })
      goToNextRoute()
    })()
  }, [dispatch, handleSubmit, goToNextRoute])

  const handleValidation = (value: string) => {
    const trimmedValue = value.trim()

    if (!trimmedValue.length) return t('Field is required.')

    if (!isValidPrivateKey(trimmedValue)) {
      return t('Invalid private key.')
    }

    return undefined
  }

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={<Header withAmbireLogo />}
    >
      <TabLayoutWrapperMainContent>
        <Panel
          spacingsSize="small"
          withBackButton
          onBackButtonPress={goToPrevRoute}
          style={{
            width: CARD_WIDTH,
            alignSelf: 'center',
            ...common.shadowTertiary
          }}
          title={t('Enter Private Key')}
        >
          <View style={spacings.mbMd}>
            <Controller
              control={control}
              rules={{ validate: (value) => handleValidation(value), required: true }}
              name="privateKey"
              render={({ field: { onChange, onBlur, value } }) => {
                return (
                  <TextArea
                    testID="enter-seed-phrase-field"
                    value={value}
                    editable
                    multiline
                    numberOfLines={3}
                    autoFocus
                    containerStyle={spacings.mb0}
                    placeholder={t('Write or paste your Private Key')}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    isValid={!handleValidation(value) && !!value.length}
                    error={value.length ? errors?.privateKey?.message : ''}
                    placeholderTextColor={theme.secondaryText}
                    onSubmitEditing={handleFormSubmit}
                  />
                )
              }}
            />
          </View>
          <Alert
            title="Basic Accounts (EOAs) only"
            text="You can import only EOAs with private keys. To import Smart Accounts, use a seed phrase or hardware wallet."
            type="warning"
            size="sm"
            style={spacings.mbMd}
          />

          <Button
            testID="import-button"
            size="large"
            text={t('Confirm')}
            hasBottomSpacing={false}
            onPress={handleFormSubmit}
            disabled={!isValid}
          />
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default PrivateKeyImportScreen
