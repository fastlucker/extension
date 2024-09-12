import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Home from '@legends/modules/router/components/Home'

const Router = () => {
  return (
    <Routes>
      <Route index path="/" element={<Home />} />
    </Routes>
  )
}

export default Router
