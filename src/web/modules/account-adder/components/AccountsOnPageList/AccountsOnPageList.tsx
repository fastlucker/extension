import groupBy from 'lodash/groupBy'
import React, { useCallback, useMemo, useState } from 'react'
import { Pressable, View } from 'react-native'

import { HD_PATHS, HDPath } from '@ambire-common/consts/derivation'
import AccountAdderController from '@ambire-common/controllers/accountAdder/accountAdder'
import { Account as AccountInterface } from '@ambire-common/interfaces/account'
import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import Pagination from '@common/components/Pagination'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import { useTranslation } from '@common/config/localization'
import spacings, { IS_SCREEN_SIZE_DESKTOP_LARGE } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import Account from '@web/modules/account-adder/components/Account'
import Slot from '@web/modules/account-adder/components/Slot'
import { HARDWARE_WALLET_DEVICE_NAMES } from '@web/modules/hardware-wallet/constants/names'

import styles from './styles'

const AccountsList = ({
  state,
  setPage,
  keyType
}: {
  state: AccountAdderController
  setPage: (page: number) => void
  keyType: string
}) => {
  const { t } = useTranslation()
  const { dispatch } = useBackgroundService()
  const [containerHeight, setContainerHeight] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)

  const getDerivationLabel = (_path: HDPath['path']) => {
    const path = HD_PATHS.find((x) => x.path === _path)

    return path ? path.label : _path
  }

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

  const setType = (acc: any) => {
    if (!acc.account.creation) return 'legacy'
    if (acc.isLinked) return 'linked'

    return 'smart'
  }

  const hasScroll = useMemo(() => contentHeight > containerHeight, [contentHeight, containerHeight])

  const shouldEnablePagination = useMemo(() => Object.keys(slots).length >= 5, [slots])

  const getAccounts = (accounts: any) => {
    return accounts.map((acc: any, i: any) => {
      const isSelected = state.selectedAccounts.some(
        (selectedAcc) => selectedAcc.account.addr === acc.account.addr
      )
      const isPreselected = state.preselectedAccounts.some(
        (selectedAcc) => selectedAcc.addr === acc.account.addr
      )

      return (
        <Account
          key={acc.account.addr}
          account={acc.account}
          type={setType(acc)}
          isLastInSlot={i === accounts.length - 1}
          unused={!acc.account.usedOnNetworks.length}
          isSelected={isSelected || isPreselected}
          isDisabled={isPreselected}
          onSelect={handleSelectAccount}
          onDeselect={handleDeselectAccount}
        />
      )
    })
  }

  return (
    <View style={flexbox.flex1}>
      <View
        style={[
          spacings.mbLg,
          flexbox.directionRow,
          flexbox.alignCenter,
          flexbox.justifySpaceBetween,
          { minHeight: 40 }
        ]}
      >
        <Text
          fontSize={IS_SCREEN_SIZE_DESKTOP_LARGE ? 20 : 18}
          weight="medium"
          appearance="primaryText"
          numberOfLines={1}
          style={spacings.mrTy}
        >
          {keyType === 'internal'
            ? t('Pick Accounts To Import')
            : t('Import Account From {{ hwDeviceName }}', {
                hwDeviceName: HARDWARE_WALLET_DEVICE_NAMES[keyType]
              })}
        </Text>
        {/* TODO: impl change derivation and move this into a separate component */}
        {state.accountsLoading ? null : (
          <Pressable style={styles.derivationButton} disabled>
            <View style={styles.derivationButtonInfo}>
              <Text weight="medium" fontSize={14}>
                {state.hdPathTemplate && getDerivationLabel(state.hdPathTemplate)}{' '}
              </Text>
            </View>
            <DownArrowIcon />
          </Pressable>
        )}
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
            return (
              <Slot key={key} slot={+key}>
                {getAccounts(slots[key])}
              </Slot>
            )
          })
        )}
      </Wrapper>
      {!!shouldEnablePagination && (
        <Pagination
          page={state.page}
          setPage={setPage}
          isDisabled={state.accountsLoading || disablePagination}
        />
      )}
    </View>
  )
}

export default React.memo(AccountsList)
