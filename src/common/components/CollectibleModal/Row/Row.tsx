import { View } from 'react-native'

import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { getUiType } from '@web/utils/uiType'

const { isTab } = getUiType()

const Row = ({ title, text, noMb }: { title: string; text: string; noMb?: boolean }) => (
  <View
    testID='collectible-row'
    style={[
      flexbox.directionRow,
      flexbox.alignCenter,
      flexbox.justifySpaceBetween,
      !noMb ? spacings.mbTy : {}
    ]}
  >
    <Text fontSize={isTab ? 14 : 12} appearance="primaryText" weight="medium">
      {title}
    </Text>
    <Text fontSize={isTab ? 14 : 12} appearance="secondaryText">
      {text}
    </Text>
  </View>
)

export default Row
