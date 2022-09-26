import networks, { NetworkType } from 'ambire-common/src/constants/networks'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from 'react-native'

import { isAndroid, isRelayerless } from '@config/env'
import Title from '@modules/common/components/Title'
import useNetwork from '@modules/common/hooks/useNetwork'
import useToast from '@modules/common/hooks/useToast'
import textStyles from '@modules/common/styles/utils/text'

import NetworkChangerItem from './NetworkChangerItem'
import styles, { SINGLE_ITEM_HEIGHT } from './styles'

const NetworkChanger: React.FC = () => {
  const { t } = useTranslation()
  const { network, setNetwork } = useNetwork()
  const { addToast } = useToast()
  const scrollRef: any = useRef(null)
  // Flags, needed for the #android-onMomentumScrollEnd-fix
  const scrollY = useRef(0)
  const onScrollEndCallbackTargetOffset = useRef(-1)

  const allVisibleNetworks = useMemo(
    () => networks.filter((n) => !n.hide).filter((n) => isRelayerless || !n.relayerlessOnly),
    []
  )

  const currentNetworkIndex = useMemo(
    () => allVisibleNetworks.map((n) => n.chainId).indexOf(network?.chainId || 0),
    [network?.chainId, allVisibleNetworks]
  )

  useEffect(() => {
    // FIXME: For some reason the `contentOffset` prop doesn't work on Android,
    // so we have to use the `scrollTo` method instead to scroll to the current network.
    // Could be a bug on the React Native side, because it was working just fine
    // with React Native v0.64.3 (Expo SDK v44), but fails
    // with v0.68.2 (Expo SDK v45). bug report:
    // {@link https://github.com/facebook/react-native/issues/33994}
    if (isAndroid) {
      scrollRef?.current?.scrollTo({
        x: 0,
        y: SINGLE_ITEM_HEIGHT * currentNetworkIndex,
        animated: true
      })
    }
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
      // Get the currently selected network index, based on the idea from this
      // thread, but implemented vertically and based on our fixed item height.
      // {@link https://stackoverflow.com/a/56736109/1333836}
      const index = event.nativeEvent.contentOffset.y / SINGLE_ITEM_HEIGHT
      const selectedNetwork = allVisibleNetworks[index]

      return handleChangeNetwork(selectedNetwork)
    },
    [handleChangeNetwork, allVisibleNetworks]
  )

  const renderNetwork = (_network: NetworkType, idx: number) => {
    const isActive = _network.chainId === network?.chainId

    const handleChangeNetworkByPressing = useCallback((itemIndex: number) => {
      scrollRef?.current?.scrollTo({ x: 0, y: itemIndex * SINGLE_ITEM_HEIGHT, animated: true })

      // Part of the #android-onMomentumScrollEnd-fix
      if (isAndroid) {
        onScrollEndCallbackTargetOffset.current = itemIndex * SINGLE_ITEM_HEIGHT
      }
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

  /**
   * Calling `.scrollTo` on Android doesn't trigger the `onMomentumScrollEnd`
   * event. So this additional handler is needed, only for Android,
   * in order to apply the #android-onMomentumScrollEnd-fix
   * that manually triggers `handleChangeNetworkByScrolling`.
   * {@link https://stackoverflow.com/a/46788635/1333836}
   */
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent
    scrollY.current = contentOffset.y

    if (contentOffset.y === onScrollEndCallbackTargetOffset.current) {
      handleChangeNetworkByScrolling(event)
    }
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
          onScroll={isAndroid ? onScroll : undefined}
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
          {allVisibleNetworks.map(renderNetwork)}
        </ScrollView>
      </View>
    </>
  )
}

export default React.memo(NetworkChanger)
