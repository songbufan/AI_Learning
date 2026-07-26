import { describe, it, expect } from 'vitest';
import { courses, getCourseById, getChapterByCourseAndId, getLessonById, getAllLessons } from '@/lib/content/chapters';

describe('chapters.ts — 课程数据层', () => {
  // ==================== 数据结构验证 ====================

  describe('courses 数组', () => {
    it('应该包含 3 个课程', () => {
      expect(courses).toHaveLength(3);
    });

    it('每个课程应该有 id、title、icon、color、chapters 字段', () => {
      for (const course of courses) {
        expect(course).toHaveProperty('id');
        expect(course).toHaveProperty('title');
        expect(course).toHaveProperty('description');
        expect(course).toHaveProperty('icon');
        expect(course).toHaveProperty('color');
        expect(course).toHaveProperty('chapters');
        expect(Array.isArray(course.chapters)).toBe(true);
      }
    });

    it('课程 ID 应该是 1、2、3', () => {
      const ids = courses.map((c) => c.id);
      expect(ids).toEqual([1, 2, 3]);
    });

    it('每个课程的 icon 应该是 emoji', () => {
      for (const course of courses) {
        expect(course.icon.length).toBeGreaterThan(0);
      }
    });

    it('每个课程的 color 应该是合法的十六进制颜色值', () => {
      const hexRegex = /^#[0-9A-Fa-f]{6}$/;
      for (const course of courses) {
        expect(course.color).toMatch(hexRegex);
      }
    });

    it('每个课程的章节应该有 id、title、icon、lessons 字段', () => {
      for (const course of courses) {
        for (const chapter of course.chapters) {
          expect(chapter).toHaveProperty('id');
          expect(chapter).toHaveProperty('title');
          expect(chapter).toHaveProperty('icon');
          expect(chapter).toHaveProperty('lessons');
          expect(Array.isArray(chapter.lessons)).toBe(true);
          expect(chapter.icon.length).toBeGreaterThan(0);
        }
      }
    });

    it('Python 课程应该有 10 个章节', () => {
      expect(courses[0].chapters).toHaveLength(10);
    });

    it('智能体课程应该有 3 个章节', () => {
      expect(courses[1].chapters).toHaveLength(3);
    });

    it('区块链课程应该有 10 个章节', () => {
      expect(courses[2].chapters).toHaveLength(10);
    });

    it('总课时数应该大于 47', () => {
      const total = courses.reduce((sum, c) => sum + c.chapters.reduce((s, ch) => s + ch.lessons.length, 0), 0);
      expect(total).toBeGreaterThan(47);
    });
  });

  // ==================== Lesson 结构验证 ====================

  describe('Lesson 数据结构', () => {
    it('每个课时应该有完整的字段', () => {
      for (const course of courses) {
        for (const chapter of course.chapters) {
          for (const lesson of chapter.lessons) {
            expect(lesson).toHaveProperty('id');
            expect(lesson).toHaveProperty('chapterId');
            expect(lesson).toHaveProperty('courseId');
            expect(lesson).toHaveProperty('lessonNumber');
            expect(lesson).toHaveProperty('title');
            expect(lesson).toHaveProperty('slug');
            expect(lesson).toHaveProperty('description');
            expect(lesson).toHaveProperty('difficulty');
            expect(lesson).toHaveProperty('duration');
            expect(lesson).toHaveProperty('contentPath');
            expect(lesson).toHaveProperty('initialCode');
            expect(lesson).toHaveProperty('expectedOutput');
          }
        }
      }
    });

    it('课时 id 格式应该是 "课程号-课时号"', () => {
      const idRegex = /^\d+-\d+$/;
      for (const course of courses) {
        for (const chapter of course.chapters) {
          for (const lesson of chapter.lessons) {
            expect(lesson.id).toMatch(idRegex);
            expect(lesson.courseId).toBe(course.id);
            expect(lesson.chapterId).toBe(chapter.id);
          }
        }
      }
    });

    it('slug 应该等于 id', () => {
      for (const course of courses) {
        for (const chapter of course.chapters) {
          for (const lesson of chapter.lessons) {
            expect(lesson.slug).toBe(lesson.id);
          }
        }
      }
    });

    it('difficulty 应该是 easy、medium 或 hard', () => {
      const validDifficulties = ['easy', 'medium', 'hard'];
      for (const course of courses) {
        for (const chapter of course.chapters) {
          for (const lesson of chapter.lessons) {
            expect(validDifficulties).toContain(lesson.difficulty);
          }
        }
      }
    });

    it('duration 应该是正整数', () => {
      for (const course of courses) {
        for (const chapter of course.chapters) {
          for (const lesson of chapter.lessons) {
            expect(Number.isInteger(lesson.duration)).toBe(true);
            expect(lesson.duration).toBeGreaterThan(0);
          }
        }
      }
    });

    it('initialCode 和 expectedOutput 应该是非空字符串', () => {
      for (const course of courses) {
        for (const chapter of course.chapters) {
          for (const lesson of chapter.lessons) {
            expect(typeof lesson.initialCode).toBe('string');
            expect(lesson.initialCode.length).toBeGreaterThan(0);
            expect(typeof lesson.expectedOutput).toBe('string');
            expect(lesson.expectedOutput.length).toBeGreaterThan(0);
          }
        }
      }
    });
  });

  // ==================== 辅助函数测试 ====================

  describe('getCourseById', () => {
    it('应该返回正确的课程', () => {
      const course = getCourseById(1);
      expect(course).toBeDefined();
      expect(course!.title).toBe('Python 开发');
    });

    it('不存在的 ID 应该返回 undefined', () => {
      expect(getCourseById(999)).toBeUndefined();
    });

    it('应该返回区块链课程', () => {
      const course = getCourseById(3);
      expect(course).toBeDefined();
      expect(course!.title).toBe('区块链开发');
      expect(course!.chapters.length).toBeGreaterThan(0);
    });
  });

  describe('getChapterByCourseAndId', () => {
    it('应该返回正确的子章节', () => {
      const chapter = getChapterByCourseAndId(1, 1);
      expect(chapter).toBeDefined();
      expect(chapter!.title).toBe('Python 入门');
    });

    it('不存在的课程/章节 ID 应该返回 undefined', () => {
      expect(getChapterByCourseAndId(999, 1)).toBeUndefined();
      expect(getChapterByCourseAndId(1, 999)).toBeUndefined();
    });

    it('区块链课程应该有章节', () => {
      const chapter = getChapterByCourseAndId(3, 1);
      expect(chapter).toBeDefined();
      expect(chapter!.title).toBe('区块链概述与基础概念');
    });
  });

  describe('getLessonById', () => {
    it('应该返回正确的课时', () => {
      const lesson = getLessonById('1-1');
      expect(lesson).toBeDefined();
      expect(lesson!.title).toBe('Python 简介');
      expect(lesson!.courseId).toBe(1);
    });

    it('不存在的课时 ID 应该返回 undefined', () => {
      expect(getLessonById('99-99')).toBeUndefined();
    });

    it('应该能在不同课程和章节中找到课时', () => {
      const lesson = getLessonById('2-3');
      expect(lesson).toBeDefined();
      expect(lesson!.title).toBe('ReAct 推理框架');
      expect(lesson!.courseId).toBe(2);
      expect(lesson!.chapterId).toBe(2);

      const bcLesson = getLessonById('3-1');
      expect(bcLesson).toBeDefined();
      expect(bcLesson!.title).toBe('什么是区块链');
      expect(bcLesson!.courseId).toBe(3);
    });
  });

  describe('getAllLessons', () => {
    it('应该返回扁平化的所有课时数组', () => {
      const all = getAllLessons();
      expect(all.length).toBeGreaterThan(47);
    });

    it('返回的数组应该包含所有课程的课时', () => {
      const all = getAllLessons();
      expect(all.some((l) => l.id === '1-1')).toBe(true);
      expect(all.some((l) => l.id === '2-3')).toBe(true);
      expect(all.some((l) => l.id === '3-1')).toBe(true);
      expect(all.some((l) => l.id === '3-35')).toBe(true);
    });

    it('每个课时应该只出现一次', () => {
      const all = getAllLessons();
      const ids = all.map((l) => l.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});
