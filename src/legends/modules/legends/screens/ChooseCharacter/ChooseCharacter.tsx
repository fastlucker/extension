import React from 'react'

import useAccountContext from '@legends/hooks/useAccountContext'
import useCharacterContext from '@legends/hooks/useCharacterContext'
import { Navigate } from 'react-router-dom'

const ChooseCharacter = () => {
  const accountContext = useAccountContext()
  const characterContext = useCharacterContext()

  if (!accountContext.connectedAccount) return <Navigate to="/" />
  if (characterContext.character === undefined) return <div />
  if (characterContext.character.characterType !== 'unknown') return <Navigate to="/legends" />

  return (
    <div style={{ display: 'flex' }}>
      <label>
        <strong>Choose Character</strong>
      </label>
      <select onChange={(event) => characterContext.mintCharacter(Number(event.target.value))}>
        <option value={1}>Character 1</option>
        <option value={2}>Character 2</option>
        <option value={3}>Character 3</option>
      </select>
    </div>
  )
}

export default ChooseCharacter
