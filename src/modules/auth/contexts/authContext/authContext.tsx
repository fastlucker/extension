import React, { createContext, Dispatch, useMemo, useState } from 'react'

type AuthContextData = {
  isAuthenticated: boolean
  setIsAuthenticated: Dispatch<React.SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContextData>({
  isAuthenticated: false,
  setIsAuthenticated: () => false,
})

const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({ isAuthenticated, setIsAuthenticated }),
        [isAuthenticated, setIsAuthenticated]
      )}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
