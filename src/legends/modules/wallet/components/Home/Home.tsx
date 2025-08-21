import React, { useEffect, useRef } from 'react'

import OverachieverBanner from '@legends/components/OverachieverBanner'
import RewardsBadge from '@legends/components/RewardsBadge'
import usePortfolioControllerState from '@legends/hooks/usePortfolioControllerState/usePortfolioControllerState'

import walletCoin from './assets/wallet-coin.png'
import styles from './Home.module.scss'

const Home = () => {
  const { walletTokenInfo, isLoadingWalletTokenInfo } = usePortfolioControllerState()
  const stakedWallet = walletTokenInfo && walletTokenInfo.percentageStakedWallet

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://widgets.coingecko.com/gecko-coin-price-chart-widget.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script) // cleanup on unmount
    }
  }, [])

  return (
    <>
      <div className={styles.overachieverWrapper}>
        <OverachieverBanner wrapperClassName={styles.overachieverBanner} />
      </div>
      <RewardsBadge />
      <section className={`${styles.wrapper}`}>
        <div className={styles.walletInfo}>
          <div className={styles.chartWrapper}>
            {/* @ts-ignore - Custom element from CoinGecko widget */}
            <gecko-coin-price-chart-widget
              locale="en"
              dark-mode="true"
              transparent-background="true"
              coin-id="ambire-wallet"
              initial-currency="usd"
              width="440"
            />
          </div>

          <div className={styles.walletLevelInfoWrapper}>
            <div className={styles.walletItemWrapper}>
              <span className={styles.item}>
                {isLoadingWalletTokenInfo
                  ? 'Loading...'
                  : stakedWallet === null
                  ? 0
                  : `${stakedWallet.toFixed(2)}%`}
              </span>
              Staked $WALLET
              <div className={styles.walletInfoWrapper} />
            </div>

            <div className={styles.walletItemWrapper}>
              <span className={styles.item}>
                {isLoadingWalletTokenInfo
                  ? 'Loading...'
                  : walletTokenInfo?.apy === null
                  ? 0
                  : `${walletTokenInfo?.apy.toFixed(2)}%`}
              </span>
              Staking APY
              <div className={styles.walletInfoWrapper} />
            </div>

            <div className={styles.walletItemWrapper}>
              <span className={styles.item}>
                {isLoadingWalletTokenInfo
                  ? 'Loading...'
                  : walletTokenInfo?.walletPrice !== undefined &&
                    walletTokenInfo?.totalSupply !== undefined
                  ? new Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      maximumFractionDigits: 2
                    }).format(walletTokenInfo.walletPrice * walletTokenInfo.totalSupply)
                  : ''}
              </span>
              <div className={styles.walletInfoWrapper}>Market Cap</div>
            </div>
          </div>
        </div>
        <div
          className={styles.walletBlurEffect}
          style={{ backgroundImage: `url(${walletCoin})` }}
        />

        <div className={styles.wallet}>
          <div className={styles.walletRelativeWrapper}>
            <img className={styles.walletImage} src={walletCoin} alt="wallet-coin" />
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
