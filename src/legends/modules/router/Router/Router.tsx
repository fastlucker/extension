import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Home from '@legends/modules/router/components/Home'
import Leaderboard from '@legends/modules/router/components/Leaderboard'

const Router = () => {
  return (
    <Routes>
      <Route index path="/" element={<Home />} />
      <Route index path="/leaderboard" element={<Leaderboard />} />
    </Routes>
  )
}

export default Router
