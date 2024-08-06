import { Wallet } from 'ethers'
import React, { useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'

import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import WarningIcon from '@common/assets/svg/WarningIcon'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import Checkbox from '@common/components/Checkbox'
import Panel from '@common/components/Panel'
import { getPanelPaddings } from '@common/components/Panel/Panel'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import useWindowSize from '@common/hooks/useWindowSize'
import useStepper from '@common/modules/auth/hooks/useStepper'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import CreateSeedPhraseSidebar from '@web/modules/auth/modules/create-seed-phrase/components/CreateSeedPhraseSidebar'
import Stepper from '@web/modules/router/components/Stepper'

const CHECKBOXES = [
  {
    id: 0,
    label:
      'It is extremely important to keep it safe and not share it with anybody else, regardless of the reason.'
  },
  {
    id: 1,
    label: 'Compromising the security of your Seed Phrase compromises the security of your account.'
  },
  {
    id: 2,
    label:
      'You should use the Seed Phrase of your Smart Wallet account only to get access or recover access to it.'
  }
]

const CreateSeedPhrasePrepareScreen = () => {
  const { updateStepperState } = useStepper()
  const { accounts } = useAccountsControllerState()
  const { addToast } = useToast()
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { theme } = useTheme()
  const { maxWidthSize } = useWindowSize()
  const [checkboxesState, setCheckboxesState] = useState([false, false, false])
  const allCheckboxesChecked = checkboxesState.every((checkbox) => checkbox)
  const seed = Wallet.createRandom().mnemonic?.phrase || null
  const panelPaddingStyle = getPanelPaddings(maxWidthSize)

  const handleSubmit = () => {
    if (!seed) {
      addToast('Failed to generate seed phrase', { type: 'error' })
      return
    }
    navigate(WEB_ROUTES.createSeedPhraseWrite, {
      state: {
        seed: seed.split(' ')
      }
    })
  }

  useEffect(() => {
    updateStepperState('secure-seed', 'create-seed')
  }, [updateStepperState])

  const handleCheckboxPress = (id: number) => {
    setCheckboxesState((prevState) => {
      const newState = [...prevState]
      newState[id] = !prevState[id]
      return newState
    })
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
          <BackButton
            onPress={() => {
              if (accounts.length) {
                navigate(WEB_ROUTES.createHotWallet)
                return
              }
              navigate(WEB_ROUTES.getStarted)
            }}
          />
          <Button
            disabled={!allCheckboxesChecked}
            accessibilityRole="button"
            size="large"
            text={t('Review Seed Phrase')}
            style={{ minWidth: 180 }}
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
        <Panel style={[spacings.ph0, spacings.pv0]}>
          <View
            style={[
              panelPaddingStyle,
              flexbox.directionRow,
              flexbox.alignCenter,
              {
                backgroundColor: theme.warningBackground
              }
            ]}
          >
            <WarningIcon color={theme.warningDecorative} width={32} height={32} />
            <Text weight="medium" style={[spacings.mlSm]} fontSize={20}>
              {t('Important information about Seed phrase recovery')}
            </Text>
          </View>
          <View style={[panelPaddingStyle, spacings.pt]}>
            <View style={{ maxWidth: 560 }}>
              <Text weight="semiBold" fontSize={16} style={spacings.mbLg}>
                {t(
                  'The Seed Phrase is a unique set of 12 or 24 words, that allows you to access and recover your Smart Wallet account.'
                )}
              </Text>
              {CHECKBOXES.map(({ id, label }) => (
                <View
                  key={id}
                  style={[
                    spacings.pvSm,
                    spacings.phSm,
                    flexbox.directionRow,
                    flexbox.alignCenter,
                    spacings.mbSm,
                    {
                      backgroundColor: theme.secondaryBackground,
                      borderRadius: BORDER_RADIUS_PRIMARY
                    }
                  ]}
                >
                  <Checkbox
                    style={spacings.mb0}
                    value={checkboxesState[id]}
                    onValueChange={() => {
                      handleCheckboxPress(id)
                    }}
                  />
                  <Pressable style={flexbox.flex1} onPress={() => handleCheckboxPress(id)}>
                    <Text appearance="secondaryText" fontSize={16}>
                      {t(label)}
                    </Text>
                  </Pressable>
                </View>
              ))}
              <View
                style={[
                  spacings.phSm,
                  spacings.pvSm,
                  spacings.mbMd,
                  {
                    backgroundColor: theme.infoBackground,
                    borderRadius: BORDER_RADIUS_PRIMARY
                  }
                ]}
              >
                <Text fontSize={16} weight="semiBold" color={theme.infoText}>
                  {t(
                    'Now, take a pen and a piece of paper, and prepare to write down your Seed Phrase.'
                  )}
                </Text>
              </View>
            </View>
          </View>
        </Panel>
      </TabLayoutWrapperMainContent>
      <CreateSeedPhraseSidebar currentStepId="prepare" />
    </TabLayoutContainer>
  )
}

export default CreateSeedPhrasePrepareScreen
