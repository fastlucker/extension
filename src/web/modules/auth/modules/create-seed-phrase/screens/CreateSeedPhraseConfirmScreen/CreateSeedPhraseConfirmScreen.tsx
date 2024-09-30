import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useStepper from '@common/modules/auth/hooks/useStepper'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
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
import CreateSeedPhraseSidebar from '@web/modules/auth/modules/create-seed-phrase/components/CreateSeedPhraseSidebar'
import Stepper from '@web/modules/router/components/Stepper'

const CreateSeedPhraseConfirmScreen = () => {
  const {
    state: { confirmationWords, seed, ...rest }
  } = useRoute()
  const { updateStepperState } = useStepper()
  const { dispatch } = useBackgroundService()
  const accountAdderState = useAccountAdderControllerState()

  const keystoreState = useKeystoreControllerState()
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { isValid }
  } = useForm({
    mode: 'all',
    defaultValues: {
      confirmationWords: confirmationWords.map((value: any) => ({
        ...value,
        fieldValue: ''
      }))
    }
  })

  useEffect(() => {
    updateStepperState('secure-seed', 'create-seed')
  }, [updateStepperState])

  const onSubmit = handleSubmit(() => {
    setIsLoading(true)

    const seedPhrase = seed.join(' ') || ''
    dispatch({
      type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_PRIVATE_KEY_OR_SEED_PHRASE',
      params: { privKeyOrSeed: seedPhrase, shouldPersist: !keystoreState.hasKeystoreDefaultSeed }
    })
  })

  console.log(accountAdderState)

  useEffect(() => {
    if (
      accountAdderState.isInitialized &&
      // The AccountAdder could have been already initialized with the same or a
      // different type. Navigate immediately only if the types match.
      accountAdderState.type === 'internal' &&
      accountAdderState.subType === 'seed'
    ) {
      navigate(WEB_ROUTES.accountAdder)
    }
  }, [accountAdderState.isInitialized, accountAdderState.subType, accountAdderState.type, navigate])

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
          <BackButton
            onPress={() => {
              navigate(WEB_ROUTES.createSeedPhraseWrite, {
                state: {
                  confirmationWords,
                  seed,
                  ...rest
                }
              })
            }}
          />
          <Button
            accessibilityRole="button"
            text={!isLoading ? t('Continue') : t('Importing...')}
            size="large"
            style={{ minWidth: 180 }}
            hasBottomSpacing={false}
            disabled={!isValid || accountAdderState.accountsLoading || isLoading}
            onPress={onSubmit}
          >
            {!isLoading && (
              <View style={spacings.pl}>
                <RightArrowIcon color={colors.titan} />
              </View>
            )}
          </Button>
        </>
      }
    >
      <TabLayoutWrapperMainContent>
        <Panel title={t('Confirm your Seed Phrase')}>
          <View>
            {confirmationWords.map(({ word, numberInSeed }: any, index: number) => (
              <View
                key={word}
                style={[flexbox.directionRow, flexbox.alignCenter, spacings.mb, { width: 200 }]}
              >
                <Text fontSize={14} weight="medium" style={[{ width: 32 }]}>
                  #{numberInSeed}
                </Text>
                <Controller
                  control={control}
                  name={`confirmationWords.${index}.fieldValue`}
                  rules={{ required: true, validate: (value) => value === word }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <Input
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      style={{ width: 200 }}
                      isValid={value === word}
                      placeholder={t('Word {{numberInSeed}}', { numberInSeed })}
                      containerStyle={[spacings.mb0, flexbox.flex1]}
                      onSubmitEditing={onSubmit}
                    />
                  )}
                />
              </View>
            ))}
          </View>
        </Panel>
      </TabLayoutWrapperMainContent>
      <CreateSeedPhraseSidebar currentStepId="confirm" />
    </TabLayoutContainer>
  )
}

export default CreateSeedPhraseConfirmScreen
