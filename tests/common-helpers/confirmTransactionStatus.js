import { ethers, Network } from 'ethers'

export async function confirmTransactionStatus(
  actionWindowPage,
  networkName,
  chainID,
  transactionRecorder
) {
  const currentURL = await actionWindowPage.url()
  return
  // Split the URL by the '=' character and get the transaction hash
  const parts = currentURL.split('=')
  const transactionHash = parts[parts.length - 1]

  // Create a provider instance using the JsonRpcProvider
  const staticNetwork = Network.from(chainID)
  const provider = new ethers.JsonRpcProvider(
    `https://invictus.ambire.com/${networkName}`,
    staticNetwork,
    { staticNetwork }
  )

  // Get transaction receipt
  const receipt = await provider.getTransactionReceipt(transactionHash)

  await transactionRecorder.stop()

  console.log(`Transaction Hash: ${transactionHash}`)
  console.log('getTransactionReceipt result', receipt)
  // Assertion to fail the test if transaction failed
  expect(receipt.status).toBe(1)
}
