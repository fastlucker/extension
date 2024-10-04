import React, { ReactElement, useMemo } from 'react'
import { View, ViewStyle } from 'react-native'

import CheckIcon from '@common/assets/svg/CheckIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import useTheme from '@common/hooks/useTheme'

import getStyles from './styles'

const RouteStepsArrow = ({
  containerStyle,
  badge,
  badgeStyle,
  badgePosition = 'middle',
  type
}: {
  containerStyle?: ViewStyle
  badge?: ReactElement | null
  badgePosition?: 'top' | 'middle'
  badgeStyle?: ViewStyle
  type?: 'default' | 'warning' | 'success'
}) => {
  const { styles, theme } = useTheme(getStyles)

  const getArrowColor = useMemo(() => {
    if (type === 'warning') return theme.warningDecorative
    if (type === 'success') return theme.successDecorative

    return theme.secondaryBorder
  }, [theme, type])

  return (
    <View style={[styles.container, containerStyle]}>
      {type === 'success' ? (
        <CheckIcon width={12} height={12} color={theme.successDecorative} />
      ) : (
        <View style={[styles.arrowStart, { borderColor: getArrowColor }]} />
      )}
      <View
        style={[
          styles.arrowLine,
          type === 'success' && styles.arrowLineSuccess,
          { borderColor: getArrowColor }
        ]}
      >
        {!!badge && (
          <View style={{ backgroundColor: theme.secondaryBackground }}>
            <View
              style={[
                badgePosition === 'middle' && styles.badgeMiddle,
                badgePosition === 'top' && styles.badgeTop,

                badgeStyle
              ]}
            >
              {badge}
            </View>
          </View>
        )}
      </View>
      <View style={styles.arrowTipWrapper}>
        <RightArrowIcon color={getArrowColor} height={11} />
      </View>
    </View>
  )
}

export default React.memo(RouteStepsArrow)
