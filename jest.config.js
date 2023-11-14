require('dotenv').config();




module.exports = {
    preset: 'jest-puppeteer',
    roots: [ 'tests' ],
    testTimeout: 90000,
    // transform: {
    //     "^.+\\.(js|jsx)$": "babel-jest"
    //   }
  };