import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Pressable, View } from 'react-native'

import { Account as AccountType } from '@ambire-common/interfaces/account'
import avatarSpace from '@common/assets/images/avatars/avatar-space.png'
import PinIcon from '@common/assets/svg/PinIcon'
import SettingsIcon from '@common/assets/svg/SettingsIcon'
import useNavigation from '@common/hooks/useNavigation/useNavigation.web'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import shortenAddress from '@web/utils/shortenAddress'

import CopyText from '../CopyText'
import Text from '../Text'
import styles from './styles'

interface Props {
  account: AccountType
  selectedAccount: string | null
}

const Account: FC<Props> = ({ account, selectedAccount }) => {
  const { addr, creation, associatedKeys } = account
  const isSmartAccount = !!creation
  const isViewOnlyAccount = !associatedKeys?.length

  const { t } = useTranslation()
  const { goBack } = useNavigation()
  const { dispatch } = useBackgroundService()

  const selectAccount = (selectedAccountAddr: string) => {
    dispatch({
      type: 'MAIN_CONTROLLER_SELECT_ACCOUNT',
      params: { accountAddr: selectedAccountAddr }
    })
    goBack()
  }

  return (
    <Pressable key={addr} onPress={() => selectAccount(addr)}>
      {({ hovered }: any) => (
        <View
          style={[
            styles.container,
            {
              borderColor: addr === selectedAccount || hovered ? colors.scampi_20 : 'transparent',
              backgroundColor:
                addr === selectedAccount || hovered ? colors.melrose_15 : 'transparent'
            }
          ]}
        >
          <View style={[flexbox.directionRow]}>
            <View style={[spacings.mrTy, flexbox.justifyCenter]}>
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
                color={isSmartAccount ? colors.greenHaze : colors.brownRum}
              >
                {shortenAddress(addr, 25)}
              </Text>
              <Text fontSize={12} weight="semiBold">
                {t('Account label')}
              </Text>
            </View>
            <View style={isSmartAccount ? styles.greenLabel : styles.greyLabel}>
              <Text
                weight="regular"
                fontSize={10}
                numberOfLines={1}
                color={isSmartAccount ? colors.greenHaze : colors.brownRum}
              >
                {isSmartAccount ? 'Smart Account' : 'Legacy Account'}
              </Text>
            </View>
          </View>
          <View style={[flexbox.directionRow, flexbox.alignCenter]}>
            {isViewOnlyAccount ? (
              <View style={styles.blueLabel}>
                <Text weight="regular" fontSize={10} numberOfLines={1} color={colors.dodgerBlue}>
                  no key
                </Text>
              </View>
            ) : null}
            <CopyText
              text={addr}
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
  )
}

export default Account
