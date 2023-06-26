import { View, ViewProps } from 'react-native'

import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import textStyles from '@common/styles/utils/text'

import styles from './styles'

interface Props {
  style?: ViewProps['style']
  text?: string
  title?: string
  icon?: JSX.Element
  children: React.ReactNode
}

const Card: React.FC<Props> = ({ style, text, title, icon, children }) => (
  <View style={[styles.container, style]}>
    {icon && icon}
    {title && (
      <Text weight="medium" style={[spacings.mb, textStyles.center]} fontSize={16}>
        {title}
      </Text>
    )}
    {text && (
      <Text style={[spacings.mb, flexbox.flex1]} fontSize={12}>
        {text}
      </Text>
    )}
    {children}
  </View>
)

export default Card
