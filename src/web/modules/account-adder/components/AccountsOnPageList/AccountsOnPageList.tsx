import { Mnemonic } from 'ethers'
import groupBy from 'lodash/groupBy'
import React, { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'

import AccountAdderController from '@ambire-common/controllers/accountAdder/accountAdder'
import { Account as AccountInterface } from '@ambire-common/interfaces/account'
import { isValidPrivateKey } from '@ambire-common/libs/keyIterator/keyIterator'
import Pagination from '@common/components/Pagination'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import Toggle from '@common/components/Toggle'
import Wrapper from '@common/components/Wrapper'
import { useTranslation } from '@common/config/localization'
import spacings, { IS_SCREEN_SIZE_DESKTOP_LARGE } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import Account from '@web/modules/account-adder/components/Account'
import { HARDWARE_WALLET_DEVICE_NAMES } from '@web/modules/hardware-wallet/constants/names'

const AccountsList = ({
  state,
  setPage,
  keyType,
  privKeyOrSeed,
  lookingForLinkedAccounts
}: {
  state: AccountAdderController
  setPage: (page: number) => void
  keyType: string
  privKeyOrSeed?: string
  lookingForLinkedAccounts: boolean
}) => {
  const { t } = useTranslation()
  const { dispatch } = useBackgroundService()
  const [containerHeight, setContainerHeight] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)
  const [hideEmptyAccounts, setHideEmptyAccounts] = useState(false)

  const slots = useMemo(() => {
    return groupBy(state.accountsOnPage, 'slot')
  }, [state.accountsOnPage])

  const handleSelectAccount = useCallback(
    (account: AccountInterface) => {
      dispatch({
        type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_SELECT_ACCOUNT',
        params: { account }
      })
    },
    [dispatch]
  )

  const handleDeselectAccount = useCallback(
    (account: AccountInterface) => {
      dispatch({
        type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_DESELECT_ACCOUNT',
        params: { account }
      })
    },
    [dispatch]
  )

  const disablePagination = Object.keys(slots).length === 1

  const getType = useCallback((acc: any) => {
    if (!acc.account.creation) return 'legacy'
    if (acc.isLinked) return 'linked'

    return 'smart'
  }, [])

  const legacyAccounts = useMemo(() => {
    if (lookingForLinkedAccounts) return []
    return state.accountsOnPage.filter((a) => getType(a) === 'linked')
  }, [state.accountsOnPage, getType, lookingForLinkedAccounts])

  const hasScroll = useMemo(() => contentHeight > containerHeight, [contentHeight, containerHeight])

  const shouldEnablePagination = useMemo(() => Object.keys(slots).length >= 5, [slots])

  const getAccounts = useCallback(
    (accounts: any, byType: ('legacy' | 'linked' | 'smart')[] = ['legacy', 'smart']) => {
      return accounts
        .filter((a: any) => byType.includes(getType(a)))
        .map((acc: any, i: any) => {
          const isSelected = state.selectedAccounts.some(
            (selectedAcc) => selectedAcc.account.addr === acc.account.addr
          )
          const isPreselected = state.preselectedAccounts.some(
            (selectedAcc) => selectedAcc.addr === acc.account.addr
          )

          if (
            hideEmptyAccounts &&
            getType(acc) === 'legacy' &&
            !acc.account.usedOnNetworks.length
          ) {
            return null
          }

          return (
            <Account
              key={acc.account.addr}
              account={acc.account}
              type={getType(acc)}
              unused={!acc.account.usedOnNetworks.length}
              isSelected={isSelected || isPreselected}
              isDisabled={isPreselected}
              onSelect={handleSelectAccount}
              onDeselect={handleDeselectAccount}
            />
          )
        })
    },
    [
      handleDeselectAccount,
      handleSelectAccount,
      hideEmptyAccounts,
      state.preselectedAccounts,
      state.selectedAccounts,
      getType
    ]
  )

  const setTitle = useCallback(() => {
    if (keyType !== 'internal') {
      return t('Import Accounts From {{ hwDeviceName }}', {
        hwDeviceName: HARDWARE_WALLET_DEVICE_NAMES[keyType]
      })
    }

    if (privKeyOrSeed && Mnemonic.isValidMnemonic(privKeyOrSeed)) {
      return t('Import Accounts from Seed Phrase')
    }

    if (privKeyOrSeed && isValidPrivateKey(privKeyOrSeed)) {
      return t('Import Accounts from Private Key')
    }

    return t('Select Accounts To Import')
  }, [keyType, privKeyOrSeed, t])

  return (
    <View style={flexbox.flex1}>
      <Text
        fontSize={IS_SCREEN_SIZE_DESKTOP_LARGE ? 20 : 18}
        weight="medium"
        appearance="primaryText"
        numberOfLines={1}
        style={spacings.mb}
      >
        {setTitle()}
      </Text>

      <View style={[spacings.mbLg, flexbox.alignStart]}>
        <Toggle
          isOn={hideEmptyAccounts}
          onToggle={() => setHideEmptyAccounts((p) => !p)}
          label={t('Hide empty legacy accounts')}
          labelProps={{ appearance: 'secondaryText', weight: 'medium' }}
        />
      </View>
      <Wrapper
        style={shouldEnablePagination && spacings.mbLg}
        contentContainerStyle={{
          flexGrow: 1,
          ...spacings.pt0,
          ...spacings.pl0,
          ...spacings?.[hasScroll ? 'prSm' : 'pr0']
        }}
        onLayout={(e) => {
          setContainerHeight(e.nativeEvent.layout.height)
        }}
        onContentSizeChange={(_, height) => {
          setContentHeight(height)
        }}
      >
        {state.accountsLoading ? (
          <View
            style={[flexbox.alignCenter, flexbox.flex1, flexbox.alignCenter, flexbox.justifyCenter]}
          >
            <Spinner style={{ width: 28, height: 28 }} />
          </View>
        ) : (
          Object.keys(slots).map((key) => {
            return <View key={key}>{getAccounts(slots[key])}</View>
          })
        )}
      </Wrapper>
      <View style={[flexbox.directionRow, flexbox.justifySpaceBetween, flexbox.alignCenter]}>
        <View
          style={[
            flexbox.alignCenter,
            spacings.ptSm,
            { opacity: lookingForLinkedAccounts ? 1 : 0 }
          ]}
        >
          <View style={[spacings.mbTy, flexbox.alignCenter, flexbox.directionRow]}>
            <Spinner style={{ width: 16, height: 16 }} />
            <Text appearance="primary" style={[spacings.mlSm]} fontSize={12}>
              {t('Looking for linked smart accounts')}
            </Text>
          </View>
        </View>
        {!!shouldEnablePagination && (
          <Pagination
            page={state.page}
            setPage={setPage}
            isDisabled={state.accountsLoading || disablePagination}
          />
        )}
      </View>
    </View>
  )
}

export default React.memo(AccountsList)
