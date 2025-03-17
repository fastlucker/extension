import { View } from 'react-native'

import ScrollableWrapper from '@common/components/ScrollableWrapper'
import useTheme from '@common/hooks/useTheme'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from '../styles'

const EstimationWrapper = ({ children }: { children: React.ReactNode }) => {
  const { styles } = useTheme(getStyles)
  return (
    <View style={styles.estimationContainer}>
      <ScrollableWrapper
        style={styles.estimationScrollView}
        contentContainerStyle={flexbox.justifyEnd}
      >
        {children}
      </ScrollableWrapper>
    </View>
  )
}

export default EstimationWrapper
