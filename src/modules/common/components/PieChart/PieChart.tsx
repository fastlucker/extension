import React from 'react'
import { View } from 'react-native'
import { VictoryPie } from 'victory-native'
import { VictoryPieProps } from 'victory-pie'

import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import { DEVICE_WIDTH, SPACING_LG } from '@modules/common/styles/spacings'

interface Props extends VictoryPieProps {}

const PieChart: React.FC<Props> = (rest) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5fcff'
      }}
    >
      <VictoryPie
        innerRadius={DEVICE_WIDTH * 0.25}
        labels={() => null}
        height={DEVICE_WIDTH - SPACING_LG - SPACING_LG}
        padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
        {...rest}
      />
    </View>
  )
}

export default PieChart
