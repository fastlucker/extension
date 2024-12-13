import React from 'react'

import Title from '@legends/modules/landing/components/Title'

import styles from './Adventure.module.scss'
import image1 from './assets/image1.jpg'
import image2 from './assets/image2.jpg'
import image3 from './assets/image3.jpg'
import image4 from './assets/image4.jpg'

const ITEMS = [
  {
    image: image1,
    title: 'Embark on Quests',
    text: 'Take on thrilling quests to uncover the superpowers of Smart Accounts and start earning XP'
  },
  {
    image: image2,
    title: 'Accumulate XP',
    text: 'Complete each quest to earn valuable XP and move closer to unlocking higher levels'
  },
  {
    image: image3,
    title: 'Level Up',
    text: 'Growing your XP balance makes your character level up and boosts your reward potential'
  },
  {
    image: image4,
    title: 'Secure Rewards',
    text: 'Reach higher levels and maximize your XP to secure greater incentive distribution'
  }
]

const Adventure = () => {
  return (
    <div className={styles.wrapper}>
      <Title title="Discover the World of Ambire Legends" className={styles.title} />
      <div className={styles.items}>
        {ITEMS.map((item) => (
          <div key={item.title} className={styles.item}>
            <img src={item.image} alt={item.title} className={styles.itemImage} />
            <h3 className={styles.itemTitle}>{item.title}</h3>
            <p className={styles.itemText}>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Adventure
