export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        module: 'esnext',
        lib: ['ES2018', 'DOM'],
        types: ['jest', '@testing-library/jest-dom'],
      }
    }],
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '^../lib/supabase$': '<rootDir>/__mocks__/supabase.ts',
  },
};