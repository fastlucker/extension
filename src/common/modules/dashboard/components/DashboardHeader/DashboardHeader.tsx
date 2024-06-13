import * as Clipboard from 'expo-clipboard'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Pressable, View } from 'react-native'

import BurgerIcon from '@common/assets/svg/BurgerIcon'
import CopyIcon from '@common/assets/svg/CopyIcon'
import MaximizeIcon from '@common/assets/svg/MaximizeIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import ViewOnlyIconFilled from '@common/assets/svg/ViewOnlyIconFilled'
import AccountKeysButton from '@common/components/AccountKeysButton'
import { Avatar } from '@common/components/Avatar'
import Text from '@common/components/Text'
import { DEFAULT_ACCOUNT_LABEL } from '@common/constants/account'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import { openInTab } from '@web/extension-services/background/webapi/tab'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useHover, { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import commonWebStyles from '@web/styles/utils/common'
import shortenAddress from '@web/utils/shortenAddress'
import { getUiType } from '@web/utils/uiType'

import { NEUTRAL_BACKGROUND_HOVERED } from '../../screens/styles'
import getStyles from './styles'

const { isPopup } = getUiType()

const DashboardHeader = () => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const accountsCtrl = useAccountsControllerState()
  const settingsCtrl = useSettingsControllerState()
  const keystoreCtrl = useKeystoreControllerState()
  const selectedAccount = accountsCtrl.selectedAccount || ''
  const selectedAccountData = accountsCtrl.accounts.find((acc) => acc.addr === selectedAccount)

  const selectedAccPref = settingsCtrl.accountPreferences[selectedAccount]
  const selectedAccLabel = selectedAccPref?.label || DEFAULT_ACCOUNT_LABEL
  const [bindAddressAnim, addressAnimStyle] = useHover({
    preset: 'opacity'
  })
  const [bindAccountBtnAnim, accountBtnAnimStyle, isAccountBtnHovered] = useCustomHover({
    property: 'left',
    values: {
      from: 0,
      to: 4
    }
  })
  const [bindBurgerAnim, burgerAnimStyle] = useHover({
    preset: 'opacity'
  })
  const [bindMaximizeAnim, maximizeAnimStyle] = useHover({
    preset: 'opacity'
  })

  const { navigate } = useNavigation()
  const { theme, styles } = useTheme(getStyles)

  const isViewOnly = keystoreCtrl.keys.every(
    (k) => !selectedAccountData?.associatedKeys.includes(k.addr)
  )

  const handleCopyText = async () => {
    try {
      await Clipboard.setStringAsync(selectedAccount)
      addToast(t('Copied address to clipboard!') as string, { timeout: 2500 })
    } catch {
      addToast(t('Failed to copy address to clipboard!') as string, {
        timeout: 2500,
        type: 'error'
      })
    }
  }

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
        <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
          <AnimatedPressable
            style={[
              styles.accountButton,
              {
                backgroundColor: isAccountBtnHovered
                  ? NEUTRAL_BACKGROUND_HOVERED
                  : NEUTRAL_BACKGROUND_HOVERED
              }
            ]}
            onPress={() => navigate(WEB_ROUTES.accountSelect)}
            {...bindAccountBtnAnim}
          >
            <>
              <View style={styles.accountButtonInfo}>
                <View>
                  <Avatar pfp={selectedAccPref?.pfp} size={32} />
                  {isViewOnly && (
                    <View
                      style={{
                        position: 'absolute',
                        right: 2,
                        top: -2,
                        backgroundColor: theme.primaryBackground,
                        padding: 2,
                        borderRadius: 50
                      }}
                    >
                      <ViewOnlyIconFilled
                        width={14}
                        height={14}
                        strokeWidth={4}
                        color={theme.infoDecorative}
                      />
                    </View>
                  )}
                </View>
                <Text
                  numberOfLines={1}
                  weight="semiBold"
                  style={[spacings.mlTy, spacings.mrLg]}
                  color={theme.primaryBackground}
                  fontSize={14}
                >
                  {selectedAccLabel}
                </Text>
                <AccountKeysButton />
              </View>
              <Animated.View style={accountBtnAnimStyle}>
                <RightArrowIcon
                  style={styles.accountButtonRightIcon}
                  width={12}
                  color={theme.primaryBackground}
                />
              </Animated.View>
            </>
          </AnimatedPressable>
          <AnimatedPressable
            style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, addressAnimStyle]}
            onPress={handleCopyText}
            {...bindAddressAnim}
          >
            <Text
              color={theme.primaryBackground}
              style={spacings.mrMi}
              weight="medium"
              fontSize={14}
            >
              ({shortenAddress(selectedAccount, 13)})
            </Text>
            <CopyIcon width={20} height={20} color={theme.primaryBackground} />
          </AnimatedPressable>
        </View>

        <View style={styles.maximizeAndMenu}>
          {!!isPopup && (
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
              isPopup ? navigate(WEB_ROUTES.menu) : navigate(WEB_ROUTES.accountsSettings)
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
