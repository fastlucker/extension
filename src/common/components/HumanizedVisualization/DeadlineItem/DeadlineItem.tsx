import React, { FC, memo, useEffect, useState } from 'react'

import { getDeadlineText } from '@ambire-common/libs/humanizer/utils'
import Text from '@common/components/Text'

interface Props {
  deadline: bigint
  textSize: number
  marginRight: number
}

const DeadlineItem: FC<Props> = ({ deadline, textSize, marginRight }) => {
  const [deadlineText, setDeadlineText] = useState(getDeadlineText(deadline))
  const remainingTime = deadline - BigInt(Date.now())
  const minute: bigint = 60000n

  useEffect(() => {
    let updateAfter = Number(minute)

    // more then 10mints
    if (remainingTime > 10n * minute) updateAfter = Number(remainingTime - 10n * minute)
    // if 0< and <10 minutes
    if (remainingTime > 0 && remainingTime < 10n * minute)
      updateAfter = Number(remainingTime % minute)
    // if just expired
    if (remainingTime < 0 && remainingTime > -2n * minute)
      updateAfter = Number(2n * minute + remainingTime)
    // if long expired
    if (remainingTime < -2n * minute) updateAfter = Number(10n * minute)

    // this triggeres use effect after 'updateAfter' milliseconds by updating the text
    const timeoutId = setTimeout(() => {
      setDeadlineText(getDeadlineText(deadline))
    }, updateAfter)

    return () => clearTimeout(timeoutId)
  }, [deadlineText, deadline, minute, remainingTime])

  return (
    <Text fontSize={textSize} weight="medium" appearance="warningText" style={{ marginRight }}>
      {`(${deadlineText})`}
    </Text>
  )
}

export default memo(DeadlineItem)
