import React, { FC, useCallback } from 'react'

import useToast from '@legends/hooks/useToast'
import CardActionButton from '@legends/modules/legends/components/Card/CardAction/actions/CardActionButton'
import { CARD_PREDEFINED_ID } from '@legends/modules/legends/constants'
import { CardAction, CardActionType, CardFromResponse } from '@legends/modules/legends/types'

import { InviteAcc, LinkAcc, SendAccOp, StakeWallet } from './actions'

export type CardActionComponentProps = {
  action: CardAction
  buttonText: string
  meta: CardFromResponse['meta']
}

const CardActionComponent: FC<CardActionComponentProps> = ({ meta, action, buttonText }) => {
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
        { type: 'error' }
      )
    }
  }, [action, addToast])

  if (action.type === CardActionType.predefined) {
    if (action.predefinedId === CARD_PREDEFINED_ID.inviteAccount) {
      return (
        <InviteAcc
          alreadyLinkedAccounts={meta?.alreadyLinkedAccounts || []}
          alreadyInvitedAccounts={meta?.alreadyInvitedAccounts || []}
          usedInvitationSlots={meta?.usedInvitationSlots || 0}
          buttonText={buttonText}
        />
      )
    }
    if (action.predefinedId === CARD_PREDEFINED_ID.linkAccount) {
      return <LinkAcc alreadyLinkedAccounts={meta?.alreadyLinkedAccounts || []} />
    }
    if (action.predefinedId === CARD_PREDEFINED_ID.staking) {
      return <StakeWallet />
    }

    return null
  }

  if (action.type === CardActionType.calls) {
    return <SendAccOp action={action} />
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
