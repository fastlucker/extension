import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'
import { SvgProps } from 'react-native-svg'

import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings, { SPACING_MI } from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import { createTab } from '@web/extension-services/background/webapi/tab'

interface Props {
  label: string
  path: string
  key: string
  isActive: boolean
  Icon?: FC<SvgProps>
  isExternal?: boolean
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

const SidebarLink: FC<Props> = ({ label, path, key, Icon, isActive, isExternal }) => {
  const { navigate } = useNavigation()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { addToast } = useToast()
  const isDisabled = !Object.values(ROUTES).includes(path) && !isExternal

  return (
    <Pressable
      key={key}
      onPress={async () => {
        if (isExternal) {
          try {
            await createTab(path)
          } catch {
            addToast("Couldn't open link", { type: 'error' })
          }
          return
        }

        navigate(path)
      }}
      disabled={isDisabled}
      style={({ hovered }: any) => [
        flexbox.directionRow,
        spacings.pl,
        spacings.pv,
        {
          borderRadius: BORDER_RADIUS_PRIMARY,
          marginVertical: SPACING_MI / 2,
          width: 250,
          backgroundColor: isActive || hovered ? theme.tertiaryBackground : 'transparent',
          opacity: isDisabled ? 0.6 : 1
        }
      ]}
    >
      {({ hovered }: any) => {
        const color = theme[getColor(isActive, hovered)]

        return (
          <View style={flexbox.directionRow}>
            {Icon ? <Icon color={color} /> : null}
            <Text style={Icon ? spacings.ml : {}} color={color} fontSize={16} weight="medium">
              {t(label)}
            </Text>
          </View>
        )
      }}
    </Pressable>
  )
}

export default SidebarLink
