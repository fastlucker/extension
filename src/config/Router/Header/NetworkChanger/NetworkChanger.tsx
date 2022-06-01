import { NetworkType } from 'ambire-common/src/constants/networks'
import React, { useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import Title from '@modules/common/components/Title'
import useNetwork from '@modules/common/hooks/useNetwork'
import useToast from '@modules/common/hooks/useToast'
import textStyles from '@modules/common/styles/utils/text'

import NetworkChangerItem from './NetworkChangerItem'
import styles, { SINGLE_ITEM_HEIGHT } from './styles'

interface Props {}

const NetworkChanger: React.FC<Props> = () => {
  const { t } = useTranslation()
  const { network, setNetwork, allNetworks } = useNetwork()
  const { addToast } = useToast()
  const scrollRef: any = useRef(null)

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

  const renderNetwork = (_network: NetworkType, idx: number) => {
    const isActive = _network.chainId === network?.chainId

    const handleChangeNetworkByPressing = useCallback((itemIndex: number) => {
      scrollRef?.current?.scrollTo({ x: 0, y: itemIndex * SINGLE_ITEM_HEIGHT, animated: true })
    }, [])

    return (
      <NetworkChangerItem
        key={_network.chainId}
        idx={idx}
        name={_network.name}
        iconName={_network.id}
        isActive={isActive}
        onPress={handleChangeNetworkByPressing}
      />
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
          ref={scrollRef}
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

export default React.memo(NetworkChanger)
