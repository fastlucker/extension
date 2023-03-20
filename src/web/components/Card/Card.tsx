import { View } from 'react-native'

import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import { THEME_TYPES } from '@common/styles/themeConfig'
import textStyles from '@common/styles/utils/text'

import styles from './styles'

const Card = ({ style, text, children }) => (
  <View style={[styles.container, style]}>
    {text && (
      <Text themeType={THEME_TYPES.LIGHT} style={[spacings.mb, textStyles.center]} fontSize={14}>
        {text}
      </Text>
    )}
    {children}
  </View>
)

export default Card
