export const buildFeeTokenSelector = (accAddress, feeTokenAddress, gasTank = false) =>
  `[data-testid="option-${accAddress.toLowerCase()}${feeTokenAddress}${gasTank ? 'gastank' : ''}"]`

export async function checkMinimumBalance(page, balanceSelector, minBalanceInUsd) {
  // Get the total balance text content from the page
  const totalBalanceIntegerText = await page.$eval(
    balanceSelector,
    (element) => element.textContent
  )

  // Remove dollar sign and parse as an integer
  const trimmedTotalBalanceInteger = parseInt(totalBalanceIntegerText.replace('$', ''), 10)

  // Check if the balance is less than or equal to the minimum required balance
  if (trimmedTotalBalanceInteger <= minBalanceInUsd) {
    throw new Error(
      `The total balance of $${trimmedTotalBalanceInteger} is lower than: $${minBalanceInUsd}`
    )
  }
}
