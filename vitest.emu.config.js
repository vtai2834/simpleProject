import { defineConfig } from 'vitest/config'

// Test chạy với Firestore Emulator (cần Java). Chạy bằng: npm run test:emu
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    fileParallelism: false,
    testTimeout: 20000,
    env: {
      VITE_USE_EMULATOR: 'true',
      VITE_FIREBASE_PROJECT_ID: 'demo-gacha-2010',
      VITE_FIREBASE_API_KEY: 'fake-key',
      VITE_FIREBASE_APP_ID: 'fake-app',
    },
  },
})
