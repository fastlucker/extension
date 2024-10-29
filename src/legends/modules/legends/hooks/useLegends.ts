import { useCallback, useEffect, useMemo, useState } from 'react'

import { RELAYER_URL } from '@env'
import useAccountContext from '@legends/hooks/useAccountContext'
import useActivityContext from '@legends/hooks/useActivityContext'
import { isWheelSpinTodayDone } from '@legends/modules/legends/components/WheelComponentModal/helpers'
import { CardFromResponse, CardType } from '@legends/modules/legends/types'
import { sortCards } from '@legends/modules/legends/utils'

type UseLegendsReturnType = {
  legends: CardFromResponse[]
  isLoading: boolean
  error: string | null
  completedCount: number
  getLegends: () => void
  wheelSpinOfTheDay: boolean
}

const useLegends = (): UseLegendsReturnType => {
  const { lastConnectedV2Account, isConnectedAccountV2 } = useAccountContext()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [legends, setLegends] = useState<CardFromResponse[]>([])
  const { activity } = useActivityContext()

  const completedCount = legends.filter((card) => card.card.type === CardType.done).length
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
      // handle error
      setError('Internal error while fetching legends. Please reload the page or try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [lastConnectedV2Account, isConnectedAccountV2])

  useEffect(() => {
    if (!lastConnectedV2Account) return

    getLegends()
  }, [isConnectedAccountV2, lastConnectedV2Account, getLegends])

  return {
    legends,
    error,
    isLoading,
    completedCount,
    getLegends,
    wheelSpinOfTheDay
  }
}

export { useLegends }
