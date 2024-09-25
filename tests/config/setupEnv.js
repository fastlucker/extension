import dotenv from 'dotenv'
import { validateEnvVariables } from './envValidator'

export const loadEnv = () => {
  try {
    // Check if the environment is running in CI (GitHub Actions sets the CI environment variable)
    if (process.env.CI) {
      console.log('Running in CI environment, skipping .env file loading...')
      return
    }

    // Clear the dotenv cache to ensure fresh loading of environment variables
    delete require.cache[require.resolve('dotenv')]

    // Load environment variables from the .env file
    const { parsed, error } = dotenv.config()

    if (error) {
      throw new Error(`Failed to load .env file: ${error.message}`)
    }

    if (!Object.keys(parsed).length) {
      throw new Error('No environment variables were loaded from the .env file.')
    }

    validateEnvVariables(parsed)

    return parsed
  } catch (error) {
    console.error('Error loading environment variables:', error.message)
    throw error
  }
}
