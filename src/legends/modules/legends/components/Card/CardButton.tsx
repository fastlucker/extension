import React from 'react'

import { PREDEFINED_ACTION_LABEL_MAP } from '@legends/modules/legends/constants'
import { CardAction, CardActionType } from '@legends/modules/legends/types'
import { handleCallsAction, handlePredefinedAction } from '@legends/modules/legends/utils'

import styles from './Card.module.scss'

const CardButton = ({ action }: { action: CardAction }) => {
  if (!action) return null

  return (
    <>
      {action.type === CardActionType.calls && (
        <button
          className={styles.button}
          type="button"
          onClick={() => handleCallsAction(action.calls)}
        >
          Proceed
        </button>
      )}
      {action.type === CardActionType.predefined && !!action.predefinedId && (
        <button
          className={styles.button}
          type="button"
          onClick={() => handlePredefinedAction(action.predefinedId)}
        >
          {PREDEFINED_ACTION_LABEL_MAP[action.predefinedId] || 'Proceed'}
        </button>
      )}
    </>
  )
}

export default CardButton
