import React, { useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import { VictoryPie } from 'victory-native'
import { VictoryPieProps } from 'victory-pie'

import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

import styles from './styles'

const CHART_HEIGHT = 200

interface Props extends VictoryPieProps {}

const PieChart: React.FC<Props> = ({ data = [], ...rest }) => {
  const [widthChart, setWidthChart] = useState<number>(0)

  const handleOnLayout = ({ nativeEvent }: LayoutChangeEvent) =>
    setWidthChart(Math.round(nativeEvent.layout.width))

  const isEmptyState = !data.length
  const colorScale = isEmptyState ? colors.pieChartEmptyColorScale : colors.pieChartColorScale
  const innerRadius = isEmptyState ? 70 : 50

  const getItemColor = (index: number) => {
    const colorCount = colorScale.length - 1
    return index > colorCount
      ? colorScale[index - colorScale.length * Math.trunc(index / colorScale.length)]
      : colorScale[index]
  }

  return (
    <View style={flexboxStyles.center} onLayout={handleOnLayout}>
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
            {...rest}
          />
          {!isEmptyState &&
            // Positioning and aligning VictoryLegend component with this
            // structure, turned out to be a nightmare...
            // Therefore, use custom components as legend content instead.
            // TODO: Eventually, convert this to a flat list
            data.map(({ y, name }, i) => (
              <View key={name} style={[styles.row, i === 0 && spacings.mt]}>
                <View style={flexboxStyles.directionRow}>
                  <View style={[styles.symbol, { backgroundColor: getItemColor(i) }]} />
                  <Text style={styles.label}>{name}</Text>
                </View>
                <Text style={styles.value}>{`${y}%`}</Text>
              </View>
            ))}
        </>
      )}
    </View>
  )
}

export default PieChart
