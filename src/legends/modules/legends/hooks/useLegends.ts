import { useEffect, useState } from 'react'

import { RELAYER_URL } from '@env'
import useAccountContext from '@legends/hooks/useAccountContext'
import { CardFromResponse, CardType } from '@legends/modules/legends/types'
import { sortCards } from '@legends/modules/legends/utils'

type UseLegendsReturnType = {
  legends: CardFromResponse[]
  isLoading: boolean
  error: string | null
  completedCount: number
}

const useLegends = (): UseLegendsReturnType => {
  const { connectedAccount } = useAccountContext()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [legends, setLegends] = useState<CardFromResponse[]>([])

  const completedCount = legends.filter((card) => card.card.type === CardType.done).length

  useEffect(() => {

    const fetchData = async () => {
      setError(null)
      try {
        const rawCards = await fetch(
          `${RELAYER_URL}/legends/cards?identity=${connectedAccount}`
        )

        const cards = await rawCards.json()

        const sortedCards = sortCards(cards)
        setLegends(sortedCards)
      } catch (e: any) {
        console.error(e)
        // handle error
        setError(
          'Internal error while fetching legends. Please reload the page or try again later.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [connectedAccount])

  return {
    legends,
    error,
    isLoading,
    completedCount
  }
}

export { useLegends }
