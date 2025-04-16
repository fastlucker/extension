import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, View } from 'react-native'

import Panel, { PanelBackButton, PanelTitle } from '@common/components/Panel/Panel'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import Account from '@web/modules/account-select/components/Account'

const SavedSeedPhrases = ({ handleClose }: { handleClose: () => void }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { accounts } = useAccountsControllerState()
  const { seeds, keys } = useKeystoreControllerState()

  const getAccountsForSeed = useCallback(
    (seedId: string) => {
      const keysFromSeed = keys.filter((k) => k.meta.fromSeedId === seedId)
      const keysFromSeedAddr = keysFromSeed.map(({ addr }) => addr)
      return accounts.filter((a) => a.associatedKeys.some((k) => keysFromSeedAddr.includes(k)))
    },
    [keys, accounts]
  )

  const renderItem = ({ item }: any): ReactElement<any, any> => (
    <Panel spacingsSize="small">
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
    </Panel>
  )

  return (
    <View style={[spacings.ptSm, flexbox.flex1]}>
      <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbLg]}>
        <PanelBackButton onPress={handleClose} style={spacings.mr} />
        <PanelTitle title={t('Add from current recovery phrase')} style={text.left} />
      </View>

      <View style={flexbox.flex1}>
        <FlatList data={seeds} renderItem={renderItem} keyExtractor={(item) => item.id} />
      </View>
    </View>
  )
}

export default React.memo(SavedSeedPhrases)
