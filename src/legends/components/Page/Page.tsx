import React, { useState } from 'react'

import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AccountInfo from '@legends/components/AccountInfo'
import Sidebar from '@legends/components/Sidebar'
import useAccountContext from '@legends/hooks/useAccountContext'

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
  containerSize?: 'md' | 'lg' | 'full'
}) => {
  const customContainerSizeClass = styles[`container${containerSize}`] || ''
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const { connectedAccount, nonV2Account } = useAccountContext()

  const openSidebar = () => setIsSidebarOpen(true)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <div className={styles.wrapper}>
      <Sidebar handleClose={closeSidebar} isOpen={isSidebarOpen} />
      <div ref={pageRef} className={`${styles.scroll} ${customContainerSizeClass}`} style={style}>
        <div className={`${styles.container} ${customContainerSizeClass}`}>
          <div className={styles.header}>
            <button className={styles.sidebarButton} type="button" onClick={openSidebar}>
              <FontAwesomeIcon icon={faBars} />
            </button>
            {connectedAccount && !nonV2Account && (
              <div className={styles.account}>
                <AccountInfo />
              </div>
            )}
          </div>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Page
