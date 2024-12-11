type CardProps = {
  onComplete: (txnId: string) => Promise<void>
  handleClose: () => void
}

export type { CardProps }
