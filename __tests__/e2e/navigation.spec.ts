import { test, expect } from '@playwright/test';

/**
 * E2E 测试：首页 → 课程导航流程（2级路由 + hash导航）
 */

test.describe('首页导航流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('应该显示 3 个课程卡片链接', async ({ page }) => {
    const cards = page.locator('a[href*="/course/"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('首页应该有课程卡片网格', async ({ page }) => {
    await expect(page.locator('a[href*="/course/"]').first()).toBeVisible();
  });
});

test.describe('课程页面导航', () => {
  test('点击第一个课程应该直接跳转到学习页面', async ({ page }) => {
    await page.goto('/');

    await page.locator('a[href*="/course/"]').first().click();

    // URL 是 2 级: /course/1
    await expect(page).toHaveURL(/\/course\/1$/);
    await expect(page.locator('h1').last()).toContainText('Python 简介');
  });

  test('点击第二个课程应该跳转到智能体课程', async ({ page }) => {
    await page.goto('/');

    await page.locator('a[href*="/course/"]').nth(1).click();

    await expect(page).toHaveURL(/\/course\/2$/);
  });
});

test.describe('课时页面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/course/1');
  });

  test('课时页应该显示课程内容', async ({ page }) => {
    await expect(page.locator('h1').last()).toContainText('Python 简介');
  });

  test('课时页应该显示侧边栏', async ({ page }) => {
    await expect(page.locator('nav a[href="/course/1"]')).toContainText('Python 开发');
  });

  test('课时页应该显示代码编辑器', async ({ page }) => {
    await expect(page.locator('text=代码编辑器').first()).toBeVisible({ timeout: 15000 });
  });

  test('课时页应该显示上一课/下一课导航', async ({ page }) => {
    await expect(page.locator('text=上一课').first()).toBeVisible();
    await expect(page.locator('text=下一课').first()).toBeVisible();
  });
});

test.describe('课时之间导航', () => {
  test('从第一课时点击下一课应该跳转到第二课时', async ({ page }) => {
    await page.goto('/course/1');

    // 点击下一课按钮
    await page.locator('button:has-text("第一个 Python 程序")').click();

    await expect(page).toHaveURL(/\/course\/1#1-2/);
    await expect(page.locator('h1').last()).toContainText('第一个 Python 程序');
  });
});

test.describe('侧边栏导航', () => {
  test('侧边栏应该显示课程和章节图标', async ({ page }) => {
    await page.goto('/course/1');

    // 侧边栏折叠状态显示图标
    await expect(page.locator('text=🐍').first()).toBeVisible();
    await expect(page.locator('text=📘').first()).toBeVisible();
  });

  test('悬浮侧边栏应该展开显示章节列表', async ({ page }) => {
    await page.goto('/course/1');

    // 悬浮到侧边栏区域
    const sidebar = page.locator('aside').first();
    await sidebar.hover();

    // 展开后应该显示章节名称（不再是"第X章"格式）
    await expect(page.locator('text=Python 入门').first()).toBeVisible();
    await expect(page.locator('text=条件判断').first()).toBeVisible();
  });

  test('点击侧边栏课时链接应该通过 hash 导航', async ({ page }) => {
    await page.goto('/course/1');

    // 悬浮展开侧边栏
    const sidebar = page.locator('aside').first();
    await sidebar.hover();

    // 点击"第一个 Python 程序"课时链接
    await page.locator('a:has-text("第一个 Python 程序")').click();

    await expect(page).toHaveURL(/\/course\/1#1-2/);
    await expect(page.locator('h1').last()).toContainText('第一个 Python 程序');
  });
});
