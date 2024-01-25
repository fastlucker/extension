import { FunctionComponent, ReactNode, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, ViewProps, ViewStyle } from 'react-native'

import Text, { Props as CommonTextProps, TextAppearance } from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import { IS_SCREEN_SIZE_DESKTOP_LARGE } from '@common/styles/spacings'

import SideContentHeader from './SideContentHeader'
import getStyles from './styles'
import { SideContentItemType } from './types'
import { ItemTypeContext, SMALL_MARGIN, TYPE_TO_TEXT_TYPE_MAP } from './utils'

interface TabLayoutWrapperSideContentItemProps extends ViewProps {
  title: string
  children: ReactNode | ReactNode[]
  type?: SideContentItemType
  style?: ViewStyle
  icon?: FunctionComponent<any>
  isExpandedByDefault?: boolean
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

const TabLayoutWrapperSideContentItem = ({
  type = 'info',
  children,
  style,
  title,
  icon,
  isExpandedByDefault = false,
  ...rest
}: TabLayoutWrapperSideContentItemProps) => {
  const { styles } = useTheme(getStyles)
  const [isExpanded, setIsExpanded] = useState(isExpandedByDefault)

  return (
    <ItemTypeContext.Provider value={type}>
      <View style={[styles.sideItem, styles[`${type}SideItem`], style]} {...rest}>
        <SideContentHeader
          title={title}
          Icon={icon}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
        {isExpanded ? children : null}
      </View>
    </ItemTypeContext.Provider>
  )
}

TabLayoutWrapperSideContentItem.Text = SideContentText

export default TabLayoutWrapperSideContentItem
