import { describe, it, expect } from 'vitest';
import { loadLessonMarkdown } from '@/lib/content/lesson-loader';

describe('lesson-loader.ts — 课时 Markdown 加载器', () => {
  // ==================== 正常加载 ====================

  describe('loadLessonMarkdown — 正常加载', () => {
    it('应该加载存在的课时文件', () => {
      const content = loadLessonMarkdown('1-1');
      expect(typeof content).toBe('string');
      expect(content.length).toBeGreaterThan(0);
    });

    it('加载的内容应该包含课时标题', () => {
      const content = loadLessonMarkdown('1-1');
      expect(content).toContain('# Python 简介');
      expect(content).toContain('<!-- lesson_id: 1-1 -->');
    });

    it('加载的内容应该包含代码块或练习任务', () => {
      const content = loadLessonMarkdown('1-1');
      // 课程文件包含练习任务或代码块
      expect(content.length).toBeGreaterThan(100);
      // 验证包含结构化的 Markdown 内容
      expect(content).toContain('##');
    });

    it('不同章节的课时应该加载不同的内容', () => {
      const content1 = loadLessonMarkdown('1-1');
      const content5 = loadLessonMarkdown('5-3');
      expect(content1).not.toBe(content5);
      expect(content1.length).toBeGreaterThan(0);
      expect(content5.length).toBeGreaterThan(0);
    });

    it('最后一章的内容应该能正常加载', () => {
      const content = loadLessonMarkdown('10-4');
      expect(content.length).toBeGreaterThan(0);
      expect(content).toContain('学生成绩管理系统');
    });
  });

  // ==================== 错误处理 ====================

  describe('loadLessonMarkdown — 错误处理', () => {
    it('不存在的课时 ID 应该返回空字符串', () => {
      const content = loadLessonMarkdown('999-999');
      expect(content).toBe('');
    });

    it('空字符串作为 ID 应该返回空字符串', () => {
      const content = loadLessonMarkdown('');
      expect(content).toBe('');
    });

    it('格式错误的 ID 应该返回空字符串', () => {
      const content = loadLessonMarkdown('not-a-lesson');
      expect(content).toBe('');
    });
  });

  // ==================== 内容完整性 ====================

  describe('loadLessonMarkdown — 内容完整性', () => {
    it('第1章前3课都应该能加载', () => {
      for (let i = 1; i <= 3; i++) {
        const content = loadLessonMarkdown(`1-${i}`);
        expect(content.length).toBeGreaterThan(0);
      }
    });

    it('第5章所有课时都应该能加载', () => {
      for (let i = 1; i <= 5; i++) {
        const content = loadLessonMarkdown(`5-${i}`);
        expect(content.length).toBeGreaterThan(0);
      }
    });

    it('第10章所有课时都应该能加载', () => {
      for (let i = 1; i <= 4; i++) {
        const content = loadLessonMarkdown(`10-${i}`);
        expect(content.length).toBeGreaterThan(0);
      }
    });

    it('内容应该是有效的 Markdown 格式', () => {
      const content = loadLessonMarkdown('1-1');
      // 内容可能以 HTML comment 开头，但必须包含 Markdown 标题
      const withoutComment = content.replace(/<!--.*?-->\n?/g, '');
      expect(withoutComment.trim().startsWith('#')).toBe(true);
    });
  });
});
