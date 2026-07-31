import { test, expect } from '@playwright/test';

/**
 * E2E 测试：代码编辑器交互和进度管理（2级路由）
 */

test.describe('代码编辑器', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/course/1');
  });

  test('课时页应该显示代码编辑器区域', async ({ page }) => {
    const editor = page.locator('.codejar-editor').first();
    await expect(editor).toBeVisible({ timeout: 15000 });
  });

  test('课时页应该显示输出面板', async ({ page }) => {
    await expect(page.locator('text=输出').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=点击运行查看输出...').first()).toBeVisible({ timeout: 10000 });
  });

  test('课时页应该有重置按钮', async ({ page }) => {
    await page.waitForTimeout(2000);
    const resetButton = page.locator('button:has-text("重置")').first();
    await expect(resetButton).toBeVisible();
  });
});

test.describe('进度管理', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/course/1');
    await page.waitForTimeout(2000);
  });

  test('应该能看到标记完成按钮', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    const completeButton = page.locator('button:has-text("标记完成")').first();
    await expect(completeButton).toBeVisible();
  });

  test('点击标记完成按钮后应该变为已完成状态', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent?.includes('标记完成'));
      if (btn) {
        btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      }
    });

    await page.waitForTimeout(500);

    const completedButton = page.locator('button:has-text("已完成")').first();
    await expect(completedButton).toBeVisible();
  });
});

test.describe('响应式布局', () => {
  test('移动端视图（375px）应该正常显示', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/course/1');

    await expect(page.locator('a[href*="/course/"]').first()).toBeVisible();
  });

  test('平板视图（768px）应该正常显示', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/course/1');

    await expect(page.locator('a[href*="/course/"]').first()).toBeVisible();
  });

  test('桌面视图（1920px）应该正常显示', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/course/1');

    await expect(page.locator('a[href*="/course/"]').first()).toBeVisible();
  });
});
