import networks, { NetworkType } from 'ambire-common/src/constants/networks'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from 'react-native'

import Title from '@modules/common/components/Title'
import useNetwork from '@modules/common/hooks/useNetwork'
import useToast from '@modules/common/hooks/useToast'
import textStyles from '@modules/common/styles/utils/text'

import NetworkChangerItem from './NetworkChangerItem'
import styles, { SINGLE_ITEM_HEIGHT } from './styles'
import useWebOnScroll from './useWebOnScroll'

const NetworkChanger: React.FC = () => {
  const { t } = useTranslation()
  const { network, setNetwork } = useNetwork()
  const { addToast } = useToast()
  const scrollRef: any = useRef(null)
  // Flags, needed for the #(android/web)-onMomentumScrollEnd-fix
  const scrollY = useRef(0)
  const onScrollEndCallbackTargetOffset = useRef(-1)

  const allVisibleNetworks = useMemo(() => networks.filter((n) => !n.hide), [])

  const currentNetworkIndex = useMemo(
    () => allVisibleNetworks.map((n) => n.chainId).indexOf(network?.chainId || 0),
    [network?.chainId, allVisibleNetworks]
  )

  useEffect(() => {
    scrollRef?.current?.scrollTo({
      x: 0,
      y: SINGLE_ITEM_HEIGHT * currentNetworkIndex,
      animated: true
    })
  }, [])

  const handleChangeNetwork = useCallback(
    (_network: NetworkType) => {
      if (!_network) return
      if (_network.chainId === network?.chainId) return

      setNetwork(_network.chainId)
      addToast(t('Network changed to {{network}}', { network: _network.name }) as string, {
        timeout: 3000
      })
    },
    [network?.chainId, setNetwork, addToast, t]
  )

  const handleChangeNetworkByScrolling = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(Math.round(event.nativeEvent.contentOffset.y) / SINGLE_ITEM_HEIGHT)
      scrollRef?.current?.scrollTo({ x: 0, y: index * SINGLE_ITEM_HEIGHT, animated: true })

      return handleChangeNetwork(allVisibleNetworks[index])
    },
    [handleChangeNetwork, allVisibleNetworks]
  )

  const renderNetwork = (_network: NetworkType, idx: number) => {
    const isActive = _network.chainId === network?.chainId

    const handleChangeNetworkByPressing = useCallback((itemIndex: number) => {
      scrollRef?.current?.scrollTo({ x: 0, y: itemIndex * SINGLE_ITEM_HEIGHT, animated: true })
      onScrollEndCallbackTargetOffset.current = itemIndex * SINGLE_ITEM_HEIGHT
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

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent
    scrollY.current = contentOffset.y
  }

  const handleWebScroll = useWebOnScroll({ onScroll, onScrollEnd: handleChangeNetworkByScrolling })

  return (
    <>
      <Title style={textStyles.center} type="small">
        {t('Change network')}
      </Title>
      <View style={styles.networksContainer}>
        <View style={styles.networkBtnContainerActive} />
        <ScrollView
          ref={scrollRef}
          onScroll={handleWebScroll}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          <View
            style={{
              paddingTop: SINGLE_ITEM_HEIGHT * 2,
              paddingBottom: SINGLE_ITEM_HEIGHT * 2
            }}
          >
            {allVisibleNetworks.map(renderNetwork)}
          </View>
        </ScrollView>
      </View>
    </>
  )
}

export default React.memo(NetworkChanger)
