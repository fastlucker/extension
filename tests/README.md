# Puppeteer tests documentation
## How to run the tests locally to check if they pass:
These steps should be followed when you simply want to check if the tests pass. If you are making changes or writing new tests, you should follow
the steps in the section `Writing new tests or modifying existing ones`.

1. Set the required `.env` variables (refer to `.github/workflows/tests.yml`).
2. Run `yarn run test:e2e:web`. This command builds the production version of the extension and runs the tests against the `/webkit-prod` folder.
3. If you are writing new tests, it is helpful to have a visual display to see how the tests are performing. In this case, you can skip the next section. It explains how to create a virtual display (not visible to us) that enables running the tests in a CI environment. To use your local display, run `export DISPLAY=:0`.

### Important:
Some linux environments may require additional setup to run the tests.

- Fedora: You need to run `xhost +local:$(whoami)` to authorize the current user to connect to the X11 server.

## How to simulate CI environment?
If you are fixing a failing CI test and want to mimic the CI environment, you should configure the display server as follows:

1. Install Xvfb (the steps vary depending on your OS).
2. Run `Xvfb -ac :99 -screen 0 1280x1024x16 > /dev/null 2>&1 &`.
3. Set the DISPLAY variable with `export DISPLAY=:99.0`.

### Important
When changing the DISPLAY environment variable, its value is not updated in the `./tests/functions.js` file. However, modifying the file, such as by adding `console.log(process.env.DISPLAY)` within `functions.js -> bootstrap()`, will update the DISPLAY value. This behavior may be due to Jest caching, but the exact reason is not yet known.

## How to switch back to your local display?
Run `export DISPLAY=:0`.

## Writing new tests or modifying existing ones
1. Make sure you have all necessary `.env` variables set.
2. Run the project with `yarn run web:webkit`.
2. Run `test:e2e:web:dev`- It uses the hot-reloaded webpack dev build and allows us to run individual tests easily. When debugging or writing a new test, it is easier to use this command, as the project is hot-reloaded with every change you make to the codebase (e.g., adding a new selector or debugging a state), eliminating the need for a complete production build (as before). Additionally, you can run tests for a single or multiple test files.
  
### How to run tests for a single test file?
1. Locate `test:e2e:web:dev` in `package.json`.
2. Replace the placeholder test file with your desired test file.4
3. Run the command.

## Log and debug controllers' state in CI
1. Add `E2E_DEBUG='true'` in the `.env` file locally or the CI environment.

### Important:
Keep in mind that the logs can get quite large, as we log the controllers' state on every single update. Therefore, when debugging, it's recommended to run it for a single test. Most likely, you're debugging one or two failing tests, so this is the best option. If you need it for multiple or all tests, once the GitHub Action completes, it's better to download the raw log files as they are large and the GitHub UI gets really slow.


## Puppeteer gotchas
Here are some important points to keep in mind when working with Puppeteer:

1. Regardless of whether we have a visual display or not, we always run the tests with `headless: false`. This is because extensions in Chrome/Chromium currently only work in non-headless mode.
