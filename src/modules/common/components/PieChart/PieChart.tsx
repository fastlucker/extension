import React, { useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import { VictoryLegend, VictoryPie } from 'victory-native'
import { VictoryPieProps } from 'victory-pie'

import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import { SPACING, SPACING_TY } from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import styles from './styles'

const CHART_HEIGHT = 200
const LEGEND_ROW_HEIGHT = 40

interface Props extends VictoryPieProps {}

const PieChart: React.FC<Props> = (rest) => {
  const [widthChart, setWidthChart] = useState<number>(0)

  const handleOnLayout = ({ nativeEvent }: LayoutChangeEvent) =>
    setWidthChart(Math.round(nativeEvent.layout.width))

  return (
    <View style={[flexboxStyles.center]} onLayout={handleOnLayout}>
      {!!widthChart && (
        <>
          <VictoryPie
            innerRadius={50}
            labels={() => null}
            height={CHART_HEIGHT}
            width={widthChart}
            padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
            colorScale={colors.pieChartColorScale}
            {...rest}
          />
          {/* Absolutely positioning VictoryLegend is not supported */}
          {/* therefore, position the extra legend content with custom View */}
          <View style={styles.extraLegend}>
            {rest.data?.map((d) => (
              <Text style={styles.extraLegendText}>{`${d.y}%`}</Text>
            ))}
          </View>
          <VictoryLegend
            width={widthChart}
            colorScale={colors.pieChartColorScale}
            height={LEGEND_ROW_HEIGHT * 2}
            borderPadding={{ top: SPACING, bottom: 0, left: 0, right: 0 }}
            gutter={{ left: 0, right: 0 }}
            rowGutter={{ top: 0, bottom: 0 }}
            symbolSpacer={SPACING_TY}
            orientation="vertical"
            style={{ labels: { fontSize: 20, fill: 'white' } }}
            data={rest.data}
          />
        </>
      )}
    </View>
  )
}

export default PieChart
