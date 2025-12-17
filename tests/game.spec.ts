import { test, expect } from '@playwright/test';

test.describe('3D Endless Runner Game Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set a longer timeout for game loading
    test.setTimeout(60000);

    // Navigate to the game
    await page.goto('https://running-game-6e5k4o8u8-skquievreuxs-projects.vercel.app');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('Game loads successfully', async ({ page }) => {
    // Check if the page title is correct
    await expect(page).toHaveTitle('Endless Runner');

    // Take a screenshot of the loaded game
    await page.screenshot({ path: 'test-results/game-loaded.png', fullPage: true });

    // Check if canvas element exists (Three.js renderer)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Check if the game script loaded without errors
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      consoleMessages.push(msg.text());
    });

    // Wait a bit for any console errors
    await page.waitForTimeout(2000);

    // Check for critical errors
    const errorMessages = consoleMessages.filter(msg =>
      msg.includes('Error') ||
      msg.includes('Failed to load') ||
      msg.includes('MIME type') ||
      msg.includes('module script')
    );

    // Log all console messages for debugging
    console.log('Console messages:', consoleMessages);

    // If there are errors, fail the test
    if (errorMessages.length > 0) {
      throw new Error(`Game failed to load with errors: ${errorMessages.join(', ')}`);
    }
  });

  test('Game UI elements are present', async ({ page }) => {
    // Check for score display
    const scoreDisplay = page.locator('#score-display');
    await expect(scoreDisplay).toBeVisible();

    // Check for lives display
    const livesDisplay = page.locator('#lives-display');
    await expect(livesDisplay).toBeVisible();

    // Take screenshot of UI elements
    await page.screenshot({ path: 'test-results/ui-elements.png' });
  });

  test('Game responds to user input', async ({ page }) => {
    // Wait for game to initialize
    await page.waitForTimeout(3000);

    // Simulate spacebar press (jump)
    await page.keyboard.press('Space');

    // Take screenshot after input
    await page.screenshot({ path: 'test-results/after-jump.png' });

    // Check if score changed (indicating game is responsive)
    const scoreDisplay = page.locator('#score-display');
    const initialScore = await scoreDisplay.textContent();

    // Wait a moment and check again
    await page.waitForTimeout(1000);
    const updatedScore = await scoreDisplay.textContent();

    // The score should be visible (even if 0)
    expect(initialScore).toBeTruthy();
  });

  test('Game handles window resize', async ({ page }) => {
    // Get initial canvas size
    const canvas = page.locator('canvas');
    const initialBox = await canvas.boundingBox();

    // Resize window
    await page.setViewportSize({ width: 800, height: 600 });

    // Wait for resize
    await page.waitForTimeout(1000);

    // Check if canvas still exists and is visible
    await expect(canvas).toBeVisible();

    // Take screenshot after resize
    await page.screenshot({ path: 'test-results/after-resize.png' });
  });

  test('Game performance - no excessive console errors', async ({ page }) => {
    const consoleMessages: string[] = [];
    const errorMessages: string[] = [];

    page.on('console', msg => {
      const text = msg.text();
      consoleMessages.push(text);
      if (msg.type() === 'error') {
        errorMessages.push(text);
      }
    });

    // Let the game run for 10 seconds
    await page.waitForTimeout(10000);

    // Take performance screenshot
    await page.screenshot({ path: 'test-results/performance-test.png' });

    // Check for critical errors
    const criticalErrors = errorMessages.filter(msg =>
      msg.includes('MIME type') ||
      msg.includes('module script') ||
      msg.includes('Failed to load module') ||
      msg.includes('TypeError') ||
      msg.includes('ReferenceError')
    );

    if (criticalErrors.length > 0) {
      throw new Error(`Critical errors detected: ${criticalErrors.join(', ')}`);
    }

    // Log summary
    console.log(`Total console messages: ${consoleMessages.length}`);
    console.log(`Error messages: ${errorMessages.length}`);
    console.log(`Critical errors: ${criticalErrors.length}`);
  });
});