require('dotenv').config()

module.exports = {
  name: 'web',
  displayName: 'Browser Extension',
  preset: 'jest-puppeteer',
  roots: ['tests'],
  // Longer timeout than the default one needed for heavier dapps, like https://myetherwallet.com,
  // otherwise, tests fail because the default timeout gets reached.
  testTimeout: 30000
}
