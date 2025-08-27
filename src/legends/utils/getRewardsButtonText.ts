export function getRewardsButtonText({
  connectedAccount,
  v1Account,
  isCharacterNotMinted
}: {
  connectedAccount: string | null | undefined
  v1Account: boolean | null | undefined
  isCharacterNotMinted: boolean | null | undefined
}): string {
  if (!connectedAccount) return 'Connect your wallet to unlock Rewards quests.'
  if (v1Account)
    return 'Switch to a new account to unlock Rewards quests. Ambire legacy Web accounts (V1) are not supported.'
  if (isCharacterNotMinted) return 'Join Rewards to start accumulating XP'
  return 'Proceed'
}
