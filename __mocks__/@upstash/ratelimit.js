// Mock for @upstash/ratelimit
module.exports = {
  Duration: '1h', // Mock duration value
  Ratelimit: jest.fn().mockImplementation(() => ({
    limit: jest.fn().mockResolvedValue({ success: true, limit: 10, remaining: 9, reset: Date.now() + 3600000 }),
  })),
}; 