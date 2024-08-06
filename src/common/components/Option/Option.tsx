import { View } from 'react-native'
import { SvgProps } from 'react-native-svg'

import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { iconColors } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'

import getStyles from './styles'

interface Props {
  text: string
  icon: React.FC<any>
  onPress: () => void
  hasLargerBottomSpace?: boolean
  iconProps?: SvgProps
  children?: React.ReactNode
  testID?: string
  disabled?: boolean
}

const Option = ({
  icon: Icon,
  onPress,
  hasLargerBottomSpace,
  text,
  iconProps = {},
  children,
  testID,
  disabled
}: Props) => {
  const { theme, styles } = useTheme(getStyles)
  const [bindAnim, animStyle, isHovered] = useCustomHover({
    property: 'borderColor',
    values: {
      from: theme.primaryBackground,
      to: theme.primary
    }
  })

  return (
    <AnimatedPressable
      key={text}
      style={[styles.container, hasLargerBottomSpace && spacings.mbXl, animStyle]}
      onPress={onPress}
      {...bindAnim}
      testID={testID}
      disabled={disabled}
    >
      <View style={[flexbox.directionRow, flexbox.alignCenter]}>
        <View style={styles.iconWrapper}>
          <Icon color={isHovered ? theme.primary : iconColors.primary} {...iconProps} />
        </View>
        <Text style={flexbox.flex1} fontSize={14} weight="medium" numberOfLines={1}>
          {text}
        </Text>
        <View style={spacings.mrSm}>
          <RightArrowIcon />
        </View>
      </View>
      {children}
    </AnimatedPressable>
  )
}

export default Option
