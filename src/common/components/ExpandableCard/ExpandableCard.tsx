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
}

const ExpandableCard = ({
  style,
  enableExpand = true,
  hasArrow = true,
  arrowPosition = 'left',
  content,
  expandedContent,
  children
}: Props) => {
  const { styles } = useTheme(getStyles)
  const [isExpanded, setIsExpanded] = useState(!enableExpand)

  return (
    <View style={[styles.container, style]}>
      <Pressable onPress={() => !!enableExpand && setIsExpanded((prevState) => !prevState)}>
        <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.phSm, spacings.pvSm]}>
          {!!hasArrow &&
            arrowPosition === 'left' &&
            (isExpanded ? <UpArrowIcon /> : <DownArrowIcon />)}
          <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.flex1]}>
            {!!content && content}
          </View>
          {!!hasArrow &&
            arrowPosition === 'right' &&
            (isExpanded ? <UpArrowIcon /> : <DownArrowIcon />)}
        </View>
        {children}
      </Pressable>
      {!!enableExpand && !!isExpanded && !!expandedContent && expandedContent}
    </View>
  )
}

export default React.memo(ExpandableCard)
