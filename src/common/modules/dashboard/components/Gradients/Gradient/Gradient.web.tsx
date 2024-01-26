import './gradient.css'

import React from 'react'

const Gradient = ({ style = {} }: { style?: React.CSSProperties }) => {
  return <div className="gradient" style={style} />
}

export default Gradient
