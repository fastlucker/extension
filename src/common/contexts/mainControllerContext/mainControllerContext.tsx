import { MainController } from 'ambire-common/src/controllers/main/main'
import { Storage } from 'ambire-common/src/interfaces/storage'
import React, { createContext, useMemo } from 'react'

const MainControllerContext = createContext({})

// TODO: Use storage from useStorage browser storage
function produceMemoryStore(): Storage {
  const storage = new Map()
  return {
    get: (key, defaultValue): any => {
      const serialized = storage.get(key)
      return Promise.resolve(serialized ? JSON.parse(serialized) : defaultValue)
    },
    set: (key, value) => {
      storage.set(key, JSON.stringify(value))
      return Promise.resolve(null)
    }
  }
}

// TODO: Implementation of init of MainController in background.ts
// TODO: Handle onUpdate function from MainController
const MainControllerProvider = ({ children }: any) => {
  const controller = useMemo(() => new MainController(produceMemoryStore()), [])

  return (
    <MainControllerContext.Provider value={controller}>{children}</MainControllerContext.Provider>
  )
}

export { MainControllerContext, MainControllerProvider }
