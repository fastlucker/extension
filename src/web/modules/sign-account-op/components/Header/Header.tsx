import React from 'react'
import { Image, View } from 'react-native'

import { useTranslation } from '@common/config/localization'
import Text from '@common/components/Text'
import EthereumLogo from '@common/assets/svg/EthereumLogo'
import styles from './styles'

// @TODO - move to utils
const shortenAddress = (address: string) => `${address.slice(0, 11)}...${address.slice(-13)}`

const Header = () => {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://mars-images.imgix.net/nft/1629012092532.png?auto=compress&w=600' }}
        style={styles.image}
      />
      <View style={styles.addressContainer}>
        <Text style={styles.address}>
          {shortenAddress('0x5a2fae94BDaa7B30B6049b1f5c9C86C3E4fd212F')}
        </Text>
        <Text style={styles.addressLabel}>Account.Label.eth</Text>
      </View>
      <View style={styles.network}>
        <Text style={styles.networkText}>{t('on')}</Text>
        <EthereumLogo />
        <Text style={styles.networkText}>Ethereum</Text>
      </View>
    </View>
  )
}

export default Header
