import { useEffect, useState } from 'react'

import { fetchGet } from '@common/services/fetch'
import { RELAYER_URL } from '@env'
import { CardFromResponse, CardType } from '@legends/modules/legends/types'
import { sortCards } from '@legends/modules/legends/utils'

type UseLegendsReturnType = {
  legends: CardFromResponse[]
  isLoading: boolean
  error: string | null
  completedCount: number
}

const useLegends = ({
  connectedAccount
}: {
  connectedAccount: string | null
}): UseLegendsReturnType => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [legends, setLegends] = useState<CardFromResponse[]>([])

  const completedCount = legends.filter((card) => card.card.type === CardType.done).length

  useEffect(() => {
    if (!connectedAccount) return

    const fetchData = async () => {
      setError(null)
      try {
        const rawCards = await fetchGet(`${RELAYER_URL}/legends/cards?identity=${connectedAccount}`)

        const sortedCards = sortCards(rawCards)
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
