export async function checkForSignMessageWindow(page, extensionURL, browser) {
  let actionWindowPage = page

  // Check if "sign-message" action-window is open
  if (actionWindowPage.url().endsWith('/sign-message')) {
    console.log('New window before transaction is open')
    // If the selector exists, click on it
    await actionWindowPage.click('[data-testid="button-sign"]')

    const newPagePromise2 = await browser.waitForTarget(
      (target) => target.url() === `${extensionURL}/action-window.html#/sign-account-op`
    )
    const newPageTarget = await newPagePromise2

    actionWindowPage = await newPageTarget.page()
    actionWindowPage.setDefaultTimeout(120000)
  }

  return { actionWindowPage }
}
