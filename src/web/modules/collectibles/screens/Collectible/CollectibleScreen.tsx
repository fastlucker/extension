import * as Clipboard from 'expo-clipboard'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Pressable, View } from 'react-native'

import CopyIcon from '@common/assets/svg/CopyIcon'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import useToast from '@common/hooks/useToast'
import { ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import { storage } from '@web/extension-services/background/webapi/storage'

import TabHeader from '../../components/TabHeader'
import styles from './styles'

interface State {
  image: string
  name: string
  description?: string
  owner?: string
  collectionData: {
    name: string
    image: string
    address: string
  }
}

const CollectibleScreen = () => {
  const { t } = useTranslation()
  const [state, setState] = useState<State | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { addToast } = useToast()

  useEffect(() => {
    storage.get('collectible', null).then((data) => {
      setState(data)
      setIsLoading(false)
    })
  }, [])

  const handleCopyAddress = () => {
    if (!state) return

    if (!state.collectionData?.address) {
      addToast(t('Failed to copy address') as string, { timeout: 2500, type: 'error' })
      return
    }
    Clipboard.setStringAsync(state.collectionData?.address || '')
    addToast(t('Copied to clipboard!') as string, { timeout: 2500 })
  }

  return !isLoading && state ? (
    <View style={{ flex: 1 }}>
      <TabHeader
        // @TODO: add a case where <CollectionScreen /> doesn't receive collectibles from useRoute
        // and has to fetch them, so the back button here leads to that screen.(since we can't pass
        // collectibles to <CollectionScreen /> from <CollectibleScreen />)
        fallbackPrevRoute={`${ROUTES.dashboard}?tab=collectibles`}
        text={state.collectionData?.name || 'Unknown collection'}
        image={state.collectionData?.image}
      />
      <Wrapper style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={[styles.section, styles.info]}>
            <View style={styles.infoImageWrapper}>
              <Image source={{ uri: state.image }} style={styles.infoImage} />
            </View>
            <Text color={colors.martinique} style={styles.sectionTitle}>
              {state.name}
            </Text>
            {state.description && (
              <View style={styles.infoItem}>
                <Text color={colors.martinique} style={styles.sectionSubtitle}>
                  Description
                </Text>
                <Text color={colors.martinique} style={styles.itemValue}>
                  {state.description}
                </Text>
              </View>
            )}
            {state.collectionData?.address && (
              <View style={styles.infoItem}>
                <Text color={colors.martinique} style={styles.sectionSubtitle}>
                  Contract address
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text color={colors.martinique} style={styles.itemValue}>
                    {state.collectionData?.address}
                  </Text>
                  <Pressable style={styles.copyIcon} onPress={handleCopyAddress}>
                    <CopyIcon width={20} height={20} />
                  </Pressable>
                </View>
              </View>
            )}
            {state.owner && (
              <View style={styles.infoItem}>
                <Text color={colors.martinique} style={styles.sectionSubtitle}>
                  Owner
                </Text>
                <Text color={colors.martinique} style={styles.itemValue}>
                  {state.owner}
                </Text>
              </View>
            )}
          </View>
          {/* <View style={[styles.section, styles.transfer]}>
            <Text color={colors.martinique} style={styles.sectionTitle}>
              Transfer
            </Text>
            <Text color={colors.martinique}>Recipient</Text>
            <Button text="Send" />
          </View> */}
        </View>
      </Wrapper>
    </View>
  ) : null
}

export default CollectibleScreen
