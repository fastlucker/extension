import { wordlists } from 'bip39'
import { Mnemonic } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import Button from '@common/components/Button'
import InputPassword from '@common/components/InputPassword'
import Panel from '@common/components/Panel'
import TextArea from '@common/components/TextArea'
import { useTranslation } from '@common/config/localization'
import usePrevious from '@common/hooks/usePrevious'
import useTheme from '@common/hooks/useTheme'
import useOnboardingNavigation from '@common/modules/auth/hooks/useOnboardingNavigation'
import Header from '@common/modules/header/components/Header'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useAccountPickerControllerState from '@web/hooks/useAccountPickerControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'

import getStyles from './styles'

export const CARD_WIDTH = 400

const SeedPhraseImportScreen = () => {
  const { goToPrevRoute, goToNextRoute } = useOnboardingNavigation()
  const { t } = useTranslation()

  const { theme, styles } = useTheme(getStyles)
  const { dispatch } = useBackgroundService()
  const { isInitialized, subType } = useAccountPickerControllerState()
  const prevIsInitialized = usePrevious(isInitialized)
  const {
    watch,
    control,
    handleSubmit,
    getValues,
    formState: { isValid }
  } = useForm({
    mode: 'all',
    defaultValues: { seed: '', passphrase: '' }
  })

  const [enablePassphrase, setEnablePassphrase] = useState(false)
  const [seedPhraseStatus, setSeedPhraseStatus] = useState<'incomplete' | 'valid' | 'invalid'>(
    'incomplete'
  )

  useEffect(() => {
    const { unsubscribe } = watch((value) => {
      if (!value.seed) {
        setSeedPhraseStatus('incomplete')
        return
      }

      const formattedSeed = value.seed.trim().split(/\s+/).join(' ')

      if (!Mnemonic.isValidMnemonic(formattedSeed)) {
        setSeedPhraseStatus('invalid')
        return
      }

      setSeedPhraseStatus('valid')
    })
    return () => unsubscribe()
  }, [watch, t])

  const handleFormSubmit = useCallback(async () => {
    await handleSubmit(({ seed, passphrase }) => {
      const formattedSeed = seed.trim().split(/\s+/).join(' ')

      dispatch({
        type: 'MAIN_CONTROLLER_ACCOUNT_PICKER_INIT_PRIVATE_KEY_OR_SEED_PHRASE',
        params: { privKeyOrSeed: formattedSeed, seedPassphrase: passphrase || null }
      })
    })()
  }, [dispatch, handleSubmit])

  useEffect(() => {
    if (!getValues('seed')) return
    if (!prevIsInitialized && isInitialized && subType === 'seed') {
      dispatch({ type: 'ACCOUNT_PICKER_CONTROLLER_ADD_NEXT_ACCOUNT' })
      goToNextRoute()
    }
  }, [goToNextRoute, dispatch, getValues, isInitialized, prevIsInitialized, subType])

  const validateSeedPhraseWord = useCallback(
    (value: string) => {
      const formattedSeed = value.trim().split(/\s+/).join(' ')

      const couldValueBeAPastedSeed = formattedSeed.length > 1

      // If the value contains multiple words, it could be a pasted seed phrase
      // Don't display errors in this case, otherwise an error flashes when pasting
      if (!formattedSeed || couldValueBeAPastedSeed) return undefined
      if (!wordlists.english.includes(value)) return t('invalid-bip39-word')
      return undefined
    },
    [t]
  )

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
          title={t('Import Recovery Phrase')}
        >
          <View style={spacings.mbMd}>
            <Controller
              control={control}
              rules={{
                required: true,
                validate: validateSeedPhraseWord
              }}
              name="seed"
              render={({ field: { onChange, onBlur, value } }) => {
                return (
                  <TextArea
                    testID="enter-seed-phrase-field"
                    value={value}
                    editable
                    multiline
                    numberOfLines={4}
                    autoFocus
                    containerStyle={spacings.mb0}
                    placeholder={t('Write or paste your Recovery Phrase')}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    isValid={seedPhraseStatus === 'valid'}
                    error={seedPhraseStatus === 'invalid' && t('Invalid Recovery Phrase.')}
                    placeholderTextColor={theme.secondaryText}
                    onSubmitEditing={handleFormSubmit}
                  />
                )
              }}
            />
          </View>
          {enablePassphrase && (
            <View style={styles.passphraseContainer}>
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputPassword
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Seed Passphrase"
                    inputWrapperStyle={{ height: 40 }}
                    inputStyle={{ height: 40 }}
                    containerStyle={{ flex: 0.5 }}
                  />
                )}
                name="passphrase"
              />
            </View>
          )}

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

export default React.memo(SeedPhraseImportScreen)
