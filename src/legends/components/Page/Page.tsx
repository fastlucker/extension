import React, { useState } from 'react'

import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import AccountDropdown from '../AccountDropdown'
import Sidebar from '../Sidebar'
import styles from './Page.module.scss'

const Page = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const openSidebar = () => setIsSidebarOpen(true)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <div className={styles.wrapper}>
      <Sidebar handleClose={closeSidebar} isOpen={isSidebarOpen} />
      <div className={styles.scroll}>
        <div className={styles.container}>
          <div className={styles.header}>
            <button className={styles.sidebarButton} type="button" onClick={openSidebar}>
              <FontAwesomeIcon icon={faBars} />
            </button>
            <AccountDropdown />
          </div>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Page
