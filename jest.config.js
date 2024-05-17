const path = require('path')
const baseConfig = require('./src/ambire-common/jest.config.js')

module.exports = {
  ...baseConfig,
  displayName: 'Ambire Extension Unit Tests',
  testPathIgnorePatterns: [
    path.join('<rootDir>', 'tests/'), // E2E tests, handled by another configuration
    path.join('<rootDir>', 'src/ambire-common/'), // Tests for the ambire-common library, handled by another configuration
    path.join('<rootDir>', 'node_modules/'),
    // Mobile builds
    path.join('<rootDir>', 'android/'),
    path.join('<rootDir>', 'ios/'),
    // Extension builds
    path.join('<rootDir>', 'webkit-dev/'),
    path.join('<rootDir>', 'webkit-prod/'),
    path.join('<rootDir>', 'gecko-prod/'),
    path.join('<rootDir>', 'gecko-dev/'),
    // Benzin builds
    path.join('<rootDir>', 'benzin-dev/'),
    path.join('<rootDir>', 'benzin-prod/'),
    path.join('<rootDir>', 'build/'),
    // Misc
    path.join('<rootDir>', '\\.[^/]+'), // Matches any directory starting with a dot
    path.join('<rootDir>', 'recorder/'), // E2E tests video recorder files
    path.join('<rootDir>', 'vendor/') // Ruby
  ],
  setupFiles: []
}
