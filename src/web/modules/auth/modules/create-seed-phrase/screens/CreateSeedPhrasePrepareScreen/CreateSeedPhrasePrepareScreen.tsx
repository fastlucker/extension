import React, { useCallback, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'

import { EntropyGenerator } from '@ambire-common/libs/entropyGenerator/entropyGenerator'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import WarningIcon from '@common/assets/svg/WarningIcon'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import Checkbox from '@common/components/Checkbox'
import Panel from '@common/components/Panel'
import { getPanelPaddings } from '@common/components/Panel/Panel'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useExtraEntropy from '@common/hooks/useExtraEntropy'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import useWindowSize from '@common/hooks/useWindowSize'
import useStepper from '@common/modules/auth/hooks/useOnboardingNavigation'
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
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import CreateSeedPhraseSidebar from '@web/modules/auth/modules/create-seed-phrase/components/CreateSeedPhraseSidebar'

const CHECKBOXES = [
  {
    id: 0,
    label:
      'It is crucial to keep your seed phrase in a safe place and never share it with anyone, no matter the reason.'
  },
  {
    id: 1,
    label: 'If your seed phrase is compromised, your account security is at risk.'
  },
  {
    id: 2,
    label: 'Use your wallet’s seed phrase only to access or recover your account.'
  }
]

const CreateSeedPhrasePrepareScreen = () => {
  const { updateStepperState } = useStepper()
  const { accounts } = useAccountsControllerState()
  const { addToast } = useToast()
  const { t } = useTranslation()
  const { navigate, goBack } = useNavigation()
  const { theme } = useTheme()
  const { maxWidthSize } = useWindowSize()
  const [checkboxesState, setCheckboxesState] = useState([false, false, false])
  const allCheckboxesChecked = checkboxesState.every((checkbox) => checkbox)
  const panelPaddingStyle = getPanelPaddings(maxWidthSize)
  const keystoreState = useKeystoreControllerState()

  const { getExtraEntropy } = useExtraEntropy()

  const handleSubmit = useCallback(() => {
    const entropyGenerator = new EntropyGenerator()
    const seed = entropyGenerator.generateRandomMnemonic(12, getExtraEntropy()).phrase

    if (!seed) {
      addToast('Failed to generate seed phrase', { type: 'error' })
      return
    }
    navigate(WEB_ROUTES.createSeedPhraseWrite, { state: { seed: seed.split(' ') } })
  }, [addToast, navigate, getExtraEntropy])

  // prevent proceeding with new seed phrase setup if there is a saved seed phrase already associated with the keystore
  useEffect(() => {
    if (keystoreState.hasKeystoreSavedSeed) goBack()
  }, [goBack, keystoreState.hasKeystoreSavedSeed])

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
      header={<Header withAmbireLogo />}
      footer={
        <>
          <BackButton
            onPress={() => {
              if (accounts.length) {
                navigate(WEB_ROUTES.dashboard)
                return
              }
              navigate(WEB_ROUTES.getStarted)
            }}
          />
          <Button
            testID="review-seed-phrase-btn"
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
              {t('Important information about the seed phrase')}
            </Text>
          </View>
          <View style={[panelPaddingStyle, spacings.pt]}>
            <View style={{ maxWidth: 560 }}>
              <Text weight="semiBold" fontSize={16} style={spacings.mbLg}>
                {t(
                  'The seed phrase is a unique set of 12 or 24 words used to access and recover your account.'
                )}
              </Text>
              {CHECKBOXES.map(({ id, label }, index) => (
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
                  <Pressable
                    testID={`create-seed-prepare-checkbox-${index}`}
                    style={flexbox.flex1}
                    onPress={() => handleCheckboxPress(id)}
                  >
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
                    'Grab a pen and a piece of paper, and get ready to write down your seed phrase.'
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

export default React.memo(CreateSeedPhrasePrepareScreen)
