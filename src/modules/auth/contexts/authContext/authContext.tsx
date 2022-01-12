import React, { createContext, Dispatch, useEffect, useMemo, useState } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'

type AuthContextData = {
  isAuthenticated: boolean
  setIsAuthenticated: Dispatch<React.SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContextData>({
  isAuthenticated: false,
  setIsAuthenticated: () => false
})

const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  const initState = async () => {
    const selectedAcc = await AsyncStorage.getItem('selectedAcc')
    setIsAuthenticated(!!selectedAcc)
  }

  useEffect(() => {
    initState()
  }, [])

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
