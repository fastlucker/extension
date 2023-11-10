import { Image, Pressable, View } from 'react-native'

// @ts-ignore
import BurgerIcon from '@common/assets/svg/BurgerIcon'
import MaximizeIcon from '@common/assets/svg/MaximizeIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import CopyText from '@common/components/CopyText'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import { openInTab } from '@web/extension-services/background/webapi/tab'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import { getAccountPfpSource } from '@web/modules/account-personalize/components/AccountPersonalizeCard/avatars'
import commonWebStyles from '@web/styles/utils/common'
import shortenAddress from '@web/utils/shortenAddress'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

const { isPopup } = getUiType()

const DashboardHeader = () => {
  const mainCtrl = useMainControllerState()
  const settingsCtrl = useSettingsControllerState()

  const selectedAccount = mainCtrl.selectedAccount || ''
  const selectedAccPref = settingsCtrl.accountPreferences[selectedAccount]
  const selectedAccPfpSource = getAccountPfpSource(selectedAccPref?.pfp)

  const { navigate } = useNavigation()
  const { theme, styles } = useTheme(getStyles)
  return (
    <Header backgroundColor={theme.primaryBackground} mode="custom">
      <View
        style={[
          flexboxStyles.directionRow,
          flexboxStyles.alignCenter,
          flexboxStyles.flex1,
          commonWebStyles.contentContainer
        ]}
      >
        <View
          style={[
            flexboxStyles.directionRow,
            flexboxStyles.flex1,
            flexboxStyles.justifySpaceBetween
          ]}
        >
          <Pressable style={styles.accountButton} onPress={() => navigate('account-select')}>
            <View style={styles.accountButtonInfo}>
              <Image
                style={styles.accountButtonInfoIcon}
                source={selectedAccPfpSource}
                resizeMode="contain"
              />
              <View style={styles.accountAddressAndLabel}>
                {/* TODO: Hide this text element if the account doesn't have a label when labels are properly implemented */}
                <Text weight="number_bold" fontSize={14}>
                  {selectedAccPref?.label || 'Account'}
                </Text>
                <Text weight="number_medium" style={styles.accountButtonInfoText} fontSize={14}>
                  ({shortenAddress(selectedAccount, 27)})
                </Text>
              </View>
            </View>
            <CopyText
              iconHeight={20}
              iconWidth={20}
              text={selectedAccount}
              style={styles.accountCopyIcon}
              iconColor={theme.secondaryText}
            />
            <Pressable
              onPress={() => navigate('account-select')}
              style={styles.accountButtonRightIcon}
            >
              <RightArrowIcon width={12} color={theme.secondaryText} />
            </Pressable>
          </Pressable>
          <View style={styles.maximizeAndMenu}>
            {isPopup && (
              <Pressable onPress={() => openInTab('tab.html#/dashboard')}>
                <MaximizeIcon width={20} height={20} />
              </Pressable>
            )}
            <Pressable
              style={{ ...spacings.mlLg, ...spacings.mrTy }}
              onPress={() => navigate('menu')}
            >
              <BurgerIcon width={20} height={20} />
            </Pressable>
          </View>
        </View>
      </View>
    </Header>
  )
}

export default DashboardHeader
