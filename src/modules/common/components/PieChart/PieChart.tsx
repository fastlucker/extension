import React, { useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import { VictoryLegend, VictoryPie } from 'victory-native'
import { VictoryPieProps } from 'victory-pie'

import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import colors from '@modules/common/styles/colors'

interface Props extends VictoryPieProps {}

const PieChart: React.FC<Props> = (rest) => {
  const [widthChart, setWidthChart] = useState<number>(0)

  const handleOnLayout = ({ nativeEvent }: LayoutChangeEvent) =>
    setWidthChart(Math.round(nativeEvent.layout.width))

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
      onLayout={handleOnLayout}
    >
      {widthChart && (
        <>
          <VictoryPie
            innerRadius={50}
            labels={() => null}
            height={200}
            width={widthChart}
            padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
            colorScale={colors.pieChartColorScale}
            {...rest}
          />
          <VictoryLegend
            width={widthChart}
            colorScale={colors.pieChartColorScale}
            height={120}
            orientation="vertical"
            style={{
              labels: { fontSize: 20, fill: 'white' }
            }}
            data={rest.data}
          />
        </>
      )}
    </View>
  )
}

export default PieChart
