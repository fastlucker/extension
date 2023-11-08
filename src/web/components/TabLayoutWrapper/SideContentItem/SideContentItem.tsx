import { createContext, FunctionComponent, ReactElement, useContext } from 'react'
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
  children: ReactElement | ReactElement[]
  style?: ViewStyle
}

const ItemTypeContext = createContext<SideContentItemType>('info')

const TYPE_TO_TEXT_TYPE_MAP = {
  info: 'infoText',
  error: 'errorText'
}

const SideContentTitle = ({ children }: { children: string }) => {
  const { t } = useTranslation()
  const type = useContext(ItemTypeContext)

  return (
    <Text appearance={TYPE_TO_TEXT_TYPE_MAP[type] as TextAppearance} fontSize={20} weight="medium">
      {t(children)}
    </Text>
  )
}

const SideContentText = ({ children }: { children: string }) => {
  const { t } = useTranslation()
  const type = useContext(ItemTypeContext)

  return (
    <Text appearance={TYPE_TO_TEXT_TYPE_MAP[type] as TextAppearance} fontSize={16}>
      {t(children)}
    </Text>
  )
}

const TYPE_TO_ICON_MAP = {
  info: 'infoDecorative',
  error: 'errorDecorative'
}

const SideContentRow = ({
  children,
  Icon
}: {
  children: ReactElement | ReactElement[]
  Icon: FunctionComponent<any>
}) => {
  const type = useContext(ItemTypeContext)
  const { theme } = useTheme()

  return (
    <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbSm]}>
      <Icon color={theme[TYPE_TO_ICON_MAP[type] as keyof ThemeProps]} style={spacings.mrTy} />
      {children}
    </View>
  )
}

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

export default TabLayoutWrapperSideContentItem
