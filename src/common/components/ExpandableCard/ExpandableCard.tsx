/* eslint-disable react/jsx-no-useless-fragment */
import React, { ReactElement, useState } from 'react'
import { Pressable, View, ViewStyle } from 'react-native'

import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import UpArrowIcon from '@common/assets/svg/UpArrowIcon'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from './styles'

type Props = {
  content: ReactElement
  expandedContent?: ReactElement
  style?: ViewStyle
  enableExpand?: boolean
  hasArrow?: boolean
  arrowPosition?: 'left' | 'right'
  children?: ReactElement | ReactElement[]
  contentStyle?: ViewStyle
  onExpandedToggle?: Function
  isExpandedByDefault?: boolean
}

const ExpandableCard = ({
  style,
  enableExpand = true,
  hasArrow = true,
  arrowPosition = 'left',
  content,
  expandedContent,
  children,
  contentStyle,
  onExpandedToggle,
  isExpandedByDefault = false
}: Props) => {
  const { styles } = useTheme(getStyles)
  const [isExpanded, setIsExpanded] = useState(!enableExpand || isExpandedByDefault)

  const Element = enableExpand ? Pressable : View

  return (
    <View style={[styles.container, style]}>
      <Element
        onPress={() => {
          if (enableExpand) {
            setIsExpanded((prevState) => !prevState)
            if (onExpandedToggle) onExpandedToggle()
          }
        }}
      >
        <View
          style={[
            flexbox.directionRow,
            flexbox.alignCenter,
            spacings.phSm,
            spacings.pvSm,
            contentStyle
          ]}
        >
          {!!hasArrow && arrowPosition === 'left' && (
            <View style={{ opacity: enableExpand ? 1 : 0.5 }}>
              {isExpanded ? <UpArrowIcon /> : <DownArrowIcon />}
            </View>
          )}
          <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.flex1]}>
            {!!content && content}
          </View>
          {!!hasArrow && arrowPosition === 'right' && (
            <View style={{ opacity: enableExpand ? 1 : 0.5 }}>
              {isExpanded ? <UpArrowIcon /> : <DownArrowIcon />}
            </View>
          )}
        </View>
        {children}
      </Element>
      {!!enableExpand && !!isExpanded && !!expandedContent && expandedContent}
    </View>
  )
}

export default React.memo(ExpandableCard)
