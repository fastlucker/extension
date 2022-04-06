import React, { useCallback, useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import Text from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'

import styles from './styles'

type SegmentProps = {
  value: string
  icon?: Element
}

type SegmentsProps = SegmentProps[]

interface Props {
  defaultValue: string
  segments: SegmentsProps
  onChange: (val: any) => any
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
      {segments.map((segment, i) => (
        <TouchableOpacity
          key={segment.value}
          style={[
            styles.segment,
            segment.value === value && styles.active,
            i < segments.length - 1 && spacings.mrMd
          ]}
          onPress={() => setSegment(segment.value)}
        >
          {!!segment.icon && segment.icon}
          <Text fontSize={16} weight={segment.value === value ? 'medium' : 'regular'}>
            {segment.value}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default Segments
