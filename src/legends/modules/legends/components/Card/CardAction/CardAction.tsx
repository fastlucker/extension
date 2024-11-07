import React, { FC } from 'react'

import { CARD_PREDEFINED_ID } from '@legends/modules/legends/constants'
import { CardAction, CardActionType } from '@legends/modules/legends/types'

import SendAccOp from './actions/SendAccOp'
import LinkAcc from './actions/LinkAcc'
import SummonAcc from './actions/SummonAcc'

type Props = {
  action: CardAction
  buttonText: string
  onComplete: () => void
}

const CardActionComponent: FC<Props> = ({ action, buttonText, onComplete }) => {
  if (action.type === CardActionType.predefined) {
    if (action.predefinedId === CARD_PREDEFINED_ID.addEOA) {
      return <SummonAcc onComplete={onComplete} buttonText={buttonText} />
    }
    if (action.predefinedId === CARD_PREDEFINED_ID.LinkAccount) {
      return <LinkAcc onComplete={onComplete} buttonText={buttonText} />
    }

    return <div>Unhandled action predefinedId ${action.predefinedId}</div>
  }

  if (action.type === CardActionType.calls) {
    return <SendAccOp action={action} onComplete={onComplete} />
  }

  // No specific action type, then we don't need to show an action component (button).
  return null
}

export default CardActionComponent
