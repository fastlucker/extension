import { CardAction, CardFromResponse, CardType } from '@legends/modules/legends/types'

const sortByHighestXp = (a: CardFromResponse, b: CardFromResponse) => {
  const totalAXp = a.xp.reduce((acc, xp) => acc + xp.to + xp.from, 0)
  const totalBXp = b.xp.reduce((acc, xp) => acc + xp.to + xp.from, 0)

  return totalBXp - totalAXp
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
  switch (predefinedId) {
    case 'addEOA':
      alert('Add EOA')
      break
    case 'linkX':
      alert('Link X')
      break
    default:
      alert('Unknown action')
  }
  console.log(predefinedId)
}

const handleCallsAction = (calls: CardAction['calls']) => {
  // window.ambire.request(calls)
  console.log(calls)
}

export { sortCards, handlePredefinedAction, handleCallsAction }
