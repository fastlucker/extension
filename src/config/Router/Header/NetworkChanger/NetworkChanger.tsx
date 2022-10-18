import networks, { NetworkType } from 'ambire-common/src/constants/networks'
import usePrevious from 'ambire-common/src/hooks/usePrevious'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native'
// Using the ScrollView from 'react-native' was working just fine on all iOS
// devices, but not for all Android devices. So using this ScrollView instance
// was the only way to achieve normal scrolling (dragging) behavior for
// Samsung Galaxy S20 for example.
// {@link https://stackoverflow.com/a/66166811/1333836}
import { ScrollView } from 'react-native-gesture-handler'

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
  const prevNetworkId = usePrevious(network?.chainId)

  const allVisibleNetworks = useMemo(
    () => networks.filter((n) => !n.hide).filter((n) => isRelayerless || !n.relayerlessOnly),
    []
  )

  const currentNetworkIndex = useMemo(
    () => allVisibleNetworks.map((n) => n.chainId).indexOf(network?.chainId || 0),
    [network?.chainId, allVisibleNetworks]
  )

  useEffect(() => {
    // There is a bug in React Native with the `contentOffset` prop.
    // It doesn't work on Android only. So this is a workaround - use the
    // `scrollTo` method instead to scroll to the current network.
    // TODO: When migrating to Expo SDK v46 and React Native 0.69.0,
    // double-check if this is still needed, because it looks like there is a
    // fix which pinpoints a similar issue reported, see:
    // {@link https://github.com/facebook/react-native/issues/30533#issuecomment-1178109921}
    if (isAndroid) {
      scrollRef?.current?.scrollTo({
        x: 0,
        y: SINGLE_ITEM_HEIGHT * currentNetworkIndex,
        animated: true
      })
    }
  }, [scrollRef, currentNetworkIndex])

  const handleChangeNetwork = useCallback(
    (_network: NetworkType) => {
      if (!_network) return
      // if (_network.chainId === network?.chainId) return
      if (_network.chainId === prevNetworkId) return

      setNetwork(_network.chainId)
      addToast(t('Network changed to {{network}}', { network: _network.name }) as string, {
        timeout: 3000
      })
    },
    [prevNetworkId, setNetwork, addToast, t]
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

      /**
       * Calling `.scrollTo` on Android doesn't trigger the `onMomentumScrollEnd`
       * event. So this additional handler is needed, only for Android,
       * {@link https://stackoverflow.com/a/46788635/1333836}
       */
      if (isAndroid) {
        handleChangeNetwork(allVisibleNetworks[itemIndex])
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
          // Note: when the scroll happens programmatically (via .scrollTo),
          // this event gets fired for iOS only.
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
