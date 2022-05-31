import { NetworkType } from 'ambire-common/src/constants/networks'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'

import NetworkIcon from '@modules/common/components/NetworkIcon'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useNetwork from '@modules/common/hooks/useNetwork'
import useToast from '@modules/common/hooks/useToast'
import { colorPalette as colors } from '@modules/common/styles/colors'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import styles, { SINGLE_ITEM_HEIGHT } from './styles'

interface Props {
  closeBottomSheet: () => void
}

const NetworkChanger: React.FC<Props> = ({ closeBottomSheet }) => {
  const { t } = useTranslation()
  const { network, setNetwork, allNetworks } = useNetwork()
  const { addToast } = useToast()

  const currentNetworkIndex = useMemo(
    () => allNetworks.map((n) => n.chainId).indexOf(network?.chainId || 0),
    [network?.chainId]
  )

  const handleChangeNetwork = useCallback(
    (_network: NetworkType) => {
      if (!_network) return
      if (_network.chainId === network?.chainId) return

      setNetwork(_network.chainId)
      addToast(t('Network changed to {{network}}', { network: _network.name }) as string, {
        timeout: 2500
      })
      // Closing the bottom sheet immediately is kind of cool,
      // but sometimes it's not really clear what happens. Therefore, skip it.
      // closeBottomSheet()
    },
    [network?.chainId, setNetwork, addToast]
  )

  const handleChangeNetworkByScrolling = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      // Get the currently selected network index, based on the idea from this
      // thread, but implemented vertically and based on our fixed item height.
      // {@link https://stackoverflow.com/a/56736109/1333836}
      const index = event.nativeEvent.contentOffset.y / SINGLE_ITEM_HEIGHT
      const selectedNetwork = allNetworks[index]

      return handleChangeNetwork(selectedNetwork)
    },
    [handleChangeNetwork, allNetworks.length]
  )

  const renderNetwork = (_network: NetworkType) => {
    const isActive = _network.chainId === network?.chainId

    const handleChangeNetworkByPressing = () => handleChangeNetwork(_network)

    return (
      <TouchableOpacity
        key={_network.chainId}
        style={[styles.networkBtnContainer]}
        onPress={handleChangeNetworkByPressing}
      >
        <Text
          weight="regular"
          color={isActive ? colors.titan : colors.titan_50}
          style={[flexboxStyles.flex1, textStyles.center]}
          numberOfLines={1}
        >
          {_network.name}
        </Text>
        <View style={styles.networkBtnIcon}>
          <NetworkIcon name={_network.id} />
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
          contentOffset={{
            y: SINGLE_ITEM_HEIGHT * currentNetworkIndex,
            x: 0
          }}
          contentContainerStyle={{
            paddingTop: SINGLE_ITEM_HEIGHT * 2,
            paddingBottom: SINGLE_ITEM_HEIGHT * 2
          }}
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={handleChangeNetworkByScrolling}
          scrollEventThrottle={16}
        >
          {allNetworks.map(renderNetwork)}
        </ScrollView>
      </View>
    </>
  )
}

export default NetworkChanger
