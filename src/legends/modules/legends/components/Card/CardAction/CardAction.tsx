import React, { FC } from 'react'

import { CardAction, CardActionType } from '@legends/modules/legends/types'

import SummonEOA from './actions/SummonEOA'

type Props = {
  action: CardAction
  buttonText: string
}

const CardActionComponent: FC<Props> = ({ action, buttonText }) => {
  if (action.type === CardActionType.calls) {
    return <div>TODO: calls</div>
  }

  if (action.type === CardActionType.predefined) {
    if (action.predefinedId === 'addEOA') {
      return <SummonEOA buttonText={buttonText} />
    }
  }

  return <div>Invalid action type</div>
}

export default CardActionComponent
