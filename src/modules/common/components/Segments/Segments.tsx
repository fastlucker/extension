import React, { useCallback, useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import Text from '@modules/common/components/Text'
import textStyles from '@modules/common/styles/utils/text'

import styles from './styles'

type SegmentProps = {
  value: string
  icon?: Element
}

type SegmentsProps = SegmentProps[]

interface Props {
  defaultValue: string
  segments: SegmentsProps
  onChange: (val: string) => any
}

const Segments = ({ defaultValue, segments, onChange }: Props) => {
  const [value, setValue] = useState<any>(defaultValue)

  const setSegment = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (value) => {
      setValue(value)
      onChange(value)
    },
    [onChange]
  )

  useEffect(() => {
    setSegment(defaultValue)
  }, [defaultValue, setSegment])

  return (
    <View style={styles.container}>
      {segments.map((segment) => (
        <TouchableOpacity
          style={[styles.segment, segment.value === value && styles.active]}
          key={segment.value}
          onPress={() => setSegment(segment.value)}
        >
          {!!segment.icon && segment.icon}
          <Text style={segment.value === value && textStyles.bold}>{segment.value}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default Segments
