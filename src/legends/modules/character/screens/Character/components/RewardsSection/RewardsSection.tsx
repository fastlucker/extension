import React from 'react'

import SectionHeading from '../SectionHeading'
import styles from './RewardsSection.module.scss'

const RewardsSection = () => {
  return (
    <section className={styles.wrapper}>
      <SectionHeading>Rewards</SectionHeading>
      <div className={styles.items}>
        <div className={styles.item}>
          <h3 className={styles.itemTitle}>Balance required to earn rewards</h3>
          <div className={styles.progress}>
            <div className={styles.progressFill}>
              <span className={styles.progressCurrent}>$1200</span>
            </div>
            <span className={styles.progressMax}>$3000</span>
          </div>
        </div>
        <div className={styles.item}>
          <h3 className={styles.itemTitle}>Minimum potential earnings</h3>
          <div className={styles.rewardRateAndFormula}>
            <p className={styles.rewardRate}>543 stkWALLET / minute</p>
            <p className={styles.rewardFormula}>Formula: (xp / 69420)</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RewardsSection
