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
import Stepper from '@web/modules/router/components/Stepper'

const MNEMONIC = [
  {
    index: 1,
    word: 'word2'
  },
  {
    index: 4,
    word: 'word5'
  },
  {
    index: 7,
    word: 'word8'
  },
  {
    index: 9,
    word: 'word10'
  },
  {
    index: 11,
    word: 'word12'
  }
]

const CreateSeedPhraseConfirmScreen = () => {
  const { updateStepperState } = useStepper()
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { theme } = useTheme()

  useEffect(() => {
    updateStepperState('secure-seed', 'create-seed')
  }, [updateStepperState])

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
            accessibilityRole="button"
            text={t('Continue')}
            style={{ minWidth: 180 }}
            hasBottomSpacing={false}
            onPress={() => {
              navigate(WEB_ROUTES.createSeedPhraseConfirm)
            }}
          >
            <View style={spacings.pl}>
              <RightArrowIcon color={colors.titan} />
            </View>
          </Button>
        </>
      }
    >
      <TabLayoutWrapperMainContent>
        <Panel title={t('Confirm your Seed Phrase')}>
          <View>
            {MNEMONIC.map(({ word, index }) => (
              <View
                key={word}
                style={[flexbox.directionRow, flexbox.alignCenter, spacings.mb, { width: 200 }]}
              >
                <Text fontSize={14} weight="medium" style={[{ width: 32 }]}>
                  #{index + 1}
                </Text>
                <Input
                  value={word}
                  numberOfLines={1}
                  containerStyle={[spacings.mb0, flexbox.flex1]}
                />
              </View>
            ))}
          </View>
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default CreateSeedPhraseConfirmScreen
