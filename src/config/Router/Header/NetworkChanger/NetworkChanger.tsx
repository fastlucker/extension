import { NetworkType } from 'ambire-common/src/constants/networks'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, TouchableOpacity, View } from 'react-native'

import NetworkIcon from '@modules/common/components/NetworkIcon'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useNetwork from '@modules/common/hooks/useNetwork'
import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import styles, { SINGLE_ITEM_HEIGHT } from './styles'

interface Props {
  closeBottomSheet: () => void
}

const NetworkChanger: React.FC<Props> = ({ closeBottomSheet }) => {
  const { t } = useTranslation()
  const { network, setNetwork, allNetworks } = useNetwork()

  const handleChangeNetwork = (chainId: any) => {
    setNetwork(chainId)
    closeBottomSheet()
  }

  const renderNetwork = ({ name, chainId, id }: NetworkType, i: number) => {
    // TODO:
    // const isActive = chainId === network?.chainId
    const isActive = false
    const isLast = i + 1 === allNetworks.length

    return (
      <TouchableOpacity
        key={chainId}
        onPress={() => handleChangeNetwork(chainId)}
        style={[
          styles.networkBtnContainer,
          isActive && styles.networkBtnContainerActive,
          isLast && spacings.mbTy
        ]}
      >
        <Text
          weight="regular"
          color={isActive ? colors.titan : colors.titan_50}
          style={[flexboxStyles.flex1, textStyles.center]}
          numberOfLines={1}
        >
          {name}
        </Text>
        <View style={styles.networkBtnIcon}>
          <NetworkIcon name={id} />
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <>
      <Title style={textStyles.center} type="small">
        {t('Change network')}
      </Title>
      <View style={styles.networksContainer}>
        <View style={styles.networkBtnContainerActive} />
        <ScrollView
          pagingEnabled
          snapToInterval={SINGLE_ITEM_HEIGHT}
          contentContainerStyle={{
            paddingTop: SINGLE_ITEM_HEIGHT * 2,
            paddingBottom: SINGLE_ITEM_HEIGHT * 2
          }}
        >
          {allNetworks.map(renderNetwork)}
        </ScrollView>
      </View>
    </>
  )
}

export default NetworkChanger
