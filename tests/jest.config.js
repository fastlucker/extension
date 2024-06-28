const path = require('path')
require('dotenv').config()

module.exports = {
  rootDir: '../',
  displayName: 'Ambire Extension E2E Tests',
  preset: 'jest-puppeteer',
  roots: ['tests'],
  // Longer timeout than the default one needed for heavier dapps, like https://myetherwallet.com,
  // otherwise, tests fail because the default timeout gets reached.
  testTimeout: 360000,
  testPathIgnorePatterns: [
    // Ignore specified test paths to speed up the testing process during debugging
    // DEFAULT: no paths should be ignored
    // path.join('<rootDir>', 'tests/smart_account'),
    // path.join('<rootDir>', 'tests/basic_account')
  ]
}
