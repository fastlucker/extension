import * as Clipboard from 'expo-clipboard'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import BurgerIcon from '@common/assets/svg/BurgerIcon'
import CopyIcon from '@common/assets/svg/CopyIcon'
import MaximizeIcon from '@common/assets/svg/MaximizeIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import ViewOnlyIconFilled from '@common/assets/svg/ViewOnlyIconFilled'
import Blockies from '@common/components/Blockies'
import Text from '@common/components/Text'
import { DEFAULT_ACCOUNT_LABEL } from '@common/constants/account'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import { openInTab } from '@web/extension-services/background/webapi/tab'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
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
  const mainCtrl = useMainControllerState()
  const settingsCtrl = useSettingsControllerState()
  const keystoreCtrl = useKeystoreControllerState()
  const selectedAccount = mainCtrl.selectedAccount || ''
  const selectedAccountData = mainCtrl.accounts.find((acc) => acc.addr === selectedAccount)

  const selectedAccPref = settingsCtrl.accountPreferences[selectedAccount]
  const selectedAccLabel = selectedAccPref?.label || DEFAULT_ACCOUNT_LABEL

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
        commonWebStyles.contentContainer,
        spacings.mbXl
      ]}
    >
      <View
        style={[flexboxStyles.directionRow, flexboxStyles.flex1, flexboxStyles.justifySpaceBetween]}
      >
        <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
          <Pressable
            style={({ hovered }: any) => [
              styles.accountButton,
              {
                backgroundColor: hovered ? NEUTRAL_BACKGROUND_HOVERED : NEUTRAL_BACKGROUND_HOVERED
              }
            ]}
            onPress={() => navigate('account-select')}
          >
            {({ hovered }: any) => (
              <>
                <View style={styles.accountButtonInfo}>
                  <View>
                    <Blockies width={32} height={32} seed={selectedAccount} />
                    {isViewOnly && (
                      <View
                        style={{
                          position: 'absolute',
                          right: -4,
                          top: -4,
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
                </View>
                <RightArrowIcon
                  style={[
                    styles.accountButtonRightIcon,
                    {
                      transform: [{ translateX: hovered ? 4 : 0 }]
                    }
                  ]}
                  width={12}
                  color={theme.primaryBackground}
                />
              </>
            )}
          </Pressable>
          <Pressable
            style={({ hovered }: any) => [
              flexboxStyles.directionRow,
              flexboxStyles.alignCenter,
              { opacity: hovered ? 1 : 0.7 }
            ]}
            onPress={handleCopyText}
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
          </Pressable>
        </View>

        <View style={styles.maximizeAndMenu}>
          {isPopup && (
            <Pressable onPress={() => openInTab('tab.html#/dashboard')}>
              {({ hovered }: any) => (
                <MaximizeIcon
                  opacity={hovered ? 1 : 0.7}
                  color={theme.secondaryBackground}
                  width={16}
                  height={16}
                />
              )}
            </Pressable>
          )}
          <Pressable
            style={{ ...spacings.mlLg, ...spacings.mrTy }}
            onPress={() => navigate('menu')}
          >
            {({ hovered }: any) => (
              <BurgerIcon
                opacity={hovered ? 1 : 0.7}
                color={theme.primaryBackground}
                width={20}
                height={20}
              />
            )}
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default DashboardHeader
