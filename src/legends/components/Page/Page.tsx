import React, { useState } from 'react'

import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import usePortfolioControllerState from '@legends/hooks/usePortfolioControllerState/usePortfolioControllerState'

import Sidebar from '../Sidebar'
import styles from './Page.module.scss'

const Page = ({
  children,
  pageRef
}: {
  children: React.ReactNode | React.ReactNode[]
  pageRef?: React.RefObject<HTMLDivElement>
}) => {
  const { accountPortfolio } = usePortfolioControllerState()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const openSidebar = () => setIsSidebarOpen(true)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <div className={styles.wrapper}>
      <Sidebar handleClose={closeSidebar} isOpen={isSidebarOpen} />
      <div ref={pageRef} className={styles.scroll}>
        <div className={styles.container}>
          <div className={styles.header}>
            <button className={styles.sidebarButton} type="button" onClick={openSidebar}>
              <FontAwesomeIcon icon={faBars} />
            </button>
            {accountPortfolio?.address && (
              <p className={styles.account}>Account: {accountPortfolio.address}</p>
            )}
          </div>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Page
