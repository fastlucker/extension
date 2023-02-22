import networks, { NetworkType } from 'ambire-common/src/constants/networks'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import { isRelayerless } from '@config/env'
import Title from '@modules/common/components/Title'
import useExtensionWallet from '@modules/common/hooks/useExtensionWallet'
import useNetwork from '@modules/common/hooks/useNetwork'
import textStyles from '@modules/common/styles/utils/text'
import { delayPromise } from '@modules/common/utils/promises'
import { isExtension } from '@web/constants/browserapi'

import NetworkChangerItem from './NetworkChangerItem'
import styles, { SINGLE_ITEM_HEIGHT } from './styles'

interface Props {
  closeBottomSheet?: () => void
}

const NetworkChanger: React.FC<Props> = ({ closeBottomSheet = () => {} }) => {
  const { t } = useTranslation()
  const { network, setNetwork } = useNetwork()
  const scrollRef: any = useRef(null)
  const { extensionWallet } = useExtensionWallet()

  const allVisibleNetworks = useMemo(
    () => networks.filter((n) => !n.hide).filter((n) => isRelayerless || !n.relayerlessOnly),
    []
  )

  const currentNetworkIndex = useMemo(
    () => allVisibleNetworks.map((n) => n.chainId).indexOf(network?.chainId || 0),
    [network?.chainId, allVisibleNetworks]
  )

  useEffect(() => {
    scrollRef?.current?.scrollTo({
      x: 0,
      // The magic number `-2` is due to the top padding (or lack of it),
      // which is happening only in the web context of this component.
      y: SINGLE_ITEM_HEIGHT * (currentNetworkIndex - 2),
      animated: true
    })
  }, [])

  const handleChangeNetwork = useCallback(
    async (_network: NetworkType) => {
      if (!_network) return
      if (_network.chainId === network?.chainId) return

      setNetwork(_network.chainId)
      if (isExtension) {
        extensionWallet!.networkChange(_network)

        // Slight delay, so that the network selection animation executes,
        // giving visual feedback to the user that the network has changed.
        await delayPromise(200)
        closeBottomSheet()
      }
    },
    [network?.chainId, setNetwork, extensionWallet, closeBottomSheet]
  )

  const renderNetwork = (_network: NetworkType, idx: number) => {
    const isActive = _network.chainId === network?.chainId

    return (
      <NetworkChangerItem
        key={_network.chainId}
        idx={idx}
        name={_network.name}
        iconName={_network.id}
        isActive={isActive}
        onPress={() => handleChangeNetwork(_network)}
      />
    )
  }

  return (
    <>
      <Title style={textStyles.center} type="small">
        {t('Change network')}
      </Title>
      <View style={styles.networksContainer}>
        <ScrollView ref={scrollRef}>{allVisibleNetworks.map(renderNetwork)}</ScrollView>
      </View>
    </>
  )
}

export default React.memo(NetworkChanger)
