import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, View } from 'react-native'

// @ts-ignore
import avatarSpace from '@common/assets/images/avatars/avatar-space.png'
import AmbireLogoHorizontal from '@common/components/AmbireLogoHorizontal'
import NetworkIcon from '@common/components/NetworkIcon'
import { NetworkIconNameType } from '@common/components/NetworkIcon/NetworkIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'

import getStyles from './styles'

interface Props {
  networkName?: string
  networkId?: NetworkIconNameType
  selectedAccountAddr?: string
}
const Header: FC<Props> = ({ networkName, networkId, selectedAccountAddr }) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image style={styles.avatar} source={avatarSpace} resizeMode="contain" />
        <Text appearance="secondaryText" weight="medium" fontSize={16}>
          {t('Account label')}{' '}
        </Text>
        <Text appearance="primaryText" weight="medium" fontSize={16}>
          ({selectedAccountAddr}){' '}
        </Text>
        <View style={styles.network}>
          <Text appearance="secondaryText" weight="regular" fontSize={16}>
            {t('on')}{' '}
          </Text>
          <Text
            appearance="secondaryText"
            weight="regular"
            style={styles.networkName}
            fontSize={16}
          >
            {networkName || t('Unknown network')}
          </Text>
          {networkId ? <NetworkIcon name={networkId} style={styles.networkIcon} /> : null}
        </View>
      </View>
      <AmbireLogoHorizontal />
    </View>
  )
}

export default Header
