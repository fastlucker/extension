/**
 * Log all page console.log messages.
 * The messages are sent as strings, as Puppeteer can't read more complex structures.
 */
export async function serviceWorkerLogger(serviceWorker) {
  // Enable the logger, only if E2E_DEBUG is set to 'true'.
  // The same rule is applied in backgrounds.ts too.
  if (process.env.E2E_DEBUG !== 'true') return

  const CDPSessionClient = serviceWorker.client

  await CDPSessionClient.send('Console.enable')

  CDPSessionClient.on('Console.messageAdded', async ({ message: { text } }) => {
    try {
      // The controllers' state is sent as a stringified JSON with the jsonRich library,
      // which is why we need to parse it back.
      // It would be better to use jsonRich.parse here, but it's written in TypeScript, while all E2E test files are in pure JS.
      // So we made a compromise and copied the parsing function instead of refactoring all the tests.
      const parsed = JSON.parse(text, (key, value) => {
        if (value?.$bigint) {
          return BigInt(value.$bigint)
        }
        return value
      })
      console.log(parsed)
    } catch (e) {
      // We wrapped the parsing in a try/catch block because it's very likely that the string is not a JSON string.
      // In that case, the parsing will fail, and we will simply show the string message.
      console.log(text)
    }
  })
}
