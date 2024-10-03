import React from 'react'

import styles from './Tabs.module.scss'

const Tab = ({
  children,
  isSelected,
  ...props
}: {
  children: React.ReactNode
  isSelected?: boolean
} & Omit<React.AnchorHTMLAttributes<HTMLButtonElement>, 'type'>) => {
  return (
    <button
      type="button"
      className={`${styles.tab} ${isSelected ? styles.selected : ''}`}
      {...props}
    >
      {children}
    </button>
  )
}

const Tabs = ({ children }: { children: React.ReactNode[] }) => {
  return <div className={styles.wrapper}>{children}</div>
}

Tabs.Tab = Tab

export default Tabs
