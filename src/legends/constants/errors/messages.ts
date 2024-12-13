export const RETRY_OR_SUPPORT_MESSAGE =
  'Please try again, and if the issue persists, contact our support team.'

export const ERROR_MESSAGES = {
  transactionCostsCoveredWithEOA:
    "Transaction costs covered with an EOA (Basic Account) don't earn XP. To earn XP, please use the Gas Tank or tokens from this Smart Account to cover the gas fees.",
  transactionRejected: 'Transaction has been rejected!',
  messageSigningFailed: `Message signing failed. ${RETRY_OR_SUPPORT_MESSAGE}`,
  transactionSigningFailed: `Transaction signing failed. ${RETRY_OR_SUPPORT_MESSAGE}`,
  networkSwitchFailed: `Failed to switch network. ${RETRY_OR_SUPPORT_MESSAGE}`,
  transactionProcessingFailed: `Failed to process the transaction. ${RETRY_OR_SUPPORT_MESSAGE}`
}
