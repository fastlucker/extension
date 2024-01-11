import { Mnemonic } from 'ethers'
import * as Clipboard from 'expo-clipboard'
import React, { useCallback, useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { View } from 'react-native'

import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Alert from '@common/components/Alert'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import Panel from '@common/components/Panel'
import Select from '@common/components/Select'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import useStepper from '@common/modules/auth/hooks/useStepper'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings, { IS_SCREEN_SIZE_DESKTOP_LARGE } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent,
  TabLayoutWrapperSideContent,
  TabLayoutWrapperSideContentItem
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
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
  const {
    watch,
    control,
    handleSubmit,
    clearErrors,
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'seedFields'
  })

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
          message: 'Invalid Seed Phrase. Please review every field carefully.'
        })
        return
      }

      clearErrors('seedFields')
    })
    return () => unsubscribe()
  }, [watch, setError, clearErrors])

  const handleFormSubmit = useCallback(async () => {
    await handleSubmit(({ seedFields }) => {
      const formattedSeed = seedFields.map((field) => field.value).join(' ')

      navigate(WEB_ROUTES.accountAdder, {
        state: {
          keyType: 'internal',
          privKeyOrSeed: formattedSeed
        }
      })
    })()
  }, [handleSubmit, navigate])

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
    async (e: any, index: number) => {
      if (index !== 0) return

      if (e.key === 'v' && e.ctrlKey) {
        try {
          const clipboardContent = await Clipboard.getStringAsync()
          const separators = /[\s,;\n]+/
          const words = clipboardContent.trim().split(separators)

          if (words.length === fields.length) {
            words.forEach((word, wordIndex) => {
              setValue(`seedFields.${wordIndex}.value`, word)
            })
            addToast('Seed Phrase successfully pasted from clipboard')
            return
          }

          const correspondingLengthOption = SEED_LENGTH_SELECT_OPTIONS.find(
            (option) => option.value === words.length
          )

          if (correspondingLengthOption) {
            setValue('seedLength', correspondingLengthOption)
            updateFieldsLength(correspondingLengthOption.value)

            words.forEach((word, wordIndex) => {
              setValue(`seedFields.${wordIndex}.value`, word)
            })

            addToast(`Updated Seed Length to ${words.length} in order to match clipboard content`)
            return
          }

          // The user may want to paste the words one by one
          if (words.length === 1) return

          addToast('Invalid Seed Phrase', {
            type: 'error'
          })
        } catch (err: any) {
          // console.log(err?.message)
          if (err?.message === 'User denied permission to access clipboard') {
            addToast('Clipboard access denied. Cannot fill Seed Phrase from contents.', {
              type: 'error'
            })
            // Clear the field
            setValue(`seedFields.${index}.value`, '')
          }
        }
      }
    },
    [fields, setValue, addToast, updateFieldsLength]
  )

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={
        <Header mode="custom-inner-content" withAmbireLogo>
          <Stepper />
        </Header>
      }
      footer={
        <>
          <BackButton />
          <Button
            text={t('Import')}
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
            <Text
              fontSize={IS_SCREEN_SIZE_DESKTOP_LARGE ? 20 : 18}
              weight="medium"
              appearance="primaryText"
              numberOfLines={1}
              style={spacings.mrTy}
            >
              {t('Enter your Seed Phrase')}
            </Text>
            <Controller
              name="seedLength"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  setValue={(e) => {
                    updateFieldsLength(e.value)
                    onChange(e)
                  }}
                  options={SEED_LENGTH_SELECT_OPTIONS}
                  value={value}
                />
              )}
            />
          </View>
          <Alert
            style={spacings.mbLg}
            type="info"
            title="You can paste your entire Seed Phrase in the first field"
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
                  key={field.id}
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      value={value}
                      editable
                      numberOfLines={1}
                      placeholder={t('Word {{index}}', { index: index + 1 })}
                      containerStyle={[spacings.mb0, flexbox.flex1]}
                      placeholderTextColor={theme.secondaryText}
                      onChangeText={(e) => {
                        onChange(e)
                      }}
                      onKeyPress={(e) => handlePaste(e, index)}
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
      <TabLayoutWrapperSideContent>
        <TabLayoutWrapperSideContentItem title="TODO">
          <TabLayoutWrapperSideContentItem.Text>
            For each legacy account you import, you also have the option to import a smart account,
            powered by the same private key. This smart account will have a different address. Smart
            accounts have many benefits, including account recovery, transaction batching and much
            more.
          </TabLayoutWrapperSideContentItem.Text>
        </TabLayoutWrapperSideContentItem>
      </TabLayoutWrapperSideContent>
    </TabLayoutContainer>
  )
}

export default SeedPhraseImportScreen
