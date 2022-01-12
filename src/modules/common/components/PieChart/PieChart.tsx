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
const LEGEND_ROW_HEIGHT = 36

interface Props extends VictoryPieProps {}

const PieChart: React.FC<Props> = ({ data = [] }) => {
  const [widthChart, setWidthChart] = useState<number>(0)

  const handleOnLayout = ({ nativeEvent }: LayoutChangeEvent) =>
    setWidthChart(Math.round(nativeEvent.layout.width))

  const isEmptyState = !data.length
  const colorScale = isEmptyState ? colors.pieChartEmptyColorScale : colors.pieChartColorScale
  const innerRadius = isEmptyState ? 70 : 50

  return (
    <View style={[flexboxStyles.center]} onLayout={handleOnLayout}>
      {!!widthChart && (
        <>
          <VictoryPie
            innerRadius={innerRadius}
            labels={() => null}
            height={CHART_HEIGHT}
            width={widthChart}
            padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
            colorScale={colorScale}
            data={isEmptyState ? [{ y: 100 }] : data}
          />
          {!isEmptyState && (
            // Absolutely positioning VictoryLegend is not supported
            // therefore, position the extra legend content with custom View
            <View style={styles.extraLegend}>
              {data.map(({ y, name }) => (
                <Text key={name} style={styles.extraLegendText}>{`${y}%`}</Text>
              ))}
            </View>
          )}
          {!isEmptyState && (
            <VictoryLegend
              width={widthChart}
              colorScale={colorScale}
              height={LEGEND_ROW_HEIGHT * data.length}
              borderPadding={{ top: SPACING, bottom: 0, left: 0, right: 0 }}
              padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
              gutter={{ left: 0, right: 0 }}
              rowGutter={{ top: 0, bottom: 0 }}
              symbolSpacer={SPACING_TY}
              orientation="vertical"
              style={{ labels: { fontSize: 20, fill: 'white' } }}
              data={data}
            />
          )}
        </>
      )}
    </View>
  )
}

export default PieChart
