import React, { FC } from 'react'
import { Pressable, View } from 'react-native'

import KebabMenuIcon from '@common/assets/svg/KebabMenuIcon'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'

import { Avatar } from '../Avatar'
import Text from '../Text'

interface Props {
  address: string
  name: string
  onPress?: () => void
}

const AddressBookContact: FC<Props> = ({ address, name, onPress }) => {
  const { theme } = useTheme()
  const [bindAnim, animStyle] = useCustomHover({
    property: 'backgroundColor',
    values: {
      from: theme.primaryBackground,
      to: theme.secondaryBackground
    }
  })
  const ContainerElement = onPress ? AnimatedPressable : View

  return (
    <ContainerElement
      style={[
        flexbox.directionRow,
        flexbox.alignCenter,
        flexbox.justifySpaceBetween,
        spacings.phTy,
        spacings.pvTy,
        common.borderRadiusPrimary,
        onPress && animStyle
      ]}
      onPress={onPress}
      {...(onPress ? bindAnim : {})}
    >
      <View style={[flexbox.directionRow, flexbox.alignCenter]}>
        <Avatar pfp={address} size={32} />
        <View>
          <Text fontSize={14}>{name}</Text>
          <Text selectable fontSize={12} appearance="secondaryText">
            {address}
          </Text>
        </View>
      </View>
      <Pressable
        style={[
          spacings.mlLg,
          flexbox.center,
          {
            width: 32,
            height: 32
          }
        ]}
      >
        <KebabMenuIcon />
      </Pressable>
    </ContainerElement>
  )
}

export default AddressBookContact
