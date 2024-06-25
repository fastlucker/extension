const path = require('path')
require('dotenv').config()

module.exports = {
  rootDir: '../',
  displayName: 'Ambire Extension E2E Tests',
  preset: 'jest-puppeteer',
  roots: ['tests'],
  // Longer timeout than the default one needed for heavier dapps, like https://myetherwallet.com,
  // otherwise, tests fail because the default timeout gets reached.
  testTimeout: 120000,
  // TODO: Concurrently running all E2E tests cause random failures, causing
  // timeouts to get reached for some tests (sometimes). Limiting the
  // concurrently running test suites solved the glitch, but that's a temporary
  // solution. We need to investigate the root cause of the random failures
  // and timeouts and fix them.
  maxWorkers: 1,
  testPathIgnorePatterns: [
    // FIXME: Temporary disable running the smart account tests, until they are running correctly
    // path.join('<rootDir>', 'tests/smart_account')
  ]
}
