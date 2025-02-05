import { wordlists } from 'bip39'
import { Mnemonic } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Pressable, View } from 'react-native'

import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Alert from '@common/components/Alert'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import InputPassword from '@common/components/InputPassword'
import Panel from '@common/components/Panel'
import Select from '@common/components/Select'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import useWindowSize from '@common/hooks/useWindowSize'
import useStepper from '@common/modules/auth/hooks/useStepper'
import Header from '@common/modules/header/components/Header'
import { ROUTES, WEB_ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings, { SPACING_MI } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { openInTab } from '@web/extension-services/background/webapi/tab'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import Stepper from '@web/modules/router/components/Stepper'

import getStyles from './styles'

const arrayWithEmptyString = (length: number) => new Array(length).fill({ value: '' })

const DEFAULT_SEED_LENGTH = 12

const SEED_LENGTH_SELECT_OPTIONS = [
  {
    label: 'I have 12-word phrase',
    value: `${12}.${false}`
  },
  {
    label: 'I have 12-word phrase with Passphrase',
    value: `${12}.${true}`
  },
  {
    label: 'I have 15-word phrase',
    value: `${15}.${false}`
  },
  {
    label: 'I have 15-word phrase with Passphrase',
    value: `${15}.${true}`
  },
  {
    label: 'I have 18-word phrase',
    value: `${18}.${false}`
  },
  {
    label: 'I have 18-word phrase with Passphrase',
    value: `${18}.${true}`
  },
  {
    label: 'I have 21-word phrase',
    value: `${21}.${false}`
  },
  {
    label: 'I have 21-word phrase with Passphrase',
    value: `${21}.${true}`
  },
  {
    label: 'I have 24-word phrase',
    value: `${24}.${false}`
  },
  {
    label: 'I have 24-word phrase with Passphrase',
    value: `${24}.${true}`
  }
]

const getPropsFromValue = (
  value: string
): {
  length: number
  withPassphrase: boolean
} => {
  const props = value.split('.')

  return {
    length: Number(props[0]),
    withPassphrase: props[1] === 'true'
  }
}

const SeedPhraseImportScreen = () => {
  const { updateStepperState } = useStepper()
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { navigate } = useNavigation()
  const { theme, styles } = useTheme(getStyles)
  const { dispatch } = useBackgroundService()
  const accountAdderCtrlState = useAccountAdderControllerState()
  const keystoreState = useKeystoreControllerState()
  const {
    watch,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { isValid, errors }
  } = useForm({
    mode: 'all',
    defaultValues: {
      seedFields: arrayWithEmptyString(DEFAULT_SEED_LENGTH),
      seedLength: SEED_LENGTH_SELECT_OPTIONS[0],
      passphrase: ''
    }
  })
  const { maxWidthSize } = useWindowSize()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'seedFields'
  })
  const [enablePassphrase, setEnablePassphrase] = useState(false)
  const [seedPhraseStatus, setSeedPhraseStatus] = useState<'incomplete' | 'valid' | 'invalid'>(
    'incomplete'
  )

  useEffect(() => {
    updateStepperState(
      WEB_ROUTES.importSeedPhrase,
      keystoreState.hasKeystoreSavedSeed ? 'seed' : 'seed-with-option-to-save'
    )
  }, [updateStepperState, keystoreState.hasKeystoreSavedSeed])

  useEffect(() => {
    const { unsubscribe } = watch((value) => {
      const formattedSeed = value.seedFields?.map((field) => field.value?.trim()).join(' ') || ''

      // Some fields are empty
      if (!value.seedLength) {
        setSeedPhraseStatus('incomplete')
        return
      }

      if (
        value.seedFields?.filter((field) => field.value).length !==
        getPropsFromValue(value.seedLength!.value!).length
      ) {
        setSeedPhraseStatus('incomplete')
        return
      }

      // Invalid seed phrase
      if (!Mnemonic.isValidMnemonic(formattedSeed)) {
        setSeedPhraseStatus('invalid')
        return
      }

      setSeedPhraseStatus('valid')
    })
    return () => unsubscribe()
  }, [watch, t])

  useEffect(() => {
    if (
      accountAdderCtrlState.isInitialized &&
      // The AccountAdder could have been already initialized with the same or a
      // different type. Navigate immediately only if the types match.
      accountAdderCtrlState.type === 'internal' &&
      accountAdderCtrlState.subType === 'seed'
    ) {
      navigate(WEB_ROUTES.accountAdder)
    }
  }, [
    accountAdderCtrlState.isInitialized,
    accountAdderCtrlState.subType,
    accountAdderCtrlState.type,
    navigate
  ])

  const handleFormSubmit = useCallback(async () => {
    await handleSubmit(({ seedFields, passphrase }) => {
      const formattedSeed = seedFields.map((field) => field.value).join(' ')
      dispatch({
        type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_PRIVATE_KEY_OR_SEED_PHRASE',
        params: {
          privKeyOrSeed: formattedSeed,
          seedPassphrase: passphrase || null,
          shouldAddToTemp: !keystoreState.hasKeystoreSavedSeed
        }
      })
    })()
  }, [dispatch, handleSubmit, keystoreState.hasKeystoreSavedSeed])

  const updateFieldsLength = useCallback(
    (value: string) => {
      const { length, withPassphrase } = getPropsFromValue(value)
      const currentLength = fields.length
      const lengthDifference = currentLength - length

      setEnablePassphrase(withPassphrase)

      if (lengthDifference === 0) return

      if (lengthDifference > 0) {
        for (let i = 0; i < lengthDifference; i++) {
          remove(currentLength - 1 - i)
        }
      } else {
        append(arrayWithEmptyString(Math.abs(lengthDifference)))
      }
    },
    [append, fields.length, remove]
  )

  const handlePaste = useCallback(
    (text: string) => {
      const separators = /[\s,;\n]+/
      const words = text.trim().split(separators)

      if (words.length === fields.length) {
        // Wait for the input to register (react-hook-form)
        setTimeout(() => {
          words.forEach((word, wordIndex) => {
            setValue(`seedFields.${wordIndex}.value`, word, {
              shouldDirty: true,
              shouldValidate: true,
              shouldTouch: true
            })
          })
        }, 1)
        addToast(t('Seed phrase successfully pasted from clipboard'))
        return
      }

      const correspondingLengthOption = SEED_LENGTH_SELECT_OPTIONS.find(
        (option) =>
          getPropsFromValue(option.value).length === words.length &&
          getPropsFromValue(option.value).withPassphrase === enablePassphrase
      )

      if (correspondingLengthOption) {
        setValue('seedLength', correspondingLengthOption)
        updateFieldsLength(correspondingLengthOption.value)

        // Wait for the input to register (react-hook-form)
        setTimeout(() => {
          words.forEach((word, wordIndex) => {
            setValue(`seedFields.${wordIndex}.value`, word, {
              shouldDirty: true,
              shouldValidate: true,
              shouldTouch: true
            })
          })
        }, 1)

        addToast(
          t('Updated Seed Length to {{seedLength}} in order to match clipboard content', {
            seedLength: words.length
          })
        )
        return
      }

      // The user may want to paste the words one by one
      if (words.length === 1) return

      addToast(t('Invalid seed phrase'), {
        type: 'error'
      })
    },
    [fields, enablePassphrase, setValue, addToast, updateFieldsLength, t]
  )

  const validateSeedPhraseWord = useCallback(
    (value: string) => {
      const couldValueBeAPastedSeed = value.split(' ').length > 1

      // If the value contains multiple words, it could be a pasted seed phrase
      // Don't display errors in this case, otherwise an error flashes when pasting
      if (!value || couldValueBeAPastedSeed) return undefined
      if (!wordlists.english.includes(value)) return t('invalid-bip39-word')
      return undefined
    },
    [t]
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
        <>
          <BackButton fallbackBackRoute={ROUTES.dashboard} />
          <Button
            testID="import-button"
            accessibilityRole="button"
            text={t('Import')}
            size="large"
            hasBottomSpacing={false}
            disabled={!isValid || seedPhraseStatus !== 'valid'}
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
        <Panel>
          <View style={[spacings.mbMd, flexbox.directionRow, flexbox.justifySpaceBetween]}>
            <View style={spacings.ptTy}>
              <Text
                fontSize={maxWidthSize('xl') ? 20 : 18}
                weight="medium"
                appearance="primaryText"
                numberOfLines={1}
                style={spacings.mrTy}
              >
                {t('Enter your seed phrase')}
              </Text>
            </View>
            <Controller
              name="seedLength"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  testID="select-seed-phrase-length"
                  setValue={(e) => {
                    updateFieldsLength(e.value as string)
                    onChange(e)
                  }}
                  options={SEED_LENGTH_SELECT_OPTIONS}
                  selectStyle={{ height: 40 }}
                  value={value}
                  containerStyle={{ width: 340 }}
                />
              )}
            />
          </View>
          <Alert
            style={spacings.mbLg}
            type="info"
            title={t(
              'Type in the words individually or paste the entire seed phrase (if separated by spaces) into any field.'
            )}
          />
          <View style={[flexbox.directionRow, flexbox.wrap, { marginBottom: -SPACING_MI }]}>
            {fields.map((field, index) => (
              <View
                key={field.id}
                style={[
                  flexbox.directionRow,
                  (index + 1) % 4 !== 0 ? spacings.pr : {},
                  spacings.mbTy,
                  { width: '25%' }
                ]}
              >
                <Text fontSize={14} weight="medium" style={[{ marginTop: 10, width: 24 }]}>
                  {index + 1}.
                </Text>
                <View
                  style={[
                    flexbox.flex1,
                    {
                      height: 64
                    }
                  ]}
                >
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                      validate: validateSeedPhraseWord
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        testID={`seed-phrase-field-${index + 1}`}
                        value={value}
                        editable
                        numberOfLines={1}
                        inputWrapperStyle={{ height: 40 }}
                        inputStyle={{ height: 38 }}
                        placeholder={t('Word {{index}}', { index: index + 1 })}
                        containerStyle={spacings.mb0}
                        placeholderTextColor={theme.secondaryText}
                        // @ts-ignore
                        isValid={errors.seedFields?.[index] ? false : undefined}
                        // any type, because nativeEvent?.inputType is web only
                        onChange={(e: any) => {
                          if (!isWeb) return onChange(e)
                          const prevValue = getValues(`seedFields.${index}.value`)
                          const newValueWithoutPrevValue = e.nativeEvent.text.replace(prevValue, '')

                          if (e.nativeEvent?.inputType === 'insertFromPaste') {
                            handlePaste(newValueWithoutPrevValue)
                          }
                          onChange(e)
                        }}
                        onSubmitEditing={handleFormSubmit}
                        onBlur={onBlur}
                      />
                    )}
                    name={`seedFields.${index}.value`}
                  />
                  {/* @ts-ignore */}
                  {errors.seedFields?.[index]?.value?.message === 'invalid-bip39-word' && (
                    <Text fontSize={10} appearance="errorText" style={styles.errorText}>
                      {t('Invalid ')}
                      <Pressable
                        onPress={() =>
                          openInTab(
                            'https://raw.githubusercontent.com/bitcoin/bips/refs/heads/master/bip-0039/english.txt',
                            false
                          )
                        }
                      >
                        <Text
                          fontSize={10}
                          appearance="errorText"
                          style={{
                            textDecorationLine: 'underline'
                          }}
                          weight="medium"
                        >
                          {t('BIP39')}
                        </Text>
                      </Pressable>
                      {t(' word')}
                    </Text>
                  )}
                </View>
              </View>
            ))}
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
                    containerStyle={{ ...spacings.mlMi, flex: 0.5 }}
                  />
                )}
                name="passphrase"
              />
            </View>
          )}

          {seedPhraseStatus === 'invalid' ? (
            <Alert
              type="error"
              title={t('Invalid Seed Phrase. Please review every field carefully.')}
            />
          ) : null}
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(SeedPhraseImportScreen)
