import { createContext, FunctionComponent, ReactElement, ReactNode, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { View, ViewProps, ViewStyle } from 'react-native'

import Text, { TextAppearance } from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from './styles'

type SideContentItemType = 'info' | 'error'

interface TabLayoutWrapperSideContentItemProps extends ViewProps {
  type?: SideContentItemType
  children: ReactNode | ReactNode[]
  style?: ViewStyle
}

const ItemTypeContext = createContext<SideContentItemType>('info')

const TYPE_TO_TEXT_TYPE_MAP = {
  info: 'infoText',
  error: 'errorText'
}

const SideContentTitle = ({ children, noMb = false }: { children: string; noMb?: boolean }) => {
  const { t } = useTranslation()
  const type = useContext(ItemTypeContext)

  return (
    <Text
      style={!noMb ? spacings.mbSm : {}}
      appearance={TYPE_TO_TEXT_TYPE_MAP[type] as TextAppearance}
      fontSize={20}
      weight="medium"
    >
      {t(children)}
    </Text>
  )
}

const SideContentText = ({ children, noMb = false }: { children: string; noMb?: boolean }) => {
  const { t } = useTranslation()
  const type = useContext(ItemTypeContext)

  return (
    <Text
      style={!noMb ? spacings.mbSm : {}}
      appearance={TYPE_TO_TEXT_TYPE_MAP[type] as TextAppearance}
      fontSize={16}
      weight="regular"
    >
      {t(children)}
    </Text>
  )
}

const TYPE_TO_ICON_MAP = {
  info: 'primary',
  error: 'errorDecorative'
}

const SideContentRow = ({ title, Icon }: { title: string; Icon: FunctionComponent<any> }) => {
  const type = useContext(ItemTypeContext)
  const { theme } = useTheme()

  return (
    <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbSm]}>
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
}) => <View style={!noMb ? spacings.mbLg : {}}>{children}</View>

const TabLayoutWrapperSideContentItem = ({
  type = 'info',
  children,
  style,
  ...rest
}: TabLayoutWrapperSideContentItemProps) => {
  const { styles } = useTheme(getStyles)

  return (
    <ItemTypeContext.Provider value={type}>
      <View
        style={[
          type === 'info' && styles.infoSideItem,
          type === 'error' && styles.errorSideItem,
          style
        ]}
        {...rest}
      >
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
