import React, { useState } from 'react'

import CoinIcon from '@legends/common/assets/svg/CoinIcon/CoinIcon'
import Crown from '@legends/common/assets/svg/CrownIcon/CrownIcon'
import Diamond from '@legends/common/assets/svg/DiamondIcon/DiamondIcon'
import Alert from '@legends/components/Alert'
import Modal from '@legends/components/Modal'
import Stacked from '@legends/components/Stacked'
import useCharacterContext from '@legends/hooks/useCharacterContext'
import useLeaderboardContext from '@legends/hooks/useLeaderboardContext'
import usePortfolioControllerState from '@legends/hooks/usePortfolioControllerState/usePortfolioControllerState'

import styles from './CharacterSection.module.scss'

const LONG_NAME_THRESHOLD = 10

const CharacterSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { character } = useCharacterContext()
  const { accountPortfolio } = usePortfolioControllerState()
  const { userLeaderboardData } = useLeaderboardContext()
  const { isReady, amountFormatted, amount } = accountPortfolio || {}

  if (!character)
    return (
      <Alert
        className={styles.error}
        type="error"
        title="Failed to load character"
        message="Please try again later or contact support if the issue persists."
      />
    )

  const xpForNextLevel = Math.ceil(((character.level + 1) * 4.5) ** 2)

  const startXpForCurrentLevel = character.level === 1 ? 0 : Math.ceil((character.level * 4.5) ** 2)

  const openDescriptionModal = () => {
    setIsModalOpen(true)
  }

  return (
    <section className={styles.wrapper}>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen} className={styles.modal}>
        <Modal.Heading className={styles.modalTitle}>Description</Modal.Heading>
        <Modal.Text className={styles.modalText}>{character?.description}</Modal.Text>
      </Modal>
      <div className={styles.characterInfo}>
        <span className={styles.kicker}>YOUR CHARACTER</span>
        <div className={styles.characterNameWrapper}>
          <h1
            className={`${styles.characterName} ${
              character?.characterName.length > LONG_NAME_THRESHOLD ? styles.small : ''
            }`}
          >
            {character?.characterName}
          </h1>

          <div
            className={styles.infoIcon}
            onClick={openDescriptionModal}
            onKeyPress={(e) => {
              if (e.key === 'Enter') openDescriptionModal()
            }}
            role="button"
            tabIndex={0}
          >
            i
          </div>
        </div>

        <div className={styles.characterLevelInfoWrapper}>
          <div className={styles.characterItemWrapper}>
            <CoinIcon className={`${styles.icon} ${styles.iconCoin}`} width={64} height={64} />
            <div className={styles.levelWrapper}>
              <div className={`${styles.levelInfo} ${styles.levelInfoTop}`}>
                <span className={styles.level}>Lvl. {character.level}</span>
                <span className={styles.level}>Lvl. {character.level + 1}</span>
              </div>
              <div className={styles.levelProgress}>
                <span className={styles.xp}>{character.xp} XP</span>

                <div
                  className={styles.levelProgressBar}
                  style={{
                    width: `${(
                      ((character.xp - startXpForCurrentLevel) /
                        (xpForNextLevel - startXpForCurrentLevel)) *
                      100
                    ).toFixed(2)}%`
                  }}
                />
              </div>
              <div className={styles.levelInfo}>
                <span className={styles.level}>{startXpForCurrentLevel}</span>
                <span className={styles.level}>{xpForNextLevel}</span>
              </div>
            </div>
          </div>

          <div className={styles.logoAndBalanceWrapper}>
            <div className={styles.logoWrapper}>
              <Stacked chains={['ethereum', 'base', 'arbitrum', 'scroll', 'optimism']} />
            </div>
            <div className={styles.characterItemWrapper}>
              <Diamond className={`${styles.icon} ${styles.iconDiamond}`} width={64} height={64} />
              <div className={styles.characterItem}>
                <span className={styles.item}>
                  {isReady && amount ? amountFormatted : 'Loading...'}
                </span>
                Wallet Balance
              </div>
            </div>
          </div>

          <div className={styles.characterItemWrapper}>
            <Crown className={`${styles.icon} ${styles.iconDiamond}`} width={64} height={64} />
            <div className={styles.characterItem}>
              <span className={styles.item}>{userLeaderboardData?.rank}</span>
              Leaderboard
            </div>
          </div>
        </div>
      </div>
      <div className={styles.character}>
        <div className={styles.characterRelativeWrapper}>
          <img className={styles.characterImage} src={character.image} alt="" />
        </div>
      </div>
    </section>
  )
}

export default CharacterSection
