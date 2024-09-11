import React, { FC } from 'react'
import { View, ViewStyle } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Props {
  title: string
  description: string
  renderIcon: React.ReactNode
  children: React.ReactNode
  style?: ViewStyle
}

const ControlOption: FC<Props> = ({ title, description, children, renderIcon, style }) => {
  const { theme } = useTheme()

  return (
    <View
      style={[
        spacings.pv,
        spacings.ph,
        common.borderRadiusPrimary,
        flexbox.directionRow,
        flexbox.alignCenter,
        flexbox.justifySpaceBetween,
        {
          backgroundColor: theme.secondaryBackground
        },
        style
      ]}
    >
      <View style={[flexbox.directionRow, flexbox.alignCenter]}>
        <View
          style={{
            width: 24,
            ...flexbox.center
          }}
        >
          {renderIcon}
        </View>
        <View style={spacings.ml}>
          <Text fontSize={16} weight="medium">
            {title}
          </Text>
          <Text appearance="secondaryText" fontSize={14}>
            {description}
          </Text>
        </View>
      </View>
      {children}
    </View>
  )
}

export default ControlOption
