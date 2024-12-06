import React, { FC } from 'react'

import Sword from './components/Sword'
import styles from './Counter.module.scss'

type Props = {
  width: number
  height: number
  count: number
  className?: string
}

const Counter: FC<Props> = ({ width, height, count = 0, className }) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <Sword width={width} height={height} />
      <div className={styles.count}>{count}</div>
    </div>
  )
}

export default Counter
