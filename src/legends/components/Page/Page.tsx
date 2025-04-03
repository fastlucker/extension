import React, { useState } from 'react'

import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Sidebar from '@legends/components/Sidebar'

import styles from './Page.module.scss'

const Page = ({
  children,
  pageRef,
  style,
  containerSize = 'md'
}: {
  children: React.ReactNode | React.ReactNode[]
  pageRef?: React.RefObject<HTMLDivElement>
  style?: React.CSSProperties
  containerSize?: 'md' | 'lg'
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const openSidebar = () => setIsSidebarOpen(true)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <div className={styles.wrapper}>
      <Sidebar handleClose={closeSidebar} isOpen={isSidebarOpen} />
      <div ref={pageRef} className={styles.scroll} style={style}>
        <div className={`${styles.container} ${styles[`container${containerSize}`]}`}>
          <div className={styles.header}>
            <button className={styles.sidebarButton} type="button" onClick={openSidebar}>
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Page
