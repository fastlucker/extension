import { Pressable, View } from 'react-native'

import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import getStyles from '@web/modules/networks/components/NetworkBottomSheet/styles'

const Option = ({
  renderIcon,
  text,
  onPress
}: {
  renderIcon: React.ReactNode
  text: string
  onPress: () => void
}) => {
  const { styles, theme } = useTheme(getStyles)
  return (
    <Pressable
      onPress={onPress}
      style={({ hovered }: any) => [
        styles.item,
        flexbox.justifySpaceBetween,
        {
          borderWidth: 1,
          borderColor: hovered ? theme.primary : 'transparent'
        }
      ]}
    >
      {({ hovered }: any) => (
        <>
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
              {text}
            </Text>
          </View>
          <RightArrowIcon
            style={{
              transform: [{ translateX: hovered ? 5 : 0 }]
            }}
          />
        </>
      )}
    </Pressable>
  )
}

export default Option
