const path = require('path')
require('dotenv').config()

module.exports = {
  rootDir: '../',
  displayName: 'Ambire Extension E2E Tests',
  preset: 'jest-puppeteer',
  roots: ['tests'],
  moduleFileExtensions: ['ts', 'js'],
  transformIgnorePatterns: [
    '/node_modules/(?!@trezor/trezor-user-env-link).+\\.js$'
  ],
  // Longer timeout than the default one needed for heavier dapps, like https://myetherwallet.com,
  // otherwise, tests fail because the default timeout gets reached.
  testTimeout: 120000,
  // Limit the number of workers to prevent performance degradation.
  // Running multiple workers simultaneously can significantly slow down the tests,
  // causing them to fail randomly due to exceeding timeout limits.
  // https://github.com/argos-ci/jest-puppeteer?tab=readme-ov-file#ci-timeout
  maxWorkers: 1,
  testPathIgnorePatterns: [
    // Ignore specified test paths to speed up the testing process during debugging
    // DEFAULT: no paths should be ignored
    // path.join('<rootDir>', 'tests/smart_account')
    // path.join('<rootDir>', 'tests/basic_account')
  ],
  reporters: [
    "default",
    ["jest-html-reporter", {
      outputPath: "./tests/reports/test-report.html",
      includeFailureMsg: true,
      includeConsoleLog: true,
      customInfos: [
        { title: 'Screenshots', value: '<a href="./screenshots">View Screenshots</a>' },
        { title: 'Videos', value: '<a href="./videos">View Videos</a>' }
      ]
    }]
  ]
}
