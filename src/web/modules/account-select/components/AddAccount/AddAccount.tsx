import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import AddCircularIcon from '@common/assets/svg/AddCircularIcon'
import AddFromCurrentRecoveryPhraseIcon from '@common/assets/svg/AddFromCurrentRecoveryPhraseIcon'
import HWIcon from '@common/assets/svg/HWIcon'
import LatticeMiniIcon from '@common/assets/svg/LatticeMiniIcon'
import LedgerMiniIcon from '@common/assets/svg/LedgerMiniIcon'
import PrivateKeyIcon from '@common/assets/svg/PrivateKeyIcon'
import SeedPhraseIcon from '@common/assets/svg/SeedPhraseIcon'
import TrezorMiniIcon from '@common/assets/svg/TrezorMiniIcon'
import ViewOnlyIcon from '@common/assets/svg/ViewOnlyIcon'
import Option from '@common/components/Option'
import { PanelBackButton, PanelTitle } from '@common/components/Panel/Panel'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import usePrevious from '@common/hooks/usePrevious'
import useTheme from '@common/hooks/useTheme'
import useOnboardingNavigation from '@common/modules/auth/hooks/useOnboardingNavigation'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import useAccountPickerControllerState from '@web/hooks/useAccountPickerControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'

import getStyles from './styles'

const AddAccount = ({ handleClose }: { handleClose: () => void }) => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { styles } = useTheme(getStyles)
  const { dispatch } = useBackgroundService()
  const [isHwOptionExpanded, setIsHwOptionExpanded] = useState(false)
  const pressedHwButton = useRef<'trezor' | 'ledger' | 'lattice' | null>(null)
  const { isInitialized, type } = useAccountPickerControllerState()
  const prevIsInitialized = usePrevious(isInitialized)
  const { goToNextRoute } = useOnboardingNavigation()
  const toggleHwOptions = useCallback(() => {
    setIsHwOptionExpanded((p) => !p)
  }, [])

  useEffect(() => {
    if (
      !prevIsInitialized &&
      isInitialized &&
      ['lattice', 'trezor'].includes(type as 'lattice' | 'trezor') &&
      pressedHwButton.current
    ) {
      dispatch({ type: 'ACCOUNT_PICKER_CONTROLLER_ADD_NEXT_ACCOUNT' })
      goToNextRoute(WEB_ROUTES.accountPersonalize)
    }
  }, [goToNextRoute, dispatch, isInitialized, prevIsInitialized, type])

  return (
    <View style={spacings.ptSm}>
      <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbLg]}>
        <PanelBackButton onPress={handleClose} style={spacings.mr} />
        <PanelTitle title={t('Add an address')} style={text.left} />
      </View>
      <View style={styles.optionsWrapper}>
        <Option
          text={t('Add from current recovery phrase')}
          icon={AddFromCurrentRecoveryPhraseIcon}
          onPress={() => {}}
          iconProps={{ width: 32, height: 32 }}
          testID="add-from-current-recovery-phrase"
          disabled
        />
        <Option
          text={t('Create new recovery phrase')}
          icon={AddCircularIcon}
          onPress={() => navigate(WEB_ROUTES.createSeedPhrasePrepare)}
          testID="create-new-recovery-phrase"
        />
      </View>
      <View style={styles.optionsWrapper}>
        <Option
          text={t('Import recovery phrase')}
          icon={SeedPhraseIcon}
          iconProps={{ width: 30, height: 30 }}
          onPress={() => navigate(WEB_ROUTES.importSeedPhrase)}
          testID="import-recovery-phrase"
        />
        <Option
          text={t('Import private key')}
          icon={PrivateKeyIcon}
          iconProps={{ width: 30, height: 30 }}
          onPress={() => navigate(WEB_ROUTES.importPrivateKey)}
          testID="import-private-key"
        />
      </View>
      <View style={styles.optionsWrapper}>
        <Option
          text={t('Connect a hardware wallet')}
          icon={HWIcon}
          iconProps={{ width: 30, height: 30 }}
          onPress={toggleHwOptions}
          testID="connect-hardware-wallet"
          status={isHwOptionExpanded ? 'expanded' : 'collapsed'}
        >
          {isHwOptionExpanded && (
            <View style={styles.hwOptionsContainer}>
              <View style={styles.hwOptionWrapper}>
                <Pressable
                  style={({ hovered }: any) => [
                    styles.hwOption,
                    hovered && styles.hwOptionHovered,
                    { opacity: 0.5 }
                  ]}
                  onPress={() => {
                    pressedHwButton.current = 'trezor'
                    dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_PICKER_INIT_TREZOR' })
                  }}
                  disabled
                >
                  <TrezorMiniIcon width={44} height={44} />
                  <Text fontSize={14} weight="medium" style={spacings.mtMi} numberOfLines={1}>
                    Trezor
                  </Text>
                </Pressable>
              </View>
              <View style={styles.hwOptionWrapper}>
                <Pressable
                  style={({ hovered }: any) => [styles.hwOption, hovered && styles.hwOptionHovered]}
                  onPress={() => navigate(WEB_ROUTES.ledgerConnect)}
                >
                  <LedgerMiniIcon width={44} height={44} />
                  <Text fontSize={14} weight="medium" style={spacings.mtMi} numberOfLines={1}>
                    Ledger
                  </Text>
                </Pressable>
              </View>
              <View style={styles.hwOptionWrapper}>
                <Pressable
                  style={({ hovered }: any) => [
                    styles.hwOption,
                    hovered && styles.hwOptionHovered,
                    { opacity: 0.5 }
                  ]}
                  onPress={() => {
                    pressedHwButton.current = 'lattice'
                    dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_PICKER_INIT_LATTICE' })
                  }}
                  disabled
                >
                  <LatticeMiniIcon width={44} height={44} />
                  <Text fontSize={14} weight="medium" style={spacings.mtMi} numberOfLines={1}>
                    GridPlus
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </Option>
      </View>
      <View>
        <Option
          text={t('Watch an address')}
          icon={ViewOnlyIcon}
          iconProps={{ width: 30, height: 30, strokeWidth: '2.75' }}
          onPress={() => navigate(WEB_ROUTES.viewOnlyAccountAdder)}
          testID="connect-hardware-wallet"
        />
      </View>
    </View>
  )
}

export default React.memo(AddAccount)
