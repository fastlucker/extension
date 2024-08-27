import { Animated, View } from 'react-native'

import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { AnimatedPressable, useMultiHover } from '@web/hooks/useHover'
import getStyles from '@web/modules/networks/components/NetworkBottomSheet/styles'

const Option = ({
  renderIcon,
  title,
  text,
  onPress
}: {
  renderIcon: React.ReactNode
  title: string
  text?: string
  onPress: () => void
}) => {
  const { styles, theme } = useTheme(getStyles)
  const [bindAnim, animStyle] = useMultiHover({
    values: [
      {
        property: 'borderColor',
        from: `${String(theme.primary)}00`,
        to: theme.primary
      },
      {
        property: 'left',
        from: 0,
        to: 5
      }
    ]
  })

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[
        styles.item,
        flexbox.justifySpaceBetween,
        {
          borderWidth: 1,
          borderColor: animStyle.borderColor
        }
      ]}
      {...bindAnim}
    >
      <View style={[flexbox.directionRow, flexbox.alignCenter]}>
        <View
          style={{
            width: 40,
            height: 40,
            ...flexbox.center,
            ...spacings.mrTy
          }}
        >
          {renderIcon}
        </View>
        <Text fontSize={16} weight="medium">
          {title}
        </Text>
        {!!text && (
          <Text style={spacings.mlTy} fontSize={14} appearance="secondaryText">
            {text}
          </Text>
        )}
      </View>
      <Animated.View
        style={{
          left: animStyle.left
        }}
      >
        <RightArrowIcon />
      </Animated.View>
    </AnimatedPressable>
  )
}

export default Option
