import React, { FC } from 'react'
import { Pressable, View } from 'react-native'
import { SvgProps } from 'react-native-svg'

import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings, { SPACING_MI } from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Props {
  label: string
  path: string
  key: string
  isActive: boolean
  Icon: FC<SvgProps>
}

const getColor = (isActive: boolean, isHovered: boolean) => {
  if (isActive) {
    return 'primary'
  }
  if (isHovered) {
    return 'primaryText'
  }

  return 'secondaryText'
}

const SidebarLink: FC<Props> = ({ label, path, key, Icon, isActive }) => {
  const { navigate } = useNavigation()
  const { theme } = useTheme()

  return (
    <Pressable
      key={key}
      onPress={() => {
        if (Object.values(ROUTES).includes(path)) {
          navigate(path)
          return
        }

        alert('Not implemented yet')
      }}
      style={({ hovered }: any) => [
        flexbox.directionRow,
        spacings.pl,
        spacings.pv,
        {
          borderRadius: BORDER_RADIUS_PRIMARY,
          marginVertical: SPACING_MI / 2,
          width: 250,
          backgroundColor: isActive || hovered ? theme.tertiaryBackground : 'transparent'
        }
      ]}
    >
      {({ hovered }: any) => {
        const color = theme[getColor(isActive, hovered)]

        return (
          <View style={flexbox.directionRow}>
            <Icon color={color} />
            <Text style={spacings.ml} color={color} fontSize={16} weight="medium">
              {label}
            </Text>
          </View>
        )
      }}
    </Pressable>
  )
}

export default SidebarLink
