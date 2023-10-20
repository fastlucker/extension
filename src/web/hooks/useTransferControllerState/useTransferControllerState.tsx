import { useContext } from 'react'

import { TransferControllerStateContext } from '@web/contexts/transferControllerStateContext'

export default function useTransferControllerState() {
  const context = useContext(TransferControllerStateContext)

  if (!context) {
    throw new Error(
      'usePortfolioControllerState must be used within a PortfolioControllerStateContext'
    )
  }

  return context
}
