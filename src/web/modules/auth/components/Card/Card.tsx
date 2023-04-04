import { View, ViewProps } from 'react-native'

import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import { THEME_TYPES } from '@common/styles/themeConfig'
import textStyles from '@common/styles/utils/text'

import styles from './styles'

interface Props {
  style?: ViewProps['style']
  text?: string
  children: React.ReactNode
}

const Card: React.FC<Props> = ({ style, text, children }) => (
  <View style={[styles.container, style]}>
    {text && (
      <Text style={[spacings.mb, textStyles.center]} fontSize={14}>
        {text}
      </Text>
    )}
    {children}
  </View>
)

export default Card
