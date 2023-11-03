import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Image, Pressable, View } from 'react-native'

import avatarSpace from '@common/assets/images/avatars/avatar-space.png'
import PinIcon from '@common/assets/svg/PinIcon'
import SettingsIcon from '@common/assets/svg/SettingsIcon'
import CopyText from '@common/components/CopyText'
import Search from '@common/components/Search'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import shortenAddress from '@web/utils/shortenAddress'

import styles from './styles'

const AccountSelectScreen = () => {
  const { goBack } = useNavigation()
  const { control, watch } = useForm({
    mode: 'all',
    defaultValues: {
      search: ''
    }
  })
  const searchValue = watch('search')

  const mainCtrl = useMainControllerState()
  const { dispatch } = useBackgroundService()

  const { t } = useTranslation()

  const accounts = useMemo(
    () =>
      mainCtrl.accounts.filter((account) => {
        if (!searchValue) return true

        const doesAddressMatch = account.addr.toLowerCase().includes(searchValue.toLowerCase())
        const doesLabelMatch = account.label.toLowerCase().includes(searchValue.toLowerCase())
        const isSmartAccount = !!account?.creation
        const doesSmartAccountMatch =
          isSmartAccount && 'smart account'.includes(searchValue.toLowerCase())
        const doesLegacyAccountMatch =
          !isSmartAccount && 'legacy account'.includes(searchValue.toLowerCase())

        return doesAddressMatch || doesLabelMatch || doesSmartAccountMatch || doesLegacyAccountMatch
      }),
    [mainCtrl.accounts, searchValue]
  )

  const selectAccount = (addr: string) => {
    dispatch({
      type: 'MAIN_CONTROLLER_SELECT_ACCOUNT',
      params: { accountAddr: addr }
    })
    goBack()
  }

  return (
    <View style={[flexboxStyles.flex1, spacings.pv, spacings.ph]}>
      <View style={styles.container}>
        <Search control={control} placeholder="Search for accounts" style={styles.searchBar} />
      </View>

      <Wrapper contentContainerStyle={styles.container}>
        {accounts.length ? (
          accounts.map((account) => (
            <Pressable key={account.addr} onPress={() => selectAccount(account.addr)}>
              {({ hovered }: any) => (
                <View
                  style={[
                    styles.accountContainer,
                    {
                      borderColor:
                        account.addr === mainCtrl.selectedAccount || hovered
                          ? colors.scampi_20
                          : 'transparent',
                      backgroundColor:
                        account.addr === mainCtrl.selectedAccount || hovered
                          ? colors.melrose_15
                          : 'transparent'
                    }
                  ]}
                >
                  <View style={[flexboxStyles.directionRow]}>
                    <View style={[spacings.mrTy, flexboxStyles.justifyCenter]}>
                      <Image
                        style={{ width: 30, height: 30, borderRadius: 10 }}
                        source={avatarSpace}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={[spacings.mrTy]}>
                      <Text
                        fontSize={12}
                        weight="regular"
                        color={account.creation ? colors.greenHaze : colors.husk}
                      >
                        {shortenAddress(account.addr, 25)}
                      </Text>
                      <Text fontSize={12} weight="semiBold">
                        {t('Account label')}
                      </Text>
                    </View>
                    <View style={account.creation ? styles.greenLabel : styles.greyLabel}>
                      <Text
                        weight="regular"
                        fontSize={10}
                        numberOfLines={1}
                        color={account.creation ? colors.greenHaze : colors.husk}
                      >
                        {account.creation ? 'Smart Account' : 'Legacy Account'}
                      </Text>
                    </View>
                  </View>
                  <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
                    {account.associatedKeys.length === 0 ? (
                      <View style={styles.blueLabel}>
                        <Text
                          weight="regular"
                          fontSize={10}
                          numberOfLines={1}
                          color={colors.dodgerBlue}
                        >
                          no key
                        </Text>
                      </View>
                    ) : null}
                    <CopyText
                      text={account.addr}
                      iconColor={colors.martinique}
                      iconWidth={20}
                      iconHeight={20}
                      style={{
                        ...spacings.mrTy,
                        backgroundColor: 'transparent',
                        borderColor: 'transparent'
                      }}
                    />
                    <PinIcon style={[spacings.mr]} />
                    <SettingsIcon />
                  </View>
                </View>
              )}
            </Pressable>
          ))
        ) : (
          // @TODO: add a proper label
          <Text>No accounts found</Text>
        )}
      </Wrapper>
    </View>
  )
}

export default AccountSelectScreen
