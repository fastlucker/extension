import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder'
import { clickOnElement } from './clickOnElement'

export async function triggerTransaction(
  page,
  extensionURL,
  browser,
  triggerTransactionSelector,
  shouldNotClick = false
) {
  if (shouldNotClick) {
    await clickOnElement(page, triggerTransactionSelector)
  }

  const newTarget = await browser.waitForTarget((target) =>
    target.url().startsWith(`${extensionURL}/action-window.html#`)
  )
  const actionWindowPage = await newTarget.page()
  actionWindowPage.setDefaultTimeout(120000)
  actionWindowPage.setViewport({ width: 1300, height: 700 })

  // Start the screen recorder
  const transactionRecorder = new PuppeteerScreenRecorder(actionWindowPage, { followNewTab: true })
  await transactionRecorder.start(`./recorder/txn_action_window_${Date.now()}.mp4`)

  return { actionWindowPage, transactionRecorder }
}
