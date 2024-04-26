import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

// Set environment url
process.env.node_url = process.env.NODE_URL
  ? `${process.env.NODE_URL}`
  : process.env.base_url;

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  use: {
    // All requests we send go to this API endpoint.
    baseURL: process.env.node_url,
    extraHTTPHeaders: {
      // // We set this header per GitHub guidelines.
      // Accept: 'application/vnd.github.v3+json',
      // // Add authorization token to all requests.
      // // Assuming personal access token available in the environment.
      // Authorization: `token ${process.env.API_TOKEN}`,
    },
  },
  retries: process.env.CI ? 2 : 0,
  expect: {
    timeout: 10000,
  },
  reporter: 'list',
  timeout: 60000,
});
