// function for finding and clicking on a dom element
// by default the function will wait for the button element to become enabled in order to click on it

export async function clickOnElement(page, selector, waitUntilEnabled = true, clickDelay = 0) {
  const elementToClick = await page.waitForSelector(selector, { visible: true })

  const executeClick = async () => {
    if (clickDelay > 0) await new Promise((resolve) => setTimeout(resolve, clickDelay))
    if (!elementToClick) return
    try {
      return await elementToClick.click()
    } catch (error) {
      // sometimes the button is in the DOM and it is enabled but it is not in the area of the screen
      // where it can be clicked. In that case settings a small timeout before clicking works just fine
      // but a more reliable option is to use page.$eval
      await page.$eval(selector, (el) => el.click())
    }
  }

  const waitForClickable = async () => {
    const isClickable = await page.evaluate((selector) => {
      try {
        const buttonElement = document.querySelector(selector)
        return (
          !!buttonElement &&
          !buttonElement.disabled &&
          window.getComputedStyle(buttonElement).pointerEvents !== 'none'
        )
      } catch (error) {
        // Some Puppeteer selectors are not valid for querySelector.
        // In such cases, skip the enabled check and assume the button should be enabled.
        // This is because accessing the actual DOM element and checking its properties is not straightforward in that case
        return true
      }
    }, selector)

    if (isClickable === 'disabled') return

    if (isClickable) {
      return executeClick()
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
    await waitForClickable()
    return 'disabled'
  }

  if (waitUntilEnabled) {
    await waitForClickable()
  } else {
    await executeClick()
  }
}
