export async function checkBalanceOfToken(page, tokenSelector, tokenMinimumBalance) {
  const tokenText = await page.$eval(tokenSelector, (element) => element.textContent)

  // Extract token balance and network
  const tokenBalance = parseFloat(tokenText.match(/^\d*\.?\d+/)[0])
  const tokenMatches = tokenText.match(/\s(.*?)\$/)

  const tokenAndNetwork = tokenMatches[1].trim()

  if (tokenBalance < tokenMinimumBalance) {
    throw new Error(`There is NOT enough funds, Balance: ${tokenBalance} ${tokenAndNetwork}`)
  }
}
