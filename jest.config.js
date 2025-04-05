/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: [
    // This tells Jest to transform node_modules that use ES modules
    'node_modules/(?!(next-safe-action)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Add mapping for next-safe-action to use our mock
    '^next-safe-action$': '<rootDir>/__mocks__/next-safe-action.js',
    // Add mapping for @upstash/ratelimit to use our mock
    '^@upstash/ratelimit$': '<rootDir>/__mocks__/@upstash/ratelimit.js',
    // Add mapping for safe-action-helpers to use our mock
    '^./safe-action-helpers$': '<rootDir>/__mocks__/safe-action-helpers.js',
    // Add mapping for observability-middleware to use our mock
    '^./observability-middleware$': '<rootDir>/__mocks__/observability-middleware.js',
    // Add mapping for ratelimit.middleware to use our mock
    '^./ratelimit.middleware$': '<rootDir>/__mocks__/ratelimit.middleware.js',
  },
}; 