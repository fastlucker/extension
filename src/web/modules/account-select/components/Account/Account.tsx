import React, { useCallback, useEffect, useMemo } from 'react'
import { Animated, Pressable, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { Account as AccountInterface } from '@ambire-common/interfaces/account'
import LogOutIcon from '@common/assets/svg/LogOutIcon'
import AccountAddress from '@common/components/AccountAddress'
import AccountBadges from '@common/components/AccountBadges'
import AccountKeyIcons from '@common/components/AccountKeyIcons'
import AccountKeysBottomSheet from '@common/components/AccountKeysBottomSheet'
import Avatar from '@common/components/Avatar'
import Dialog from '@common/components/Dialog'
import DialogButton from '@common/components/Dialog/DialogButton'
import DialogFooter from '@common/components/Dialog/DialogFooter'
import Editable from '@common/components/Editable'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useReverseLookup from '@common/hooks/useReverseLookup'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { useCustomHover } from '@web/hooks/useHover'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

const { isTab } = getUiType()

const Account = ({
  account,
  onSelect,
  maxAccountAddrLength = 42,
  withSettings = true,
  renderRightChildren,
  isInSettings = false
}: {
  account: AccountInterface
  onSelect?: (addr: string) => void
  maxAccountAddrLength?: number
  withSettings?: boolean
  renderRightChildren?: () => React.ReactNode
  isInSettings?: boolean
}) => {
  const { addr, preferences } = account
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)
  const { addToast } = useToast()
  const mainCtrlState = useMainControllerState()
  const { selectedAccount, statuses: accountsStatuses } = useAccountsControllerState()
  const { dispatch } = useBackgroundService()
  const { ref: dialogRef, open: openDialog, close: closeDialog } = useModalize()
  const { ens, ud, isLoading } = useReverseLookup({ address: addr })
  const [bindAnim, animStyle, isHovered] = useCustomHover({
    property: 'backgroundColor',
    values: {
      from: theme.primaryBackground,
      to: theme.secondaryBackground
    },
    forceHoveredStyle: addr === selectedAccount
  })

  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const { keys } = useKeystoreControllerState()
  const associatedKeys = account?.associatedKeys || []
  const importedAccountKeys = keys.filter(({ addr: keyAddr }) => associatedKeys.includes(keyAddr))

  const selectAccount = useCallback(() => {
    if (isInSettings) {
      openBottomSheet()
      return
    }

    if (selectedAccount !== addr) {
      dispatch({
        type: 'MAIN_CONTROLLER_SELECT_ACCOUNT',
        params: { accountAddr: addr }
      })
    }

    onSelect && onSelect(addr)
  }, [addr, dispatch, onSelect, selectedAccount, isInSettings, openBottomSheet])

  const removeAccount = useCallback(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_REMOVE_ACCOUNT',
      params: {
        accountAddr: addr
      }
    })
  }, [addr, dispatch])

  const promptRemoveAccount = useCallback(() => {
    openDialog()
  }, [openDialog])

  const onSave = useCallback(
    (value: string) => {
      dispatch({
        type: 'ACCOUNTS_CONTROLLER_UPDATE_ACCOUNT_PREFERENCES',
        params: [{ addr, preferences: { label: value, pfp: preferences.pfp } }]
      })
      addToast(t('Account label updated.'))
    },
    [addToast, addr, dispatch, preferences.pfp, t]
  )

  const isRemoveAccountLoading = useMemo(
    () => mainCtrlState.statuses.removeAccount === 'LOADING',
    [mainCtrlState.statuses.removeAccount]
  )

  useEffect(() => {
    if (mainCtrlState.statuses.removeAccount === 'SUCCESS') {
      addToast(t('Account removed.'))
      closeDialog()
      return
    }

    if (mainCtrlState.statuses.removeAccount === 'ERROR') {
      closeDialog()
    }
  }, [addToast, closeDialog, mainCtrlState.statuses.removeAccount, t])

  return (
    <Pressable
      disabled={accountsStatuses.selectAccount !== 'INITIAL'}
      onPress={selectAccount}
      {...bindAnim}
      testID="account"
    >
      <Animated.View style={[styles.accountContainer, animStyle]}>
        <View style={[flexboxStyles.directionRow]}>
          <Avatar ens={ens} ud={ud} pfp={account.preferences.pfp} />
          <View>
            <View style={[flexboxStyles.directionRow]}>
              {!withSettings ? (
                <Text fontSize={isTab ? 16 : 14} weight="medium">
                  {account.preferences.label}
                </Text>
              ) : (
                <Editable
                  initialValue={account.preferences.label}
                  onSave={onSave}
                  fontSize={isTab ? 16 : 14}
                  height={24}
                  textProps={{
                    weight: 'medium'
                  }}
                  minWidth={100}
                  maxLength={40}
                />
              )}

              <View style={[spacings.mlMi]}>
                <AccountKeyIcons account={account} />
              </View>

              <AccountBadges accountData={account} />
            </View>
            <AccountAddress
              isLoading={isLoading}
              ens={ens}
              ud={ud}
              address={addr}
              plainAddressMaxLength={maxAccountAddrLength}
              skeletonAppearance={isHovered ? 'primaryBackground' : 'secondaryBackground'}
            />
          </View>
        </View>
        <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
          {renderRightChildren && renderRightChildren()}
          {isInSettings && (
            <AccountKeysBottomSheet
              sheetRef={sheetRef}
              associatedKeys={associatedKeys}
              importedAccountKeys={importedAccountKeys}
              closeBottomSheet={closeBottomSheet}
            />
          )}
          <Pressable onPress={promptRemoveAccount}>
            <LogOutIcon width={20} height={20} color={theme.secondaryText} />
          </Pressable>
        </View>
      </Animated.View>
      <Dialog
        dialogRef={dialogRef}
        id={`remove-account-${addr}`}
        title={t('Remove Account')}
        text={t('Are you sure you want to remove this account?')}
        closeDialog={closeDialog}
      >
        <DialogFooter horizontalAlignment="justifyEnd">
          <DialogButton text={t('Close')} type="secondary" onPress={() => closeDialog()} />
          <DialogButton
            disabled={isRemoveAccountLoading}
            text={t('Remove')}
            type="danger"
            onPress={removeAccount}
            style={spacings.ml}
          />
        </DialogFooter>
      </Dialog>
    </Pressable>
  )
}

export default React.memo(Account)
