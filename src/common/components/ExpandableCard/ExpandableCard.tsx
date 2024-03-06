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
  arrowPosition?: 'left' | 'right'
  children?: ReactElement | ReactElement[]
  contentStyle?: ViewStyle
}

const ExpandableCard = ({
  style,
  enableExpand = true,
  arrowPosition = 'left',
  content,
  expandedContent,
  children,
  contentStyle
}: Props) => {
  const { styles } = useTheme(getStyles)
  const [isExpanded, setIsExpanded] = useState(!enableExpand)

  const Element = enableExpand ? Pressable : View

  return (
    <View style={[styles.container, style]}>
      <Element onPress={() => !!enableExpand && setIsExpanded((prevState) => !prevState)}>
        <View
          style={[
            flexbox.directionRow,
            flexbox.alignCenter,
            spacings.phSm,
            spacings.pvSm,
            contentStyle
          ]}
        >
          {!!enableExpand &&
            arrowPosition === 'left' &&
            (isExpanded ? <UpArrowIcon /> : <DownArrowIcon />)}
          <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.flex1]}>
            {!!content && content}
          </View>
          {!!enableExpand &&
            arrowPosition === 'right' &&
            (isExpanded ? <UpArrowIcon /> : <DownArrowIcon />)}
        </View>
        {children}
      </Element>
      {!!enableExpand && !!isExpanded && !!expandedContent && expandedContent}
    </View>
  )
}

export default React.memo(ExpandableCard)
