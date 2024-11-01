import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { RELAYER_URL } from '@env'
import useAccountContext from '@legends/hooks/useAccountContext'
import useActivityContext from '@legends/hooks/useActivityContext'
import { isWheelSpinTodayDone } from '@legends/modules/legends/components/WheelComponentModal/helpers'
import { CardFromResponse, CardType } from '@legends/modules/legends/types'
import { sortCards } from '@legends/modules/legends/utils'

type LegendsContextType = {
  legends: CardFromResponse[]
  isLoading: boolean
  error: string | null
  completedCount: number
  getLegends: () => void
  wheelSpinOfTheDay: boolean
}

const legendsContext = createContext<LegendsContextType>({
  legends: [],
  isLoading: true,
  error: null,
  completedCount: 0,
  getLegends: () => {},
  wheelSpinOfTheDay: false
})

const LegendsContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { lastConnectedV2Account, isConnectedAccountV2 } = useAccountContext()

  const { activity } = useActivityContext()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [legends, setLegends] = useState<CardFromResponse[]>([])

  const completedCount = useMemo(
    () => legends.filter((card) => card.card.type === CardType.done).length,
    [legends]
  )

  const wheelSpinOfTheDay = useMemo(
    () => isWheelSpinTodayDone({ legends, activity }),
    [legends, activity]
  )

  const getLegends = useCallback(async () => {
    setError(null)
    try {
      const rawCards = await fetch(
        `${RELAYER_URL}/legends/cards?identity=${lastConnectedV2Account}`
      )

      const cards = await rawCards.json()
      const sortedCards = sortCards(cards, isConnectedAccountV2)
      setLegends(sortedCards)
    } catch (e: any) {
      setError('Internal error while fetching legends. Please reload the page or try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [lastConnectedV2Account, isConnectedAccountV2])

  useEffect(() => {
    if (!lastConnectedV2Account) return
    getLegends()
  }, [isConnectedAccountV2, lastConnectedV2Account, getLegends])

  const contextValue = useMemo(
    () => ({
      legends,
      isLoading,
      error,
      completedCount,
      getLegends,
      wheelSpinOfTheDay
    }),
    [legends, isLoading, error, completedCount, getLegends, wheelSpinOfTheDay]
  )

  return <legendsContext.Provider value={contextValue}>{children}</legendsContext.Provider>
}

export { LegendsContextProvider, legendsContext }
