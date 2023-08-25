import React from 'react'
import { Image, Pressable, View } from 'react-native'

import avatarSpace from '@common/assets/images/avatars/avatar-space.png'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import TabHeader from '@web/modules/router/components/TabHeader'

// todo: move to utils
const trimAddress = (address: string, maxLength: number) => {
  if (address.length <= maxLength) {
    return address
  }

  const prefixLength = Math.floor((maxLength - 3) / 2)
  const suffixLength = Math.ceil((maxLength - 3) / 2)

  const prefix = address.slice(0, prefixLength)
  const suffix = address.slice(-suffixLength)

  return `${prefix}...${suffix}`
}

const AccountSelectScreen = () => {
  const mainCtrl = useMainControllerState()
  const { dispatch } = useBackgroundService()
  console.log(mainCtrl, mainCtrl.accounts)
  const { t } = useTranslation()

  const selectAccount = (addr) => {
    dispatch({
      type: 'MAIN_CONTROLLER_SELECT_ACCOUNT',
      params: { accountAddr: addr }
    })
  }

  return (
    <View style={[flexboxStyles.flex1]}>
      <TabHeader forceCanGoBack />
      <Wrapper>
        <View>
          {mainCtrl.accounts.length &&
            mainCtrl.accounts.map((account) => (
              <Pressable key={account.addr} onPress={() => selectAccount(account.addr)}>
                {({ hovered }: any) => (
                  <View
                    style={[
                      flexboxStyles.directionRow,
                      spacings.phMi,
                      spacings.pvMi,
                      spacings.mbTy,
                      {
                        borderWidth: 1,
                        borderRadius: 12,
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
                    <View style={[spacings.mrTy, flexboxStyles.justifyCenter]}>
                      <Image
                        style={{ width: 30, height: 30, borderRadius: 10 }}
                        source={avatarSpace}
                        resizeMode="contain"
                      />
                    </View>
                    <View>
                      <Text
                        fontSize={12}
                        weight="regular"
                        color={account.creation ? colors.greenHaze : colors.brownRum}
                      >
                        {trimAddress(account.addr, 25)}
                      </Text>
                      <Text fontSize={12} weight="semiBold">
                        {t('Account label')}
                      </Text>
                    </View>
                  </View>
                )}
              </Pressable>
            ))}
        </View>
      </Wrapper>
    </View>
  )
}

export default AccountSelectScreen
