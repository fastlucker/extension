import React, { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { isValidPrivateKey } from '@ambire-common/libs/keyIterator/keyIterator'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import Panel from '@common/components/Panel'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useStepper from '@common/modules/auth/hooks/useStepper'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent,
  TabLayoutWrapperSideContent,
  TabLayoutWrapperSideContentItem
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import Stepper from '@web/modules/router/components/Stepper'

const PrivateKeyImportScreen = () => {
  const { updateStepperState } = useStepper()
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
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { theme } = useTheme()

  useEffect(() => {
    updateStepperState(WEB_ROUTES.importPrivateKey, 'private-key')
  }, [updateStepperState])

  const handleFormSubmit = useCallback(async () => {
    await handleSubmit(({ privateKey }) => {
      let formattedPrivateKey = privateKey.trim()

      formattedPrivateKey = privateKey.slice(0, 2) === '0x' ? privateKey.slice(2) : privateKey

      navigate(WEB_ROUTES.accountAdder, {
        state: {
          keyType: 'internal',
          privKeyOrSeed: formattedPrivateKey
        }
      })
    })()
  }, [handleSubmit, navigate])

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
      header={
        <Header mode="custom-inner-content" withAmbireLogo>
          <Stepper />
        </Header>
      }
      footer={
        <>
          <BackButton />
          <Button
            style={{ minWidth: 180 }}
            text={t('Import')}
            hasBottomSpacing={false}
            onPress={handleFormSubmit}
            disabled={!isValid}
          >
            <View style={spacings.pl}>
              <RightArrowIcon color={colors.titan} />
            </View>
          </Button>
        </>
      }
    >
      <TabLayoutWrapperMainContent>
        <Panel title={t('Import your Private Key')}>
          <Controller
            control={control}
            rules={{ validate: (value) => handleValidation(value), required: true }}
            name="privateKey"
            render={({ field: { onChange, onBlur, value } }) => {
              return (
                <Input
                  value={value}
                  editable
                  autoFocus
                  containerStyle={spacings.mb0}
                  placeholder={t('Enter a seed phrase or private key')}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  isValid={!handleValidation(value) && !!value.length}
                  error={errors?.privateKey?.message || ' '}
                  placeholderTextColor={theme.secondaryText}
                  onSubmitEditing={handleFormSubmit}
                />
              )
            }}
          />
        </Panel>
      </TabLayoutWrapperMainContent>
      <TabLayoutWrapperSideContent>
        <TabLayoutWrapperSideContentItem title="Importing legacy accounts">
          <TabLayoutWrapperSideContentItem.Text>
            By inserting a private key or a seed phrase, you can import traditional legacy accounts
            (also known as EOAs - externally owned accounts).
          </TabLayoutWrapperSideContentItem.Text>
          <TabLayoutWrapperSideContentItem.Text>
            If you enter a seed phrase, you will be given a list of multiple legacy accounts to
            choose from.
          </TabLayoutWrapperSideContentItem.Text>
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

export default PrivateKeyImportScreen
