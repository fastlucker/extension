/* eslint-disable react/no-unused-prop-types */
import './style.css'

import { Steps } from 'intro.js-react'
import React, { createContext, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Button from '@common/components/Button'
import Text from '@common/components/Text'
import flexbox from '@common/styles/utils/flexbox'

export const SmartAccountIntroId = 'smart-account-badge'
export const BasicAccountIntroId = 'basic-account-badge'

const AccountAdderIntroStepsContext = createContext<{
  showIntroSteps: boolean
  setShowIntroSteps: (show: boolean) => void
}>({
  showIntroSteps: false,
  setShowIntroSteps: () => {}
})

const initialStep = 0

const AccountAdderIntroStepsProvider: React.FC<any> = ({ children }) => {
  const [introCompleted, setIntroCompleted] = useState(false)
  const [showIntroSteps, setShowIntroSteps] = useState(false)
  const [stepIndex, setStepIndex] = useState(initialStep)
  const stepRef: any = useRef(null)

  const { t } = useTranslation()

  const step = useCallback(
    ({ title, text }: { title: string; text: string }) => {
      return (
        <div>
          <Text fontSize={16} weight="medium">
            {title}
          </Text>
          <Text fontSize={12} appearance="secondaryText">
            {text}
          </Text>
          <View style={[flexbox.directionRow, flexbox.alignCenter]} />
          <Button text="sdssds" type="secondary" disabled={false} />
        </div>
      )
    },
    [stepIndex, t]
  )
  console.log(stepRef.current)

  const steps = useMemo(() => {
    return [
      {
        element: `#${SmartAccountIntroId}`,
        position: 'top',
        intro: step({
          title: t('Smart Account'),
          text: t(
            'SA wallets include many security features such as account recovery and progressively upgraded security. In addition, you can pay for transactions in stablecoins, and do multiple actions in one transaction (transaction batching).'
          )
        })
      },
      {
        element: `#${BasicAccountIntroId}`,
        position: 'top',
        intro: step({
          title: t('Basic Account'),
          text: t(
            'We use the term Basic Account to describe the EOAs (Externally Owned Accounts). Unlike Smart Accounts, which provides many functionalities, EOAs only give you basic ones.'
          )
        })
      }
    ]
  }, [t, step])

  const onExit = () => {
    setShowIntroSteps(false)
  }

  const onComplete = () => {
    setIntroCompleted(true)
  }

  const onShowIntroSteps = useCallback(
    (show: boolean) => {
      if (!introCompleted) setShowIntroSteps(show)
    },
    [introCompleted]
  )

  const onChange = (index: number) => {
    console.log(index)
    setStepIndex(index)
  }

  return (
    <AccountAdderIntroStepsContext.Provider
      value={useMemo(
        () => ({
          showIntroSteps,
          setShowIntroSteps: onShowIntroSteps
        }),
        [showIntroSteps, onShowIntroSteps]
      )}
    >
      <Steps
        enabled={showIntroSteps}
        steps={steps}
        initialStep={initialStep}
        onExit={onExit}
        onChange={onChange}
        onComplete={onComplete}
        ref={stepRef}
      />
      {children}
    </AccountAdderIntroStepsContext.Provider>
  )
}

export { AccountAdderIntroStepsProvider, AccountAdderIntroStepsContext }
