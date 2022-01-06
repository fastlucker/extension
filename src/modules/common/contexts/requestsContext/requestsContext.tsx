import React, { createContext, useMemo, useState } from 'react'

type RequestsContextData = {
  internalRequests: any
  addRequest: (req: any) => any
}

const RequestsContext = createContext<RequestsContextData>({
  internalRequests: [],
  addRequest: () => {}
})

const RequestsProvider: React.FC = ({ children }) => {
  const [internalRequests, setInternalRequests] = useState<any>([])
  console.log('Internal requests: ', internalRequests)

  const addRequest = (req: any) => setInternalRequests((reqs: any) => [...reqs, req])

  return (
    <RequestsContext.Provider
      value={useMemo(() => ({ internalRequests, addRequest }), [internalRequests, addRequest])}
    >
      {children}
    </RequestsContext.Provider>
  )
}

export { RequestsContext, RequestsProvider }
