import { useEffect, useState } from 'react'

import { fetchGet } from '@common/services/fetch'
import { RELAYER_URL } from '@env'
import useAccountContext from '@legends/hooks/useAccountContext'
import { CardFromResponse, CardType } from '@legends/modules/legends/types'
import { sortCards } from '@legends/modules/legends/utils'

type UseLegendsReturnType = {
  legends: CardFromResponse[]
  isLoading: boolean
  error: string | null
  completedCount: number
  getLegends: () => void
}

const useLegends = (): UseLegendsReturnType => {
  const { lastConnectedV2Account, isConnectedAccountV2 } = useAccountContext()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [legends, setLegends] = useState<CardFromResponse[]>([])

  const completedCount = legends.filter((card) => card.card.type === CardType.done).length

  const fetchData = async () => {
    setError(null)
    try {
      const rawCards = await fetchGet(
        `${RELAYER_URL}/legends/cards?identity=${lastConnectedV2Account}`
      )

      const sortedCards = sortCards(rawCards, isConnectedAccountV2)
      setLegends(sortedCards)
    } catch (e: any) {
      console.error(e)
      // handle error
      setError('Internal error while fetching legends. Please reload the page or try again later.')
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    if (!lastConnectedV2Account) return

    fetchData()
  }, [isConnectedAccountV2, lastConnectedV2Account])

  return {
    legends,
    error,
    isLoading,
    completedCount,
    getLegends: fetchData
  }
}

export { useLegends }
