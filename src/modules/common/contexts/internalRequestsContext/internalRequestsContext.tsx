import React, { createContext, useMemo, useState } from 'react'

type InternalRequestsContextData = {
  internalRequests: any
  addRequest: (req: any) => any
}

const InternalRequestsContext = createContext<InternalRequestsContextData>({
  internalRequests: [],
  addRequest: () => {}
})

const InternalRequestsProvider: React.FC = ({ children }) => {
  const [internalRequests, setInternalRequests] = useState<any>([])

  const addRequest = (req: any) => setInternalRequests((reqs: any) => [...reqs, req])

  return (
    <InternalRequestsContext.Provider
      value={useMemo(() => ({ internalRequests, addRequest }), [internalRequests, addRequest])}
    >
      {children}
    </InternalRequestsContext.Provider>
  )
}

export { InternalRequestsContext, InternalRequestsProvider }
