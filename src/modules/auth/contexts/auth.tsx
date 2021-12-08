import React, { createContext, useContext, useMemo, useState } from 'react'

type AuthContextData = {
  token: string | null
  logIn: () => any
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

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

function useAuth(): AuthContextData {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export { AuthContext, AuthProvider, useAuth }
