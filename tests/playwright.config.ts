import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

process.env.node_url = process.env.NODE_URL
  ? `${process.env.NODE_URL}`
  : process.env.base_url;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  use: {
    baseURL: process.env.node_url,
    extraHTTPHeaders: {},
  },
  retries: process.env.CI ? 2 : 0,
  expect: {
    timeout: 10000,
  },
  reporter: process.env.CI
    ? 'dot'
    : [['list'], ['html', { outputDir: './playwright-report' }]],
  timeout: 60000,
});
