import ERC721Abi from 'ambire-common/src/constants/abis/ERC721Abi'
import networks from 'ambire-common/src/constants/networks'
import { getProvider } from 'ambire-common/src/services/provider'
import { ethers } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import FastImage from 'react-native-fast-image'

import LeftArrowIcon from '@assets/svg/LeftArrowIcon'
import CONFIG from '@config/env'
import { useTranslation } from '@config/localization'
import Blockies from '@modules/common/components/Blockies'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import NavIconWrapper from '@modules/common/components/NavIconWrapper'
import Panel from '@modules/common/components/Panel'
import Spinner from '@modules/common/components/Spinner'
import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import useAccounts from '@modules/common/hooks/useAccounts'
import useToast from '@modules/common/hooks/useToast'
import { fetchGet } from '@modules/common/services/fetch'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import handleCollectibleUri from '@modules/dashboard/helpers/handleCollectibleUri'
import { useNavigation, useRoute } from '@react-navigation/native'

import styles from './styles'

const CollectibleScreen = () => {
  const { goBack } = useNavigation()
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { params } = useRoute()
  const { tokenId, network, address: collectionAddr }: any = params
  const [isLoading, setLoading] = useState(true)
  const { selectedAcc } = useAccounts()
  const [isAssetImageLoading, setIsAssetImageLoading] = useState(true)
  const [metadata, setMetadata] = useState<any>({
    owner: {
      address: '',
      icon: ''
    },
    name: '',
    description: '',
    image: '',
    collection: '',
    explorerUrl: ''
  })

  const handleNavigateBack = () => {
    goBack()
  }

  const fetchMetadata = useCallback(async () => {
    setLoading(true)
    setMetadata({})

    try {
      const networkDetails = networks.find(({ id }) => id === network)
      if (!networkDetails) throw new Error('This network is not supported')

      const { explorerUrl } = networkDetails
      const provider = getProvider(networkDetails.id)
      const contract = new ethers.Contract(collectionAddr, ERC721Abi, provider)

      const [collection, address, maybeUri1, maybeUri2] = await Promise.all([
        contract.name(),
        contract.ownerOf(tokenId),
        contract
          .tokenURI(tokenId)
          .then((uri: any) => ({ uri }))
          .catch((err: any) => ({ err })),
        contract
          .uri(tokenId)
          .then((uri: any) => ({ uri }))
          .catch((err: any) => ({ err }))
      ])
      const uri = maybeUri1.uri || maybeUri2.uri
      if (!uri) throw maybeUri1.err || maybeUri2.err

      let json: any = {}

      if (uri.startsWith('data:application/json')) {
        json = JSON.parse(uri.replace('data:application/json;utf8,', ''))
      } else {
        const jsonUrl = handleCollectibleUri(uri)
        const response = await fetch(jsonUrl)
        json = await response.json()
      }

      const image = json ? handleCollectibleUri(json?.image) : null
      // eslint-disable-next-line @typescript-eslint/no-shadow
      setMetadata((metadata: any) => ({
        ...metadata,
        ...json,
        image
      }))

      // eslint-disable-next-line @typescript-eslint/no-shadow
      setMetadata((metadata: any) => ({
        ...metadata,
        collection,
        owner: {
          address
          // icon: blockies.create({ seed: address }).toDataURL()
        },
        explorerUrl
      }))

      setLoading(false)
    } catch (e) {
      try {
        const { success, collection, description, image, name, owner, message } = await fetchGet(
          `${CONFIG.VELCRO_API_ENDPOINT}/nftmeta/${collectionAddr}/${tokenId}?network=${network}`
        )
        if (!success) throw new Error(message)

        const networkDetails = networks.find(({ id }) => id === network)
        if (!networkDetails) throw new Error('This network is not supported')

        const { explorerUrl } = networkDetails
        // eslint-disable-next-line @typescript-eslint/no-shadow
        setMetadata((metadata: any) => ({
          ...metadata,
          collection,
          description,
          image,
          name,
          owner: {
            address: owner
            // icon: blockies.create({ seed: owner }).toDataURL()
          },
          explorerUrl
        }))

        setLoading(false)
        // eslint-disable-next-line @typescript-eslint/no-shadow
      } catch (e) {
        console.error(e)
        addToast(`Collectible error: ${e.message || e}`, { error: true })
      }
    }
  }, [addToast, tokenId, collectionAddr, network])

  useEffect(() => {
    fetchMetadata()
  }, [fetchMetadata])

  const collectibleContent = (
    <>
      <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
        <NavIconWrapper onPress={handleNavigateBack} style={spacings.mrSm}>
          <LeftArrowIcon />
        </NavIconWrapper>
        <View style={flexboxStyles.flex1}>
          <Text weight="regular" numberOfLines={1} fontSize={14}>
            {metadata.collection || t('Unknown')}
          </Text>
          <Text weight="regular" numberOfLines={1} fontSize={14}>
            #{tokenId}
          </Text>
        </View>
      </View>
      <View style={styles.contractAddressWrapper}>
        <Text fontSize={10} color={colors.chetwode}>
          {t('Contract address:')}
        </Text>
        <Text fontSize={10} color={colors.chetwode} ellipsizeMode="middle" numberOfLines={1}>
          {collectionAddr}
        </Text>
      </View>
      <View style={[flexboxStyles.directionRow, spacings.mbTy]}>
        <View>
          {!!isAssetImageLoading && (
            <View style={styles.collectibleImageLoadingWrapper}>
              <Spinner />
            </View>
          )}
          <FastImage
            style={styles.collectibleImage}
            source={{ uri: handleCollectibleUri(metadata.image) }}
            onLoad={() => setIsAssetImageLoading(false)}
            onError={() => setIsAssetImageLoading(false)}
          />
        </View>
        <View style={flexboxStyles.flex1}>
          <Text numberOfLines={2} weight="regular" fontSize={14} style={spacings.mbTy}>
            {metadata.name}
          </Text>
          <Text numberOfLines={7} weight="regular" fontSize={10}>
            {metadata.description}
          </Text>
        </View>
      </View>
      <View>
        <Text fontSize={12} style={spacings.mbMi}>
          {t('Owner: ')}
        </Text>
        <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
          <View style={spacings.mrMi}>
            <Blockies borderRadius={50} size={8} scale={2} seed={metadata?.owner?.address} />
          </View>
          {metadata?.owner?.address === selectedAcc ? (
            <Text>
              <Text fontSize={10}>{'You '}</Text>
              <Text fontSize={10} numberOfLines={1}>{`(${metadata?.owner?.address})`}</Text>
            </Text>
          ) : (
            <Text fontSize={10}>{metadata?.owner?.address}</Text>
          )}
        </View>
      </View>
    </>
  )

  return (
    <GradientBackgroundWrapper>
      <Wrapper hasBottomTabNav>
        <Panel type="filled" style={{ minHeight: 304 }}>
          {!!isLoading && (
            <View style={[flexboxStyles.flex1, spacings.pbLg]}>
              <NavIconWrapper onPress={handleNavigateBack} style={spacings.mrSm}>
                <LeftArrowIcon />
              </NavIconWrapper>
              <View
                style={[
                  flexboxStyles.flex1,
                  flexboxStyles.alignCenter,
                  flexboxStyles.justifyCenter
                ]}
              >
                <Spinner />
              </View>
            </View>
          )}
          {!isLoading && collectibleContent}
        </Panel>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default CollectibleScreen
