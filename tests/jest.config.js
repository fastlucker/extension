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
  maxWorkers: 1,
  testPathIgnorePatterns: [
    // FIXME: Temporary disable running the smart account tests, until they are running correctly
    // path.join('<rootDir>', 'tests/smart_account')
  ]
}
