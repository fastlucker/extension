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

import CollectibleTransfer from '../../components/CollectibleTransfer'
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

const CollectibleScreenInner = ({ collectionData, name, image, description, owner }: State) => {
  const { t } = useTranslation()
  const { addToast } = useToast()

  const handleCopyAddress = () => {
    if (!collectionData) return

    if (!collectionData?.address) {
      addToast(t('Failed to copy address') as string, { timeout: 2500, type: 'error' })
      return
    }
    Clipboard.setStringAsync(collectionData.address)
    addToast(t('Copied to clipboard!') as string, { timeout: 2500 })
  }

  return (
    <View style={styles.view}>
      <TabHeader
        // @TODO: add a case where <CollectionScreen /> doesn't receive collectibles from useRoute
        // and has to fetch them, so the back button here leads to that screen.(since we can't pass
        // collectibles to <CollectionScreen /> from <CollectibleScreen />)
        fallbackPrevRoute={`${ROUTES.dashboard}?tab=collectibles`}
        text={name || 'Unknown collection'}
        image={image}
      />
      <Wrapper style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={[styles.section, styles.info]}>
            <View style={styles.infoImageWrapper}>
              <Image source={{ uri: image }} style={styles.infoImage} />
            </View>
            <Text color={colors.martinique} style={styles.sectionTitle}>
              {name}
            </Text>
            {description && (
              <View style={styles.infoItem}>
                <Text color={colors.martinique} style={styles.sectionSubtitle}>
                  {t('Description')}
                </Text>
                <Text color={colors.martinique} style={styles.itemValue}>
                  {description}
                </Text>
              </View>
            )}
            {collectionData?.address && (
              <View style={styles.infoItem}>
                <Text color={colors.martinique} style={styles.sectionSubtitle}>
                  {t('Contract address')}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text color={colors.martinique} style={styles.itemValue}>
                    {collectionData?.address}
                  </Text>
                  <Pressable style={styles.copyIcon} onPress={handleCopyAddress}>
                    <CopyIcon width={20} height={20} />
                  </Pressable>
                </View>
              </View>
            )}
            {owner && (
              <View style={styles.infoItem}>
                <Text color={colors.martinique} style={styles.sectionSubtitle}>
                  {t('Owner')}
                </Text>
                <Text color={colors.martinique} style={styles.itemValue}>
                  {owner}
                </Text>
              </View>
            )}
          </View>
          <CollectibleTransfer />
          {/* <View style={[styles.section, styles.transfer]}>
            <Text color={colors.martinique} style={[styles.sectionTitle, styles.transferTitle]}>
              Transfer
            </Text>
            <Controller
              name="recipientAddr"
              control={control}
              render={({ field: { onChange, value } }) => (
                <RecipientInput
                  style={styles.recipientInput}
                  containerStyle={styles.recipientInputContainer}
                  label="Add Recipient"
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            <Button style={styles.transferButton} text="Send" />
          </View> */}
        </View>
      </Wrapper>
    </View>
  )
}

const CollectibleScreen = () => {
  const [state, setState] = useState<State | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    storage.get('collectible', null).then((data) => {
      setState(data)
      setIsLoading(false)
    })
  }, [])

  return !isLoading && state ? (
    <CollectibleScreenInner
      collectionData={state?.collectionData}
      name={state?.name}
      image={state?.image}
      description={state?.description}
      owner={state?.owner}
    />
  ) : (
    <CollectibleScreenInner
      collectionData={{
        name: 'Loading...',
        image: '',
        address: ''
      }}
      name="Loading..."
      image=""
      description=""
      owner=""
    />
  )
}

export default CollectibleScreen
