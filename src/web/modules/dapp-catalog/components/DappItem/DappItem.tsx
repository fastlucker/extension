import React from 'react'
import { useForm } from 'react-hook-form'
import { Image, View } from 'react-native'

import BackButton from '@common/components/BackButton'
import Search from '@common/components/Search'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { Dapp } from '@web/extension-services/background/controllers/dapps'

import getStyles from './styles'

const DappItem = ({ name, description, iconUrl }: Dapp) => {
  const { styles } = useTheme(getStyles)
  return (
    <View style={styles.container}>
      <Image source={{ uri: iconUrl }} style={styles.icon} />
      <Text>{name}</Text>
      <Text>{description}</Text>
    </View>
  )
}

export default React.memo(DappItem)
