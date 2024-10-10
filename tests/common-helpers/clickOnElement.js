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

        if (!buttonElement) return false

        const style = window.getComputedStyle(buttonElement)
        const rect = buttonElement.getBoundingClientRect()

        // Extensive check for validating if the element is clickable.
        // This is necessary because some elements are part of an animated wrapper, such as modals.
        // When we invoke `clickOnElement`, these elements are theoretically clickable as they are part of the DOM,
        // and the click is executed.
        // However, at the same time, this click doesn't trigger any changes in the React component (the reason is unclear).
        // To ensure we are clicking on truly visible elements (as a real user would), we add these validations.
        const isClickableByCSS = style.pointerEvents !== 'none'
        const isVisibleOnTheScreen = rect.width > 0 && rect.height > 0
        const isNotOutOfViewport = rect.top >= 0 && rect.left >= 0
        const isInsideViewPortVertically =
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        const isInsideViewportHorizontally =
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)

        return (
          !buttonElement.disabled && // not disabled
          isClickableByCSS &&
          isVisibleOnTheScreen &&
          isNotOutOfViewport &&
          isInsideViewPortVertically &&
          isInsideViewportHorizontally
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
