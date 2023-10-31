import React from 'react'
import { Image, View } from 'react-native'

import { Account } from '@ambire-common/interfaces/account'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import shortenAddress from '@web/utils/shortenAddress'

import styles from './styles'

type Props = {
  account?: Account
  network?: NetworkDescriptor
}

const Header = ({ account, network }: Props) => {
  const { t } = useTranslation()

  const isLoading = !account || !network
  if (isLoading) {
    return <View style={styles.container} />
  }

  return (
    <View style={styles.container}>
      <Image // TODO:
        source={{ uri: 'https://mars-images.imgix.net/nft/1629012092532.png?auto=compress&w=600' }}
        style={styles.image}
      />
      <View style={styles.addressContainer}>
        <Text fontSize={16} style={styles.address}>
          {shortenAddress(account.addr, 27)}
        </Text>
        <Text fontSize={16} weight="semiBold" style={styles.addressLabel}>
          {account.label}
        </Text>
      </View>
      <View style={styles.network}>
        <Text fontSize={14} style={styles.networkText}>
          {t('on')}
        </Text>
        <NetworkIcon name={network.id as any} />
        <Text fontSize={14} style={styles.networkText}>
          {network.name}
        </Text>
      </View>
    </View>
  )
}

export default Header
