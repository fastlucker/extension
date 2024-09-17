import React, { useMemo } from 'react'
import { Animated, Pressable, View } from 'react-native'

import BurgerIcon from '@common/assets/svg/BurgerIcon'
import MaximizeIcon from '@common/assets/svg/MaximizeIcon'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import { openInTab } from '@web/extension-services/background/webapi/tab'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useHover from '@web/hooks/useHover'
import commonWebStyles from '@web/styles/utils/common'
import { getUiType } from '@web/utils/uiType'

import AccountButton from './AccountButton'
import getStyles from './styles'

const { isPopup } = getUiType()

const DashboardHeader = () => {
  const accountsState = useAccountsControllerState()

  const selectedAccountData = useMemo(
    () => accountsState.accounts.find((a) => a.addr === accountsState.selectedAccount),
    [accountsState.accounts, accountsState.selectedAccount]
  )

  const [bindBurgerAnim, burgerAnimStyle] = useHover({
    preset: 'opacity'
  })
  const [bindMaximizeAnim, maximizeAnimStyle] = useHover({
    preset: 'opacity'
  })

  const { navigate } = useNavigation()
  const { theme, styles } = useTheme(getStyles)

  // Temporary measure because UX was found to be confusing
  const ENABLE_MAXIMIZE = false

  if (!selectedAccountData) return null

  return (
    <View
      style={[
        flexboxStyles.directionRow,
        flexboxStyles.alignCenter,
        flexboxStyles.flex1,
        commonWebStyles.contentContainer
      ]}
    >
      <View
        style={[flexboxStyles.directionRow, flexboxStyles.flex1, flexboxStyles.justifySpaceBetween]}
      >
        <AccountButton />
        <View style={styles.maximizeAndMenu}>
          {!!isPopup && ENABLE_MAXIMIZE && (
            <Pressable
              onPress={() => openInTab(`tab.html#/${WEB_ROUTES.dashboard}`)}
              {...bindMaximizeAnim}
            >
              <Animated.View style={maximizeAnimStyle}>
                <MaximizeIcon color={theme.secondaryBackground} width={16} height={16} />
              </Animated.View>
            </Pressable>
          )}
          <Pressable
            style={{ ...spacings.mlLg, ...spacings.mrTy }}
            onPress={() =>
              isPopup ? navigate(WEB_ROUTES.menu) : navigate(WEB_ROUTES.generalSettings)
            }
            {...bindBurgerAnim}
          >
            <Animated.View style={burgerAnimStyle}>
              <BurgerIcon color={theme.primaryBackground} width={20} height={20} />
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default React.memo(DashboardHeader)
