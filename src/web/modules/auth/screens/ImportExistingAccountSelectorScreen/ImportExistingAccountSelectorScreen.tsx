import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, View } from 'react-native'
import { SvgProps } from 'react-native-svg'

import DiagonalRightArrowIcon from '@common/assets/svg/DiagonalRightArrowIcon'
import ImportJsonIcon from '@common/assets/svg/ImportJsonIcon'
import LatticeWithBorderIcon from '@common/assets/svg/LatticeWithBorderIcon'
import LedgerIcon from '@common/assets/svg/LedgerIcon'
import PrivateKeyIcon from '@common/assets/svg/PrivateKeyIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import SeedPhraseIcon from '@common/assets/svg/SeedPhraseIcon'
import TrezorIcon from '@common/assets/svg/TrezorIcon'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import usePrevious from '@common/hooks/usePrevious'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import useOnboardingNavigation from '@common/modules/auth/hooks/useOnboardingNavigation'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { isSafari } from '@web/constants/browserapi'
import useAccountPickerControllerState from '@web/hooks/useAccountPickerControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'

import getStyles from './styles'

export const CARD_WIDTH = 400
const VISIBLE_BUTTONS_COUNT = 4

type ButtonType = {
  title: string
  onPress: () => void
  icon: React.FC<SvgProps>
}

const ImportExistingAccountSelectorScreen = () => {
  const { theme } = useTheme(getStyles)
  const { t } = useTranslation()
  const wrapperRef = useRef<View | null>(null)

  const { goToPrevRoute, goToNextRoute } = useOnboardingNavigation()
  const [showMore, setShowMore] = useState(false)

  const animatedHeight = useRef(new Animated.Value(0)).current
  const animatedOpacity = useRef(new Animated.Value(0)).current
  const { addToast } = useToast()
  const { dispatch } = useBackgroundService()
  const { isInitialized, type } = useAccountPickerControllerState()
  const prevIsInitialized = usePrevious(isInitialized)
  const buttons: ButtonType[] = useMemo(
    () => [
      {
        title: 'Private Key',
        onPress: () => {
          goToNextRoute(WEB_ROUTES.importPrivateKey)
        },
        icon: PrivateKeyIcon
      },
      {
        title: 'Recovery Phrase',
        onPress: () => {
          goToNextRoute(WEB_ROUTES.importSeedPhrase)
        },
        icon: SeedPhraseIcon
      },
      {
        title: 'Trezor',
        onPress: () => {
          if (isSafari()) {
            addToast(
              t(
                "Your browser doesn't support WebUSB, which is required for the Trezor device. Please try using a different browser."
              ),
              { type: 'error' }
            )
          } else {
            dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_PICKER_INIT_TREZOR' })
          }
        },
        icon: TrezorIcon
      },
      {
        title: 'Ledger',
        onPress: () => {
          goToNextRoute(WEB_ROUTES.ledgerConnect)
        },
        icon: LedgerIcon
      },
      {
        title: 'Grid Plus',
        onPress: () => {
          dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_PICKER_INIT_LATTICE' })
        },
        icon: LatticeWithBorderIcon
      },
      {
        title: 'JSON Backup (file)',
        onPress: () => {
          goToNextRoute(WEB_ROUTES.importSmartAccountJson)
        },
        icon: ImportJsonIcon
      }
    ],
    [goToNextRoute, addToast, dispatch, t]
  )

  useEffect(() => {
    if (
      !prevIsInitialized &&
      isInitialized &&
      ['lattice', 'trezor'].includes(type as 'lattice' | 'trezor')
    ) {
      dispatch({ type: 'ACCOUNT_PICKER_CONTROLLER_ADD_NEXT_ACCOUNT' })
      goToNextRoute()
    }
  }, [goToNextRoute, dispatch, isInitialized, prevIsInitialized, type])

  useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: showMore ? 1 : 0,
      duration: 300,
      useNativeDriver: true
    }).start()

    Animated.timing(animatedHeight, {
      toValue: showMore ? (buttons.length - VISIBLE_BUTTONS_COUNT) * 70 : 0,
      duration: 300,
      useNativeDriver: false
    }).start()
  }, [animatedHeight, animatedOpacity, showMore, buttons.length])

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={<Header withAmbireLogo />}
    >
      <TabLayoutWrapperMainContent wrapperRef={wrapperRef} contentContainerStyle={spacings.mbLg}>
        <Panel
          type="onboarding"
          spacingsSize="small"
          withBackButton
          onBackButtonPress={goToPrevRoute}
          title={t('Select Import Method')}
        >
          <View style={[flexbox.justifySpaceBetween, flexbox.flex1]}>
            <View style={[flexbox.justifySpaceBetween]}>
              {buttons
                .slice(0, VISIBLE_BUTTONS_COUNT)
                .map(({ title, onPress, icon: IconComponent }) => (
                  <Button key={title} type="gray" onPress={onPress}>
                    <View
                      style={[
                        flexbox.directionRow,
                        flexbox.alignCenter,
                        flexbox.justifySpaceBetween,
                        flexbox.flex1,
                        spacings.phSm
                      ]}
                    >
                      <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                        <IconComponent width={24} />
                        <Text style={spacings.mlSm} fontSize={14} weight="medium">
                          {t(title)}
                        </Text>
                      </View>
                      <RightArrowIcon />
                    </View>
                  </Button>
                ))}
              <Animated.View
                style={{ height: animatedHeight, opacity: animatedOpacity, overflow: 'hidden' }}
              >
                {buttons
                  .slice(VISIBLE_BUTTONS_COUNT)
                  .map(({ title, onPress, icon: IconComponent }) => (
                    <Button key={title} type="gray" onPress={onPress}>
                      <View
                        style={[
                          flexbox.directionRow,
                          flexbox.alignCenter,
                          flexbox.justifySpaceBetween,
                          flexbox.flex1,
                          spacings.phSm
                        ]}
                      >
                        <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                          <IconComponent width={24} />
                          <Text style={spacings.mlSm} fontSize={14} weight="medium">
                            {t(title)}
                          </Text>
                        </View>
                        <RightArrowIcon />
                      </View>
                    </Button>
                  ))}
              </Animated.View>
            </View>
            {buttons.length > VISIBLE_BUTTONS_COUNT && (
              <Button hasBottomSpacing={false} type="ghost" onPress={() => setShowMore(!showMore)}>
                <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                  <Text appearance="primary" style={spacings.mrSm} weight="medium">
                    {t(showMore ? 'Less' : 'More')}
                  </Text>
                  {/* TODO: Add animation on hover */}
                  <DiagonalRightArrowIcon
                    color={theme.primary}
                    style={[{ transform: [{ rotate: !showMore ? '90deg' : '0deg' }] }]}
                    height={16}
                  />
                </View>
              </Button>
            )}
          </View>
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(ImportExistingAccountSelectorScreen)
