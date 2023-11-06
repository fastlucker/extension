import { Mnemonic } from 'ethers'
import React, { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TextInput, View } from 'react-native'

import { isValidPrivateKey } from '@ambire-common/libs/keyIterator/keyIterator'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutWrapperMainContent,
  TabLayoutWrapperSideContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'

import styles from './styles'

const DEFAULT_IMPORT_LABEL = `Imported key on ${new Date().toLocaleDateString()}`

function isValidMnemonic(input: string) {
  const separators = /[\s,;\n]+/
  const words = input.trim().split(separators)

  return Mnemonic.isValidMnemonic(words.join(' '))
}

const ExternalSignerLoginScreen = () => {
  const { updateStepperState } = useStepper()
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    mode: 'all',
    defaultValues: {
      privKeyOrSeed: '',
      label: ''
    }
  })
  const { t } = useTranslation()
  const { navigate } = useNavigation()

  useEffect(() => {
    updateStepperState(WEB_ROUTES.externalSigner, 'legacy')
  }, [updateStepperState])

  const handleFormSubmit = useCallback(() => {
    handleSubmit(({ privKeyOrSeed, label }) => {
      let formattedPrivKeyOrSeed = privKeyOrSeed.trim()

      if (isValidPrivateKey(privKeyOrSeed)) {
        formattedPrivKeyOrSeed =
          privKeyOrSeed.slice(0, 2) === '0x' ? privKeyOrSeed.slice(2) : privKeyOrSeed
      }

      navigate(WEB_ROUTES.accountAdder, {
        state: {
          keyType: 'internal',
          privKeyOrSeed: formattedPrivKeyOrSeed,
          label: label || DEFAULT_IMPORT_LABEL
        }
      })
    })()
  }, [handleSubmit, navigate])

  const handleValidation = (value: string) => {
    const trimmedValue = value.trim()

    if (!trimmedValue.length) return ''

    const separators = /[\s,;\n]+/
    const words = trimmedValue.split(separators)

    const isValidMnemonicValue = isValidMnemonic(trimmedValue)

    const allowedSeedPhraseLengths = [12, 15, 18, 21, 24]

    if (allowedSeedPhraseLengths.includes(words.length) && !isValidMnemonicValue) {
      return 'Your seed phrase length is valid, but a word is misspelled.'
    }

    if (words.length > 1 && !isValidMnemonicValue) {
      return 'A seed phrase must be 12-24 words long.'
    }

    if (
      words.length === 1 &&
      /^(0x)?[0-9a-fA-F]/.test(trimmedValue) &&
      !isValidPrivateKey(trimmedValue)
    ) {
      return 'Invalid private key.'
    }

    if (!(isValidPrivateKey(trimmedValue) || isValidMnemonic(trimmedValue))) {
      return 'Please enter a valid seed phrase or private key.'
    }
  }

  return (
    <>
      <TabLayoutWrapperMainContent>
        <View style={styles.container}>
          <Text weight="medium" fontSize={16} style={[flexbox.alignSelfCenter]}>
            {t('Import Legacy Account')}
          </Text>

          <View style={spacings.mb}>
            <Text
              style={[styles.error, { opacity: errors.privKeyOrSeed ? 1 : 0 }]}
              color={colors.radicalRed}
              fontSize={14}
            >
              {/* empty space to prevent jump */}
              {errors?.privKeyOrSeed?.message || ' '}
            </Text>
            <Controller
              control={control}
              rules={{ validate: (value) => handleValidation(value), required: true }}
              name="privKeyOrSeed"
              render={({ field: { onChange, onBlur, value } }) => {
                return (
                  <TextInput
                    value={value}
                    editable
                    autoFocus
                    multiline
                    numberOfLines={8}
                    placeholder="Enter a seed phrase or private key"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    style={styles.textarea}
                    placeholderTextColor={colors.martinique_65}
                    onSubmitEditing={handleFormSubmit}
                  />
                )
              }}
            />
          </View>

          <View style={styles.errorAndLabel}>
            <Text
              style={[spacings.plTy, spacings.mbTy]}
              shouldScale={false}
              fontSize={16}
              weight="medium"
            >
              {t('Key label')}
            </Text>
            <Text
              style={[styles.error, { opacity: errors.label ? 1 : 0, marginLeft: 10 }]}
              color={colors.radicalRed}
              fontSize={14}
            >
              {t('Key labels must be 6-24 characters long.')}
            </Text>
          </View>
          <Controller
            control={control}
            rules={{ maxLength: 24, minLength: 6 }}
            name="label"
            render={({ field: { onChange, onBlur, value } }) => {
              return (
                <TextInput
                  value={value}
                  editable
                  multiline
                  numberOfLines={1}
                  maxLength={40}
                  placeholder={DEFAULT_IMPORT_LABEL}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  style={[styles.textarea, spacings.mbLg]}
                  placeholderTextColor={colors.martinique_65}
                  onSubmitEditing={handleFormSubmit}
                />
              )
            }}
          />

          <Button
            type="primary"
            size="large"
            text="Import Legacy Account"
            style={[flexbox.alignSelfCenter]}
            onPress={handleFormSubmit}
            disabled={!isValid}
            testID='button-ext-sighner-login-screen'
          />
        </View>
      </TabLayoutWrapperMainContent>
      <TabLayoutWrapperSideContent backgroundType="beta">
        <Text weight="medium" fontSize={16} style={spacings.mb} color={colors.zircon}>
          {t('Importing legacy accounts')}
        </Text>
        <Text shouldScale={false} fontSize={14} color={colors.zircon} style={spacings.mb}>
          {t(
            'By inserting a private key or a seed phrase, you can import traditional legacy accounts (also known as EOAs - externally owned accounts).\n\nIf you enter a seed phrase, you will be given a list of multiple legacy accounts to choose from.\n\nFor each legacy account you import, you also have the option to import a smart account, powered by the same private key. This smart account will have a different address. Smart accounts have many benefits, including account recovery, transaction batching and much more.'
          )}
        </Text>

        <Text weight="medium" fontSize={16} style={spacings.mb} color={colors.zircon}>
          {t('Key Label')}
        </Text>
        <Text fontSize={14} shouldScale={false} color={colors.zircon}>
          {t('The key label is any arbitrary name you choose for this key, entirely up to you.')}
        </Text>
      </TabLayoutWrapperSideContent>
    </>
  )
}

export default ExternalSignerLoginScreen
