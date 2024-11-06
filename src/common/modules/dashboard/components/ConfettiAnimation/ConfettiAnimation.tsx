import './styles.css'

import LottieView, { LottieComponentProps } from 'lottie-react'
import React from 'react'

import animation from './animation.json'

const ConfettiAnimation = ({
  width,
  height,
  style,
  ...rest
}: { width: number; height: number; style: React.CSSProperties } & Omit<
  LottieComponentProps,
  'animationData'
>) => {
  return (
    <LottieView
      animationData={animation}
      style={{
        width,
        height,
        position: 'absolute',
        pointerEvents: 'none',
        alignSelf: 'center',
        ...style
      }}
      loop={false}
      {...rest}
    />
  )
}

export default React.memo(ConfettiAnimation)
