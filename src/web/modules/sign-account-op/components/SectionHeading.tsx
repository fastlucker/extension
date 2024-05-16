import React, { FC } from 'react'

import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'

interface Props {
  children: React.ReactNode
}

const SectionHeading: FC<Props> = ({ children }) => {
  return (
    <Text fontSize={20} weight="medium" style={spacings.mbLg}>
      {children}
    </Text>
  )
}

export default SectionHeading
