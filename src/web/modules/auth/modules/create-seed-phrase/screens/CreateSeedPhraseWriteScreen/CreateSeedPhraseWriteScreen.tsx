import React, { useEffect } from 'react'
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
import CreateSeedPhraseSidebar from '@web/modules/auth/modules/create-seed-phrase/components/CreateSeedPhraseSidebar'

const generateConfirmationWords = (seed: string[]) => {
  // Split the input array into groups of three words
  const wordGroups = []
  for (let i = 0; i < 12; i += 3) {
    wordGroups.push(seed.slice(i, i + 3))
  }

  // Initialize an array to store the randomly selected words
  const confirmationWords: { numberInSeed: number; word: string }[] = []

  // Select one random word from each group
  wordGroups.forEach((group, groupIndex) => {
    const randomIndex = Math.floor(Math.random() * (group.length - 1))
    const indexOfWord = groupIndex * 3 + randomIndex

    confirmationWords.push({
      numberInSeed: indexOfWord + 1,
      word: group[randomIndex]
    })
  })

  return confirmationWords
}

const CreateSeedPhraseWriteScreen = () => {
  const {
    state: { seed, confirmationWords }
  } = useRoute()
  const { updateStepperState } = useStepper()
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { theme } = useTheme()

  const handleSubmit = () => {
    navigate(WEB_ROUTES.createSeedPhraseConfirm, {
      state: {
        // Try to use the same confirmation words if the user navigates back
        confirmationWords: confirmationWords || generateConfirmationWords(seed),
        seed
      }
    })
  }

  useEffect(() => {
    updateStepperState('secure-seed', 'create-seed')
  }, [updateStepperState])

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={<Header withAmbireLogo />}
      footer={
        <>
          <BackButton
            onPress={() => {
              navigate(WEB_ROUTES.createSeedPhrasePrepare, { state: { seed } })
            }}
          />
          <Button
            testID="create-seed-phrase-write-continue-btn"
            accessibilityRole="button"
            text={t('Continue')}
            size="large"
            hasBottomSpacing={false}
            onPress={handleSubmit}
          >
            <View style={spacings.pl}>
              <RightArrowIcon color={colors.titan} />
            </View>
          </Button>
        </>
      }
    >
      <TabLayoutWrapperMainContent>
        <Panel title="Secure your seed phrase">
          <Text appearance="infoText" fontSize={16} style={spacings.mbXl}>
            {t('Write down the seed phrase and store it in a safe place')}
          </Text>
          <View style={[flexbox.directionRow, flexbox.wrap]}>
            {(seed as string[]).map((word, index) => (
              <View
                key={`${word}-${seed.indexOf(word)}`}
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
                <Input
                  testID={`recovery-with-seed-word-${index}`}
                  value={word}
                  numberOfLines={1}
                  containerStyle={[spacings.mb0, flexbox.flex1]}
                />
              </View>
            ))}
          </View>
        </Panel>
      </TabLayoutWrapperMainContent>
      <CreateSeedPhraseSidebar currentStepId="write" />
    </TabLayoutContainer>
  )
}

export default CreateSeedPhraseWriteScreen
