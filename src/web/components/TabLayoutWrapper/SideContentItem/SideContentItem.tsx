import { createContext, FunctionComponent, ReactElement, ReactNode, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { View, ViewProps, ViewStyle } from 'react-native'

import Text, { Props as CommonTextProps, TextAppearance } from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings, { IS_SCREEN_SIZE_DESKTOP_LARGE } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from './styles'

type SideContentItemType = 'info' | 'error' | 'warning'

interface TabLayoutWrapperSideContentItemProps extends ViewProps {
  type?: SideContentItemType
  children: ReactNode | ReactNode[]
  style?: ViewStyle
}

const ItemTypeContext = createContext<SideContentItemType>('info')

const BIG_MARGIN = IS_SCREEN_SIZE_DESKTOP_LARGE ? spacings.mbLg : spacings.mbSm
const SMALL_MARGIN = spacings.mbSm

const TYPE_TO_TEXT_TYPE_MAP = {
  info: 'infoText',
  error: 'errorText',
  warning: 'warningText'
}

const SideContentTitle = ({ children, noMb = false }: { children: string; noMb?: boolean }) => {
  const { t } = useTranslation()
  const type = useContext(ItemTypeContext)

  return (
    <Text
      style={!noMb ? SMALL_MARGIN : {}}
      appearance={TYPE_TO_TEXT_TYPE_MAP[type] as TextAppearance}
      fontSize={IS_SCREEN_SIZE_DESKTOP_LARGE ? 20 : 16}
      weight="medium"
    >
      {t(children)}
    </Text>
  )
}

const SideContentText = ({
  children,
  noMb = false,
  ...rest
}: CommonTextProps & {
  children: string
  noMb?: boolean
}) => {
  const { t } = useTranslation()
  const type = useContext(ItemTypeContext)

  return (
    <Text
      style={!noMb ? SMALL_MARGIN : {}}
      appearance={TYPE_TO_TEXT_TYPE_MAP[type] as TextAppearance}
      fontSize={IS_SCREEN_SIZE_DESKTOP_LARGE ? 16 : 14}
      weight="regular"
      {...rest}
    >
      {t(children)}
    </Text>
  )
}

const TYPE_TO_ICON_MAP = {
  info: 'primary',
  error: 'errorDecorative',
  warning: 'warningDecorative'
}

const SideContentRow = ({ title, Icon }: { title: string; Icon: FunctionComponent<any> }) => {
  const type = useContext(ItemTypeContext)
  const { theme } = useTheme()

  return (
    <View style={[flexbox.directionRow, flexbox.alignCenter, SMALL_MARGIN]}>
      <Icon
        width={20}
        height={20}
        color={theme[TYPE_TO_ICON_MAP[type] as keyof ThemeProps]}
        style={spacings.mrTy}
      />
      <SideContentTitle noMb>{title}</SideContentTitle>
    </View>
  )
}

const SideContentGroup = ({
  children,
  noMb = false
}: {
  children: ReactElement | ReactElement[]
  noMb?: boolean
}) => <View style={!noMb ? BIG_MARGIN : {}}>{children}</View>

const TabLayoutWrapperSideContentItem = ({
  type = 'info',
  children,
  style,
  ...rest
}: TabLayoutWrapperSideContentItemProps) => {
  const { styles } = useTheme(getStyles)

  return (
    <ItemTypeContext.Provider value={type}>
      <View style={[styles.sideItem, styles[`${type}SideItem`], style]} {...rest}>
        {children}
      </View>
    </ItemTypeContext.Provider>
  )
}

TabLayoutWrapperSideContentItem.Title = SideContentTitle
TabLayoutWrapperSideContentItem.Text = SideContentText
TabLayoutWrapperSideContentItem.Row = SideContentRow
TabLayoutWrapperSideContentItem.Group = SideContentGroup

export default TabLayoutWrapperSideContentItem
