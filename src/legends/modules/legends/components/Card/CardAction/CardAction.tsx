import React, { FC, useCallback } from 'react'

import useToast from '@legends/hooks/useToast'
import CardActionButton from '@legends/modules/legends/components/Card/CardAction/actions/CardActionButton'
import { CARD_PREDEFINED_ID } from '@legends/modules/legends/constants'
import { CardAction, CardActionType } from '@legends/modules/legends/types'

import LinkAcc from './actions/LinkAcc'
import SendAccOp from './actions/SendAccOp'
import StakeWallet from './actions/StakeWallet'
import SummonAcc from './actions/SummonAcc'

type Props = {
  action: CardAction
  buttonText: string
  onComplete: () => void
}

const CardActionComponent: FC<Props> = ({ action, buttonText, onComplete }) => {
  const { addToast } = useToast()

  const handleWalletRouteButtonPress = useCallback(async () => {
    if (action.type !== CardActionType.walletRoute) return

    try {
      await window.ambire.request({
        method: 'open-wallet-route',
        params: { route: action.route }
      })
    } catch {
      addToast(
        'This action is not supported in the current extension version. It’s available in version 4.44.1. Please update!',
        'error'
      )
    }
  }, [action, addToast])

  if (action.type === CardActionType.predefined) {
    if (action.predefinedId === CARD_PREDEFINED_ID.addEOA) {
      return <SummonAcc onComplete={onComplete} buttonText={buttonText} />
    }
    if (action.predefinedId === CARD_PREDEFINED_ID.LinkAccount) {
      return <LinkAcc onComplete={onComplete} />
    }
    if (action.predefinedId === CARD_PREDEFINED_ID.staking) {
      return <StakeWallet onComplete={onComplete} />
    }
    if (action.predefinedId === CARD_PREDEFINED_ID.Referral) {
      return null
    }

    return <div>Unhandled action predefinedId ${action.predefinedId}</div>
  }

  if (action.type === CardActionType.calls) {
    return <SendAccOp action={action} onComplete={onComplete} />
  }

  if (action.type === CardActionType.link) {
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

  if (action.type === CardActionType.walletRoute && window.ambire) {
    return (
      <CardActionButton
        buttonText="Proceed"
        onButtonClick={handleWalletRouteButtonPress}
        loadingText=""
      />
    )
  }

  // No specific action type, then we don't need to show an action component (button).
  return null
}

export default CardActionComponent
