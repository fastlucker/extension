import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { RELAYER_URL } from '@env'
import Spinner from '@legends/components/Spinner'
import useAccountContext from '@legends/hooks/useAccountContext'

type Character = {
  characterType: 'unknown' | 'slime' | 'sorceress' | 'necromancer' | 'penguin'
  characterName: string
  name: string
  description: string
  level: number
  xp: number
  image: string
  image_avatar: string
  address: string
}

type CharacterContextValue = {
  character: Character | null
  getCharacter: () => void
  isLoading: boolean
  error: string | null
}

const CharacterContext = createContext<CharacterContextValue>({} as CharacterContextValue)

const CharacterContextProvider: React.FC<any> = ({ children }) => {
  const { connectedAccount } = useAccountContext()
  const [character, setCharacter] = useState<Character | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  // In case of this error, a global <ErrorPage /> will be rendered in place of all other components,
  // as loading a character is crucial for playing in Legends.
  const [error, setError] = useState<string | null>(null)

  const getCharacter = useCallback(async () => {
    if (!connectedAccount) {
      setCharacter(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const characterResponse = await fetch(`${RELAYER_URL}/legends/nft-meta/${connectedAccount}`)

      const characterJson = await characterResponse.json()

      if (characterJson.characterType === 'unknown') {
        setIsLoading(false)
        setCharacter(null)
        return
      }

      setCharacter({
        ...(characterJson as Character),
        address: connectedAccount
      })
      setError(null)
    } catch (e) {
      console.error(e)

      throw e
    } finally {
      setIsLoading(false)
    }
  }, [connectedAccount])

  useEffect(() => {
    getCharacter().catch(() => {
      setError(`Couldn't load the requested character: ${connectedAccount}`)
    })
  }, [connectedAccount, getCharacter])

  const contextValue = useMemo(
    () => ({
      character,
      getCharacter,
      isLoading,
      error
    }),
    [character, getCharacter, isLoading, error]
  )

  // Important: Short-circuit evaluation to prevent loading of child contexts/components
  // in the case character's address mismatches the currently connected account.
  // We should only load child contexts if the character's address matches the connected account.
  // How can this mismatch occur?
  // If we're connected to a v2 account, `character.address` and `connectedAccounts` should match.
  // However, when switching to another v2 account without a character, there may be a brief delay as the new character is fetched.
  // During this delay, child contexts could try to operate with the new `connectedAccount` but the previous `character`, which is incorrect.
  // This validation ensures `connectedAccount` and `character` are always in sync.
  if (character && character.address !== connectedAccount) return <Spinner isCentered />

  return <CharacterContext.Provider value={contextValue}>{children}</CharacterContext.Provider>
}

export { CharacterContextProvider, CharacterContext }
