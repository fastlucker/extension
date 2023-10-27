import * as Clipboard from 'expo-clipboard'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Pressable, View } from 'react-native'

import avatarSpaceDog from '@common/assets/images/avatars/avatar-space-dog.png'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import useNavigation from '@common/hooks/useNavigation'
import useNft from '@common/hooks/useNft'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import { ROUTES } from '@common/modules/router/constants/common'
import CopyIcon from '@web/assets/svg/CopyIcon'
import ImageIcon from '@web/assets/svg/ImageIcon'
import useMainControllerState from '@web/hooks/useMainControllerState'
import TabHeader from '@web/modules/router/components/TabHeader'

import CollectibleTransfer from '../../components/CollectibleTransfer'
import getStyles from './styles'

interface State {
  image: string
  name: string
  description?: string
  owner: string
  address: string
}

const CollectibleScreenInner = ({ name, image, description, owner, address }: State) => {
  const { theme, styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const { state } = useRoute()
  const { addToast } = useToast()
  const { navigate } = useNavigation()
  const [failedImage, setFailedImage] = useState(false)
  const { selectedAccount: selectedAcc } = useMainControllerState()

  const handleCopyAddress = () => {
    if (!address) return

    if (!address) {
      addToast(t('Failed to copy address') as string, { timeout: 2500, type: 'error' })
      return
    }
    Clipboard.setStringAsync(address)
    addToast(t('Copied to clipboard!') as string, { timeout: 2500 })
  }

  return (
    <View style={styles.view}>
      <TabHeader
        style={{ backgroundColor: theme.secondaryBackground }}
        // @TODO: add a case where <CollectionScreen /> doesn't receive collectibles from useRoute
        // and has to fetch them, so the back button here leads to that screen.(since we can't pass
        // collectibles to <CollectionScreen /> from <CollectibleScreen />)
        onBack={() => {
          if (state?.prevRoute) {
            navigate(-1)
            return
          }
          navigate(`${ROUTES.dashboard}?tab=collectibles`)
        }}
        forceCanGoBack
        pageTitle={name || t('Unknown collection')}
        image={image}
      />
      <Wrapper style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={[styles.section, styles.info]}>
            <View style={styles.infoImageWrapper}>
              {image && !failedImage ? (
                <Image
                  onError={() => setFailedImage(true)}
                  source={{ uri: image }}
                  style={styles.infoImage}
                />
              ) : null}
              {!image || failedImage ? <ImageIcon width={148} height={148} /> : null}
            </View>
            <Text style={styles.sectionTitle}>{name}</Text>
            {description ? (
              <View style={styles.infoItem}>
                <Text style={styles.sectionSubtitle}>{t('Description')}</Text>
                <Text style={styles.itemValue}>{description}</Text>
              </View>
            ) : null}
            {address ? (
              <View style={styles.infoItem}>
                <Text style={styles.sectionSubtitle}>{t('Contract address')}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.itemValue}>{address}</Text>
                  <Pressable style={styles.copyIcon} onPress={handleCopyAddress}>
                    <CopyIcon width={10} height={10} />
                  </Pressable>
                </View>
              </View>
            ) : null}
            {owner ? (
              <View style={styles.infoItem}>
                <Text style={styles.sectionSubtitle}>{t('Owner')}</Text>
                <View style={styles.ownerContainer}>
                  <Image
                    style={{ width: 34, height: 34, borderRadius: 12 }}
                    source={avatarSpaceDog}
                    resizeMode="contain"
                  />
                  <View style={styles.owner}>
                    {owner === selectedAcc ? (
                      <Text weight="semiBold" fontSize={16}>
                        {t('You ')}
                      </Text>
                    ) : null}
                    <Text weight="semiBold" fontSize={16} numberOfLines={1}>
                      {owner === selectedAcc ? `(${owner})` : owner}
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
          <CollectibleTransfer />
        </View>
      </Wrapper>
    </View>
  )
}

interface SearchParams {
  address: string
  id: bigint
  networkId: string
}

const CollectibleScreen = () => {
  const { search } = useRoute()

  const searchParams = Object.fromEntries(new URLSearchParams(search))

  if (!searchParams.address || !searchParams.id || !searchParams.networkId) return null

  const { data: state, isLoading } = useNft({
    ...searchParams,
    id: BigInt(searchParams.id)
  } as SearchParams)

  return !isLoading ? (
    <CollectibleScreenInner
      name={state?.name || 'Unknown collectible'}
      image={state?.image || ''}
      description={state?.description}
      address={searchParams.address || ''}
      owner={state?.owner || ''}
    />
  ) : (
    <CollectibleScreenInner
      name="Loading..."
      image=""
      address="Loading..."
      description=""
      owner=""
    />
  )
}

export default CollectibleScreen
