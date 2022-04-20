import React, { createContext, useMemo, useState } from 'react'

export enum CARDS {
  Ambire = 'Ambire',
  AAVE = 'AAVE',
  YearnTesseract = 'YearnTesseract'
}

type CardsVisibilityData = {
  visibleCard?: CARDS | null
  setVisibleCard: (cardName: CARDS | null) => void
}

const CardsVisibilityContext = createContext<CardsVisibilityData>({
  visibleCard: null,
  setVisibleCard: () => {}
})

const CardsVisibilityProvider: React.FC = ({ children }) => {
  const [visibleCard, setVisibleCard] = useState<CARDS | null>(null)

  return (
    <CardsVisibilityContext.Provider
      value={useMemo(
        () => ({
          visibleCard,
          setVisibleCard
        }),
        [visibleCard]
      )}
    >
      {children}
    </CardsVisibilityContext.Provider>
  )
}

export { CardsVisibilityContext, CardsVisibilityProvider }
