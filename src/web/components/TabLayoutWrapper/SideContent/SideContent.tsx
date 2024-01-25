import { View, ViewProps } from 'react-native'

import Wrapper from '@common/components/Wrapper'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'

import getStyles from './styles'

interface TabLayoutWrapperSideContentProps extends ViewProps {}

const TabLayoutWrapperSideContent: React.FC<TabLayoutWrapperSideContentProps> = ({
  children,
  style
}: TabLayoutWrapperSideContentProps) => {
  const { styles } = useTheme(getStyles)

  return (
    <View style={[styles.sideContentContainer, style]}>
      <Wrapper contentContainerStyle={[spacings.ph0]} showsVerticalScrollIndicator={false}>
        {children}
      </Wrapper>
    </View>
  )
}

export default TabLayoutWrapperSideContent
