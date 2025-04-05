// Mock for next-safe-action
module.exports = {
  createSafeActionClient: jest.fn().mockReturnValue({
    schema: jest.fn().mockReturnThis(),
    action: jest.fn().mockReturnThis(),
    use: jest.fn().mockReturnThis(),
  }),
  DEFAULT_SERVER_ERROR_MESSAGE: 'An unexpected error occurred',
}; 