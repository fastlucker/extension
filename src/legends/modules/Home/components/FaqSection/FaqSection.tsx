import React from 'react'

import Accordion from '@legends/components/Accordion'

import SectionHeading from '../SectionHeading'
import styles from './FaqSection.module.scss'

const FaqSection = () => {
  const faqData = [
    {
      question: 'Is Legends a game?',
      answer:
        'Ambire Legends isn’t a traditional game, but rather a gamified way to explore smart accounts and earn rewards. Ambire Legends isn’t a traditional game, but rather a gamified way to explore smart accounts and earn.'
    }
  ]

  return (
    <div className={styles.wrapper}>
      <SectionHeading>FAQ</SectionHeading>
      {faqData.map((faq, index) => (
        <Accordion key={index} title={faq.question}>
          <p>{faq.answer}</p>
        </Accordion>
      ))}
    </div>
  )
}

export default FaqSection
