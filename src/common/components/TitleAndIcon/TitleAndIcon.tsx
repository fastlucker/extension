import { FC, ReactNode } from 'react'
import { View } from 'react-native'
import { SvgProps } from 'react-native-svg'

import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

const TitleAndIcon = ({
  title,
  icon: Icon,
  children
}: {
  title: string
  icon: FC<SvgProps>
  children?: ReactNode
}) => (
  <View
    style={[
      flexbox.directionRow,
      flexbox.alignCenter,
      flexbox.justifySpaceBetween,
      spacings.pt,
      spacings.phSm,
      spacings.mbTy
    ]}
  >
    <View style={[flexbox.directionRow, flexbox.alignCenter]}>
      <Icon width={16} height={16} />
      <Text fontSize={14} appearance="secondaryText" weight="medium" style={spacings.mlTy}>
        {title}
      </Text>
    </View>
    {children}
  </View>
)

export default TitleAndIcon
