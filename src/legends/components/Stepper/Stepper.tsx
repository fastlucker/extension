import React from 'react'

import styles from './Stepper.module.scss'

interface StepperProps {
  steps: string[]
  activeStep: number
  className?: string
}

const Stepper: React.FC<StepperProps> = ({ steps, activeStep, className }) => {
  return (
    <ol className={`${styles.stepper} ${className}`}>
      {steps.map((step, index) => (
        <li
          key={step}
          className={`${styles.stepperItem} ${activeStep > index ? styles.complete : ''} ${
            activeStep === index ? styles.active : ''
          }`}
        >
          <span className={styles.stepperCounter} />
          <span className={styles.stepperLabel}>{step}</span>
          <span className={styles.stepperLine} />
        </li>
      ))}
    </ol>
  )
}

export default Stepper
