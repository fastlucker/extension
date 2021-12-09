import React, { createContext, useMemo, useState } from 'react'

type AuthContextData = {
  token: string | null
  logIn: () => any
}

const AuthContext = createContext<AuthContextData>({ token: null, logIn: () => {} })

const AuthProvider: React.FC = ({ children }) => {
  const [token, setToken]: any = useState(null)

  const logIn = async () => {
    setToken('token')
  }

  return (
    <AuthContext.Provider value={useMemo(() => ({ token, logIn }), [token, logIn])}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
