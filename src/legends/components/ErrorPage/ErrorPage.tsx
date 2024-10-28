import React, { FC } from 'react'

import Alert from '../Alert'
import styles from './ErrorPage.module.scss'

type Props = {
  title?: string
  error?: string
}

const ErrorPage: FC<Props> = ({ title, error }) => {
  const onButtonClick = () => {
    window.location.reload()
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.mbLg}>
        <img src="/images/logo.png" alt="Ambire Logo" className={styles.logo} />
      </div>
      <div className={styles.mb}>
        <h1 className={styles.title}>Oops. Something went wrong!</h1>
        <h2 className={styles.subtitle}>
          Please reload the page. If the problem persists, please contact support.
        </h2>
      </div>
      {title && error ? (
        <div className={styles.mb}>
          <Alert type="error" title={title} message={error} />
        </div>
      ) : null}
      <button onClick={onButtonClick} type="button" className={styles.button}>
        Reload
      </button>
    </div>
  )
}

export default ErrorPage
