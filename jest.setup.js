// Jest setup file
dotenv.config({ path: '.env.test' });

// Mock external services if needed
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
