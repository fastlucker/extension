import groupBy from 'lodash/groupBy'
import React, { useCallback, useMemo, useState } from 'react'
import { Pressable, TouchableOpacity, View } from 'react-native'

import { HD_PATHS, HDPath } from '@ambire-common/consts/derivation'
import AccountAdderController from '@ambire-common/controllers/accountAdder/accountAdder'
import { Account as AccountInterface } from '@ambire-common/interfaces/account'
import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import LeftDoubleArrowIcon from '@common/assets/svg/LeftDoubleArrowIcon.tsx'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import RightDoubleArrowIcon from '@common/assets/svg/RightDoubleArrowIcon'
import Button from '@common/components/Button'
import NavIconWrapper from '@common/components/NavIconWrapper'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import Toggle from '@common/components/Toggle'
import Wrapper from '@common/components/Wrapper'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import Account from '@web/modules/account-adder/components/Account'
import Slot from '@web/modules/account-adder/components/Slot'

import styles from './styles'

const LIST_ITEM_HEIGHT = 76
const LIST_ITEM_GUTTER = 10
export const SMALL_PAGE_STEP = 1
export const LARGE_PAGE_STEP = 10

const AccountsList = ({
  isSubmitting = false,
  state,
  onImportReady,
  enableCreateEmailVault,
  onCreateEmailVaultStep,
  setPage
}: {
  isSubmitting?: boolean
  state: AccountAdderController
  onImportReady: () => void
  enableCreateEmailVault?: boolean
  onCreateEmailVaultStep?: () => void
  setPage: (page: number) => void
}) => {
  const { t } = useTranslation()
  const [emailVaultStep, setEmailVaultStep] = useState(false)
  // const [showUnused, setShowUnused] = useState(false)
  const { dispatch } = useBackgroundService()

  const getDerivationLabel = (_path: HDPath['path']) => {
    const path = HD_PATHS.find((x) => x.path === _path)

    return path ? path.label : _path
  }

  const slots = useMemo(() => {
    return groupBy(state.accountsOnPage, 'slot')
  }, [state.accountsOnPage])

  const handleSmallPageStepDecrement = () => {
    setPage(state.page - SMALL_PAGE_STEP)
  }

  const handleSmallPageStepIncrement = () => {
    setPage(state.page + SMALL_PAGE_STEP)
  }

  const handleLargePageStepDecrement = () => {
    setPage(state.page - LARGE_PAGE_STEP)
  }

  const handleLargePageStepIncrement = () => {
    setPage(state.page + LARGE_PAGE_STEP)
  }

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

  const getAccounts = (accounts: any) => {
    return accounts.map((acc: any, i: any) => {
      const isSelected = state.selectedAccounts.some(
        (selectedAcc) => selectedAcc.addr === acc.account.addr
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
          unused={!acc.account.creation && !acc.account.usedOnNetworks.length}
          isSelected={isSelected || isPreselected}
          isDisabled={isPreselected}
          onSelect={handleSelectAccount}
          onDeselect={handleDeselectAccount}
        />
      )
    })
  }

  return (
    <View>
      <View style={[flexbox.alignCenter]}>
        {enableCreateEmailVault && (
          <Toggle
            isOn={emailVaultStep}
            onToggle={() => {
              setEmailVaultStep(true)
              onCreateEmailVaultStep && onCreateEmailVaultStep()
            }}
            label={t('Enable email recovery for new Smart Accounts')}
          />
        )}
        <Wrapper
          contentContainerStyle={{
            ...spacings.pv0,
            ...spacings.ph0
          }}
        >
          {/* TODO: impl change derivation and move this into a separate component */}
          {state.accountsLoading ? null : (
            <Pressable style={styles.derivationButton} disabled>
              <View style={styles.derivationButtonInfo}>
                <Text weight="medium" fontSize={14}>
                  {state.hdPathTemplate && getDerivationLabel(state.hdPathTemplate)}{' '}
                </Text>
                <Text weight="medium" fontSize={14} color={colors.martinique_65}>
                  {state.hdPathTemplate}{' '}
                </Text>
              </View>
              <NavIconWrapper
                onPress={() => null}
                width={25}
                height={25}
                hoverBackground={colors.lightViolet}
                style={styles.derivationButtonRightIcon}
              >
                <RightArrowIcon width={26} height={26} withRect={false} />
              </NavIconWrapper>
            </Pressable>
          )}
          <Wrapper
            contentContainerStyle={{
              height: LIST_ITEM_HEIGHT * 5 + LIST_ITEM_GUTTER * 4,
              ...spacings.pt0,
              ...spacings.phSm
            }}
          >
            {state.accountsLoading ? (
              <View
                style={[
                  flexbox.alignCenter,
                  flexbox.flex1,
                  flexbox.alignCenter,
                  flexbox.justifyCenter
                ]}
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
        </Wrapper>

        <View
          style={[
            flexbox.alignCenter,
            spacings.ptSm,
            { opacity: state.linkedAccountsLoading ? 1 : 0 }
          ]}
        >
          <View style={[spacings.mbTy, flexbox.alignCenter, flexbox.directionRow]}>
            <Spinner style={{ width: 16, height: 16 }} />
            <Text color={colors.violet} style={[spacings.mlSm]} fontSize={12}>
              {t('Looking for linked smart accounts')}
            </Text>
          </View>
        </View>

        <View
          style={[flexbox.directionRow, flexbox.justifyCenter, flexbox.alignCenter, spacings.pv]}
        >
          <TouchableOpacity
            onPress={handleLargePageStepDecrement}
            disabled={state.page <= LARGE_PAGE_STEP || disablePagination}
            style={state.page <= (LARGE_PAGE_STEP || disablePagination) && { opacity: 0.6 }}
          >
            <LeftDoubleArrowIcon />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSmallPageStepDecrement}
            disabled={state.page === 1 || disablePagination}
            style={(state.page === 1 || disablePagination) && { opacity: 0.6 }}
          >
            <LeftArrowIcon width={36} height={36} style={[spacings.mlTy]} />
          </TouchableOpacity>
          <Text style={spacings.ph}>
            {state.page > 2 && <Text>{'...  '}</Text>}
            {state.page === 1 && (
              <Text>
                <Text weight="semiBold">{state.page}</Text>
                <Text>{`  ${state.page + 1}  ${state.page + 2}`}</Text>
              </Text>
            )}
            {state.page !== 1 && (
              <Text>
                <Text>{`  ${state.page - 1}  `}</Text>
                <Text weight="semiBold">{state.page}</Text>
                <Text>{`  ${state.page + 1}`}</Text>
              </Text>
            )}
            <Text>{'  ...'}</Text>
          </Text>
          <TouchableOpacity
            style={(state.accountsLoading || disablePagination) && { opacity: 0.6 }}
            disabled={state.accountsLoading || disablePagination}
            onPress={handleSmallPageStepIncrement}
          >
            <RightArrowIcon style={[spacings.mrTy]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={(state.accountsLoading || disablePagination) && { opacity: 0.6 }}
            disabled={state.accountsLoading || disablePagination}
            onPress={handleLargePageStepIncrement}
          >
            <RightDoubleArrowIcon />
          </TouchableOpacity>
        </View>
        <Button
          style={{ ...spacings.mtTy, width: 296, ...flexbox.alignSelfCenter }}
          onPress={onImportReady}
          disabled={
            state.accountsLoading ||
            isSubmitting ||
            (!state.selectedAccounts.length && !state.preselectedAccounts.length)
          }
          text={
            isSubmitting
              ? t('Importing...')
              : state.preselectedAccounts.length && !state.selectedAccounts.length
              ? t('Continue')
              : t('Import Accounts')
          }
        />
      </View>
    </View>
  )
}

export default React.memo(AccountsList)
