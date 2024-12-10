import React, { FC } from 'react'

import CardActionButton from '@legends/modules/legends/components/Card/CardAction/actions/CardActionButton'
import { CARD_PREDEFINED_ID } from '@legends/modules/legends/constants'
import { CardAction } from '@legends/modules/legends/types'

import LinkAcc from './actions/LinkAcc'
import SendAccOp from './actions/SendAccOp'
import SummonAcc from './actions/SummonAcc'

type Props = {
  action: CardAction
  buttonText: string
  onComplete: () => void
}

const CardActionComponent: FC<Props> = ({ action, buttonText, onComplete }) => {
  if (action.type === 'predefined') {
    if (action.predefinedId === CARD_PREDEFINED_ID.addEOA) {
      return <SummonAcc onComplete={onComplete} buttonText={buttonText} />
    }
    if (action.predefinedId === CARD_PREDEFINED_ID.LinkAccount) {
      return <LinkAcc onComplete={onComplete} />
    }

    return <div>Unhandled action predefinedId ${action.predefinedId}</div>
  }

  if (action.type === 'calls') {
    return <SendAccOp action={action} onComplete={onComplete} />
  }

  if (action.type === 'link') {
    return (
      <CardActionButton
        buttonText="Proceed"
        onButtonClick={() => {
          window.open(action.link, '_blank')
        }}
        loadingText=""
      />
    )
  }

  if (action.type === 'wallet-route' && window.ambire) {
    return (
      <CardActionButton
        buttonText="Proceed"
        onButtonClick={() => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          window.ambire.request({
            method: 'open-wallet-route',
            params: { route: action.route }
          })
        }}
        loadingText=""
      />
    )
  }

  // No specific action type, then we don't need to show an action component (button).
  return null
}

export default CardActionComponent
