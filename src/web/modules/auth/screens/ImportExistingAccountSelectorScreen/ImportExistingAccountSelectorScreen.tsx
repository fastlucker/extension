import React, { useEffect, useRef, useState } from 'react'
import { Animated, View } from 'react-native'
import { SvgProps } from 'react-native-svg'

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
import useTheme from '@common/hooks/useTheme'
import { OnboardingRoute } from '@common/modules/auth/contexts/onboardingNavigationContext/onboardingNavigationContext'
import useOnboardingNavigation from '@common/modules/auth/hooks/useOnboardingNavigation'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'

import getStyles from './styles'

export const CARD_WIDTH = 400
const VISIBLE_BUTTONS_COUNT = 4

type ButtonType = {
  title: string
  route: OnboardingRoute
  icon: React.FC<SvgProps>
}

const buttons: ButtonType[] = [
  { title: 'Private Key', route: WEB_ROUTES.importPrivateKey, icon: PrivateKeyIcon },
  { title: 'Recovery Phrase', route: WEB_ROUTES.importSeedPhrase, icon: SeedPhraseIcon },
  { title: 'Trezor', route: WEB_ROUTES.importPrivateKey, icon: TrezorIcon }, // TODO: add route
  { title: 'Ledger', route: WEB_ROUTES.importPrivateKey, icon: LedgerIcon }, // TODO: add route
  { title: 'Grid Plus', route: WEB_ROUTES.importPrivateKey, icon: LatticeWithBorderIcon }, // TODO: add route
  { title: 'JSON', route: WEB_ROUTES.importPrivateKey, icon: ImportJsonIcon } // TODO: add route
]

const ImportExistingAccountSelectorScreen = () => {
  const { theme } = useTheme(getStyles)
  const { t } = useTranslation()
  const wrapperRef = useRef<View | null>(null)

  const { goToPrevRoute, goToNextRoute } = useOnboardingNavigation()
  const [showMore, setShowMore] = useState(false)

  const animatedHeight = useRef(new Animated.Value(0)).current
  const animatedOpacity = useRef(new Animated.Value(0)).current

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
  }, [animatedHeight, animatedOpacity, showMore])

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={<Header withAmbireLogo />}
    >
      <TabLayoutWrapperMainContent wrapperRef={wrapperRef} contentContainerStyle={spacings.mbLg}>
        <Panel
          spacingsSize="small"
          withBackButton
          onBackButtonPress={goToPrevRoute}
          title={t('Select Import Method')}
          style={{
            width: CARD_WIDTH,
            alignSelf: 'center',
            ...common.shadowTertiary
          }}
        >
          <View style={[flexbox.justifySpaceBetween]}>
            {buttons
              .slice(0, VISIBLE_BUTTONS_COUNT)
              .map(({ title, route, icon: IconComponent }) => (
                <Button key={title} type="gray" onPress={() => goToNextRoute(route)}>
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
              {buttons.slice(VISIBLE_BUTTONS_COUNT).map(({ title, route, icon: IconComponent }) => (
                <Button key={title} type="gray" onPress={() => goToNextRoute(route)}>
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
              <Text appearance="primary">{t(showMore ? 'Less' : 'More')}</Text>
            </Button>
          )}
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(ImportExistingAccountSelectorScreen)
