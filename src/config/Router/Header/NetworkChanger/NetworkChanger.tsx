import { NetworkType } from 'ambire-common/src/constants/networks'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from 'react-native'

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
  const [pos, setPos] = React.useState(0)
  const { network, setNetwork, allNetworks } = useNetwork()

  const handleChangeNetwork = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Get the currently selected network index, based on the idea from this
    // thread, but implemented vertically and based on our fixed item height.
    // {@link https://stackoverflow.com/a/56736109/1333836}
    const index = event.nativeEvent.contentOffset.y / SINGLE_ITEM_HEIGHT
    const selectedNetwork = allNetworks[index]

    if (selectedNetwork) {
      setNetwork(selectedNetwork.chainId)
      closeBottomSheet()
    }
  }

  const renderNetwork = ({ name, chainId, id }: NetworkType, i: number) => {
    // TODO:
    // const isActive = chainId === network?.chainId

    return (
      <View key={chainId} style={[styles.networkBtnContainer]}>
        <Text
          weight="regular"
          color={colors.titan_50}
          style={[flexboxStyles.flex1, textStyles.center]}
          numberOfLines={1}
        >
          {name}
        </Text>
        <View style={styles.networkBtnIcon}>
          <NetworkIcon name={id} />
        </View>
      </View>
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
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={handleChangeNetwork}
          scrollEventThrottle={16}
        >
          {allNetworks.map(renderNetwork)}
        </ScrollView>
      </View>
    </>
  )
}

export default NetworkChanger
