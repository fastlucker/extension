import React from 'react'
import { View } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

import LeftArrowIcon from '@assets/svg/LeftArrowIcon'
import NavIconWrapper from '@modules/common/components/NavIconWrapper'
import colors from '@modules/common/styles/colors'
import { SPACING_MI, SPACING_TY } from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import styles from './styles'

type Props = {
  onPress: () => void
}

const CollectibleLoader = ({ onPress }: Props) => {
  return (
    <View style={[flexboxStyles.flex1]}>
      <NavIconWrapper onPress={onPress} style={[styles.backIconWrapper, { zIndex: 5 }]}>
        <LeftArrowIcon />
      </NavIconWrapper>
      <SkeletonPlaceholder
        backgroundColor={colors.chetwode}
        highlightColor={colors.baileyBells}
        speed={1600}
      >
        <SkeletonPlaceholder.Item
          width="100%"
          height={40}
          paddingLeft={55}
          borderRadius={13}
          marginBottom={5}
        >
          <SkeletonPlaceholder.Item width="100%" height={40} borderRadius={13} />
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          width="100%"
          height={23}
          paddingLeft={55}
          borderRadius={13}
          marginBottom={SPACING_TY}
        >
          <SkeletonPlaceholder.Item width="100%" height={23} borderRadius={13} />
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item flexDirection="row" marginBottom={SPACING_MI}>
          <SkeletonPlaceholder.Item width="50%" paddingRight={5}>
            <SkeletonPlaceholder.Item aspectRatio={1} borderRadius={13}>
              <SkeletonPlaceholder.Item
                width="100%"
                height="100%"
                aspectRatio={1}
                borderRadius={13}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item
            width="50%"
            aspectRatio={1}
            borderRadius={13}
            paddingLeft={SPACING_MI}
          >
            <SkeletonPlaceholder.Item
              width="100%"
              height={28}
              borderRadius={13}
              marginBottom={SPACING_TY}
            />
            <SkeletonPlaceholder.Item flex={1} borderRadius={13} paddingBottom={SPACING_MI}>
              <SkeletonPlaceholder.Item width="100%" height="100%" borderRadius={13} />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item width="100%" height={38} borderRadius={13} />
      </SkeletonPlaceholder>
    </View>
  )
}

export default CollectibleLoader
