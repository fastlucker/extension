import { Collectible as CollectibleType } from 'ambire-common/src/libs/portfolio/interfaces'
import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Pressable, View, ViewStyle } from 'react-native'

import SendIcon from '@common/assets/svg/SendIcon'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation/useNavigation.web'
import { handleCollectibleUri } from '@common/modules/dashboard/components/Collectibles/Collection/Collection'
import { ROUTES } from '@common/modules/router/constants/common'
import { fetchCaught } from '@common/services/fetch'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import { storage } from '@web/extension-services/background/webapi/storage'
import { getUiType } from '@web/utils/uiType'

import styles from './styles'

const fetchCollectible = async (url: string): Promise<CollectibleData | null> =>
  fetchCaught(url).then((resp) => {
    const body = resp.body

    if (typeof body !== 'object' || body === null || !('image' in body)) return null

    return resp.body as CollectibleData
  })

interface CollectibleData {
  image: string
  name: string
  description: string
}

type Props = CollectibleType & {
  collectionData: {
    name: string
    image: string
    address: string
  }
}

const isTab = getUiType().isTab

const SIZE = isTab ? 250 : 150

const containerStyle: ViewStyle[] = [
  {
    position: 'relative',
    ...spacings.mtLg,
    width: SIZE,
    height: SIZE,
    borderRadius: 12,
    overflow: 'hidden'
  },
  isTab ? spacings.mrXl : {}
]

const Collectible: FC<Props> = ({ url, collectionData }) => {
  const { t } = useTranslation()
  const [data, setData] = useState<CollectibleData | null>(null)
  const { navigate } = useNavigation()

  useEffect(() => {
    fetchCollectible(handleCollectibleUri(url)).then((collectibleData: CollectibleData | null) => {
      if (!collectibleData) return

      setData(collectibleData)
    })
  }, [url])

  // Works like a skeleton loader while the collectible is being fetched.
  if (!data) return <View style={[...containerStyle, { backgroundColor: colors.martinique_35 }]} />

  return (
    <Pressable
      style={containerStyle}
      onPress={() => {
        storage.set('collectible', {
          ...data,
          collectionData
        })
        navigate(ROUTES.collectible)
      }}
    >
      {({ hovered }: any) => (
        <>
          <Image source={{ uri: handleCollectibleUri(data.image) }} style={styles.image} />
          {hovered ? (
            <View style={[styles.hoveredContent, isTab ? spacings.ptMd : spacings.ptTy]}>
              <View>
                <Text
                  style={[styles.text, isTab ? spacings.mbTy : {}]}
                  color={colors.martinique}
                  fontSize={isTab ? 24 : 20}
                  weight="medium"
                >
                  {data.name.slice(0, 10)}
                </Text>
                {/* 
                We won't show the description for now
                <Text
                  style={styles.text}
                  color={colors.martinique}
                  weight="regular"
                  fontSize={isTab ? 16 : 12}
                >
                  {data.description.slice(0, isTab ? 50 : 30)}
                  {data.description.length > (isTab ? 50 : 30) ? '...' : ''}
                </Text> */}
              </View>
              <View>
                <Text
                  fontSize={isTab ? 20 : 16}
                  weight="regular"
                  style={[styles.text, isTab ? spacings.mbSm : spacings.mbTy]}
                  color={colors.violet}
                >
                  $0.00
                </Text>
                <Button
                  disabled
                  disabledStyle={{}}
                  type="outline"
                  size="small"
                  accentColor={colors.violet}
                  style={styles.button}
                  text={t('Send')}
                  hasBottomSpacing={false}
                >
                  <SendIcon width={20} height={20} color={colors.violet} />
                </Button>
              </View>
            </View>
          ) : null}
          {hovered ? <View style={styles.hoveredBackground} /> : null}
        </>
      )}
    </Pressable>
  )
}

export default Collectible
