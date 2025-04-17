import React, { ReactElement, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, View } from 'react-native'

import Button from '@common/components/Button'
import Panel, { PanelBackButton, PanelTitle } from '@common/components/Panel/Panel'
import Text from '@common/components/Text'
import usePrevious from '@common/hooks/usePrevious'
import useTheme from '@common/hooks/useTheme'
import useOnboardingNavigation from '@common/modules/auth/hooks/useOnboardingNavigation'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import useAccountPickerControllerState from '@web/hooks/useAccountPickerControllerState'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import Account from '@web/modules/account-select/components/Account'

const SavedSeedPhrases = ({ handleClose }: { handleClose: () => void }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { accounts } = useAccountsControllerState()
  const { seeds, keys } = useKeystoreControllerState()
  const { dispatch } = useBackgroundService()
  const { subType, isInitialized } = useAccountPickerControllerState()
  const prevIsInitialized = usePrevious(isInitialized)
  const { goToNextRoute } = useOnboardingNavigation()

  useEffect(() => {
    if (!prevIsInitialized && isInitialized && subType === 'seed') {
      goToNextRoute(WEB_ROUTES.accountPersonalize)
    }
  }, [goToNextRoute, dispatch, isInitialized, prevIsInitialized, subType])

  const getAccountsForSeed = useCallback(
    (seedId: string) => {
      const keysFromSeed = keys.filter((k) => k.meta.fromSeedId === seedId)
      const keysFromSeedAddr = keysFromSeed.map(({ addr }) => addr)
      return accounts.filter((a) => a.associatedKeys.some((k) => keysFromSeedAddr.includes(k)))
    },
    [keys, accounts]
  )

  const handleAddAddressFromSeed = useCallback(
    (id: string) => {
      dispatch({
        type: 'MAIN_CONTROLLER_ACCOUNT_PICKER_INIT_FROM_SAVED_SEED_PHRASE',
        params: { id }
      })
    },
    [dispatch]
  )

  const renderItem = ({ item }: any): ReactElement<any, any> => (
    <Panel spacingsSize="small" style={spacings.mbTy}>
      <Text weight="medium" numberOfLines={1} style={spacings.mbLg}>
        {item.label}
      </Text>
      {getAccountsForSeed(item.id).map((a) => {
        return (
          <Account
            key={a.addr}
            account={a}
            withSettings={false}
            isSelectable={false}
            containerStyle={{
              borderWidth: 1,
              borderColor: theme.secondaryBorder,
              backgroundColor: theme.primaryBackground
            }}
            withKeyType={false}
          />
        )
      })}
      <View style={spacings.ptMd}>
        <Button
          text={t('+ Add address')}
          hasBottomSpacing={false}
          onPress={() => handleAddAddressFromSeed(item.id)}
        />
      </View>
    </Panel>
  )

  return (
    <View style={[spacings.ptSm, flexbox.flex1]}>
      <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbLg]}>
        <PanelBackButton onPress={handleClose} style={spacings.mr} />
        <PanelTitle title={t('Add from current recovery phrase')} style={text.left} />
      </View>
      <FlatList data={seeds} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </View>
  )
}

export default React.memo(SavedSeedPhrases)
