import { CardAction, CardFromResponse, CardType } from '@legends/modules/legends/types'

const sortByHighestXp = (a: CardFromResponse, b: CardFromResponse) => {
  return b.xp[0].to - a.xp[0].to
}

const sortCards = (cards: CardFromResponse[]) => {
  return cards.sort((a, b) => {
    const order = {
      [CardType.available]: 1,
      [CardType.recurring]: 2,
      [CardType.done]: 3
    }

    // Sort by card type
    if (order[a.card.type] !== order[b.card.type]) {
      return order[a.card.type] - order[b.card.type]
    }

    // Sort by highest XP
    return sortByHighestXp(a, b)
  })
}

const handlePredefinedAction = (predefinedId?: string) => {
  if (!predefinedId) {
    alert('Internal error')
    return
  }
  console.log(predefinedId)
}

const handleCallsAction = (calls: CardAction['calls']) => {
  console.log(calls)
}

export { sortCards, handlePredefinedAction, handleCallsAction }
