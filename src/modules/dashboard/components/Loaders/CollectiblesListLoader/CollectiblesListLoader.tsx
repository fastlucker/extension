import React from 'react'
import { View } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

import colors from '@modules/common/styles/colors'
import { SPACING_MI, SPACING_TY } from '@modules/common/styles/spacings'

import styles from './styles'

const CollectiblesListLoader = () => {
  const LoaderItem = (
    <View style={styles.itemWrapper}>
      <SkeletonPlaceholder
        backgroundColor={colors.chetwode}
        highlightColor={colors.baileyBells}
        speed={1600}
      >
        <SkeletonPlaceholder.Item backgroundColor={colors.chetwode_50} borderRadius={13}>
          <SkeletonPlaceholder.Item
            width="100%"
            aspectRatio={1}
            marginBottom={SPACING_MI}
            borderTopLeftRadius={13}
            borderTopRightRadius={13}
          />

          <SkeletonPlaceholder.Item paddingHorizontal={SPACING_TY} paddingBottom={SPACING_TY}>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              marginBottom={SPACING_MI}
              alignItems="center"
            >
              <SkeletonPlaceholder.Item
                width={15}
                height={15}
                marginRight={SPACING_MI}
                borderRadius={50}
              />
              <SkeletonPlaceholder.Item height={10} width={70} borderRadius={10} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item height={10} width="100%" borderRadius={10} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  )

  return (
    <View style={styles.itemsContainer}>
      {LoaderItem}
      {LoaderItem}
      {LoaderItem}
      {LoaderItem}
    </View>
  )
}

export default CollectiblesListLoader
