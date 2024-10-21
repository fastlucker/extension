import { Mnemonic } from 'ethers'
import React, { useCallback, useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import ImportAccountsFromSeedPhraseIcon from '@common/assets/svg/ImportAccountsFromSeedPhraseIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Alert from '@common/components/Alert'
import BackButton from '@common/components/BackButton'
import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import DualChoiceModal from '@common/components/DualChoiceModal'
import Input from '@common/components/Input'
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
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import Stepper from '@web/modules/router/components/Stepper'

const arrayWithEmptyString = (length: number) => new Array(length).fill({ value: '' })

const DEFAULT_SEED_LENGTH = 12

const SEED_LENGTH_SELECT_OPTIONS = [
  {
    label: '12-word Seed Phrase',
    value: 12
  },
  {
    label: '15-word Seed Phrase',
    value: 15
  },
  {
    label: '18-word Seed Phrase',
    value: 18
  },
  {
    label: '21-word Seed Phrase',
    value: 21
  },
  {
    label: '24-word Seed Phrase',
    value: 24
  }
]

const SeedPhraseImportScreen = () => {
  const { updateStepperState } = useStepper()
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { navigate } = useNavigation()
  const { theme } = useTheme()
  const { dispatch } = useBackgroundService()
  const accountAdderCtrlState = useAccountAdderControllerState()
  const keystoreState = useKeystoreControllerState()
  const {
    watch,
    control,
    handleSubmit,
    clearErrors,
    getValues,
    setError,
    setValue,
    formState: { isValid, errors }
  } = useForm({
    mode: 'all',
    defaultValues: {
      seedFields: arrayWithEmptyString(DEFAULT_SEED_LENGTH),
      seedLength: SEED_LENGTH_SELECT_OPTIONS[0]
    }
  })
  const { maxWidthSize } = useWindowSize()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'seedFields'
  })

  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

  const seedPhrase =
    watch('seedFields')
      ?.map((field) => field.value?.trim())
      .join(' ') || ''

  useEffect(() => {
    updateStepperState(WEB_ROUTES.importSeedPhrase, 'seed')
  }, [updateStepperState])

  useEffect(() => {
    const { unsubscribe } = watch((value) => {
      const formattedSeed = value.seedFields?.map((field) => field.value?.trim()).join(' ') || ''

      // Some fields are empty
      if (value.seedFields?.filter((field) => field.value).length !== value.seedLength?.value)
        return

      // Invalid seed phrase
      if (!Mnemonic.isValidMnemonic(formattedSeed)) {
        setError('seedFields', {
          type: 'custom',
          message: t('Invalid Seed Phrase. Please review every field carefully.')
        })
        return
      }

      clearErrors('seedFields')
    })
    return () => unsubscribe()
  }, [watch, setError, clearErrors, t])

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
    await handleSubmit(({ seedFields }) => {
      const formattedSeed = seedFields.map((field) => field.value).join(' ')

      if (!keystoreState.hasKeystoreSavedSeed) {
        openBottomSheet()
      } else {
        dispatch({
          type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_PRIVATE_KEY_OR_SEED_PHRASE',
          params: { privKeyOrSeed: formattedSeed }
        })
      }
    })()
  }, [dispatch, handleSubmit, keystoreState.hasKeystoreSavedSeed, openBottomSheet])

  const handleSaveSeedAndProceed = useCallback(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_PRIVATE_KEY_OR_SEED_PHRASE',
      params: { privKeyOrSeed: seedPhrase, shouldPersist: true }
    })
  }, [dispatch, seedPhrase])

  const handleDoNotSaveSeedAndProceed = useCallback(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_PRIVATE_KEY_OR_SEED_PHRASE',
      params: { privKeyOrSeed: seedPhrase }
    })
  }, [dispatch, seedPhrase])

  const updateFieldsLength = useCallback(
    (newLength: number) => {
      const currentLength = fields.length
      const lengthDifference = currentLength - newLength

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
        addToast(t('Seed Phrase successfully pasted from clipboard'))
        return
      }

      const correspondingLengthOption = SEED_LENGTH_SELECT_OPTIONS.find(
        (option) => option.value === words.length
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

      addToast(t('Invalid Seed Phrase'), {
        type: 'error'
      })
    },
    [fields, setValue, addToast, updateFieldsLength, t]
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
            disabled={!isValid || !!errors.seedFields?.message}
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
                {t('Enter your Seed Phrase')}
              </Text>
            </View>
            <Controller
              name="seedLength"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  testID="select-seed-phrase-length"
                  setValue={(e) => {
                    updateFieldsLength(e.value as number)
                    onChange(e)
                  }}
                  options={SEED_LENGTH_SELECT_OPTIONS}
                  selectStyle={{ height: 40 }}
                  value={value}
                  containerStyle={{ width: 240 }}
                />
              )}
            />
          </View>
          <Alert
            style={spacings.mbLg}
            type="info"
            title={t('You can paste your entire Seed Phrase in any field')}
          />
          <View style={[flexbox.directionRow, flexbox.wrap]}>
            {fields.map((field, index) => (
              <View
                key={field.id}
                style={[
                  flexbox.directionRow,
                  flexbox.alignCenter,
                  (index + 1) % 4 !== 0 ? spacings.pr : {},
                  spacings.mb,
                  { width: '25%' }
                ]}
              >
                <Text fontSize={14} weight="medium" style={[{ width: 24 }]}>
                  {index + 1}.
                </Text>
                <Controller
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      testID={`seed-phrase-field-${index + 1}`}
                      value={value}
                      editable
                      numberOfLines={1}
                      inputWrapperStyle={{ height: 40 }}
                      inputStyle={{ height: 38 }}
                      placeholder={t('Word {{index}}', { index: index + 1 })}
                      containerStyle={[spacings.mb0, flexbox.flex1]}
                      placeholderTextColor={theme.secondaryText}
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
              </View>
            ))}
          </View>
          {errors.seedFields?.message ? (
            <Alert type="error" title={errors.seedFields?.message} />
          ) : null}
        </Panel>
      </TabLayoutWrapperMainContent>
      {!keystoreState.hasKeystoreSavedSeed && (
        <BottomSheet
          id="import-seed-phrase"
          sheetRef={sheetRef}
          closeBottomSheet={closeBottomSheet}
          backgroundColor="secondaryBackground"
          style={{ overflow: 'hidden', width: 496, ...spacings.ph0, ...spacings.pv0 }}
          type="modal"
        >
          <DualChoiceModal
            title={t('Save Seed Phrase')}
            description={
              <View>
                <Text style={spacings.mbTy} appearance="secondaryText">
                  {t('Do you want to save the seed in the Ambire Wallet extension?')}
                </Text>
                <Text style={spacings.mbTy} appearance="secondaryText">
                  {t('This will allow you to easily import more accounts from this Seed Phrase.')}
                </Text>
                <Text appearance="secondaryText" weight="semiBold">
                  {t('You can save only one seed.')}
                </Text>
              </View>
            }
            Icon={ImportAccountsFromSeedPhraseIcon}
            onSecondaryButtonPress={handleDoNotSaveSeedAndProceed}
            onPrimaryButtonPress={handleSaveSeedAndProceed}
            secondaryButtonText={t('No')}
            primaryButtonText={
              keystoreState.statuses.addKeys !== 'INITIAL' ? 'Loading...' : t('Save seed')
            }
            secondaryButtonTestID="do-not-save-seed-button"
            primaryButtonTestID="save-seed-button"
          />
        </BottomSheet>
      )}
    </TabLayoutContainer>
  )
}

export default React.memo(SeedPhraseImportScreen)
