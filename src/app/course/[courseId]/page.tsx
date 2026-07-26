/**
 * 课程学习页 — /course/[courseId]
 *
 * 直接渲染学习页面（默认第一章第一课），URL 保持 2 级结构。
 * 通过 URL hash 指定课时：/course/1#1-2（第1章第2课）
 *
 * 路由：/course/{courseId}
 */

import { notFound } from 'next/navigation';
import type { Course, Lesson } from '@/types';
import { getCourseById, getChapterByCourseAndId } from '@/lib/content';
import { loadLessonMarkdown } from '@/lib/content/lesson-loader';
import LessonClient from './LessonClient';

interface PageProps {
  params: Promise<{ courseId: string }>;
}

/**
 * 生成静态参数（用于静态导出）
 */
export async function generateStaticParams() {
  return [
    { courseId: '1' },
    { courseId: '2' },
    { courseId: '3' },
  ];
}

/**
 * 从 hash 解析章节和课时号
 * hash 格式: "{chapterId}-{lessonNumber}" 如 "1-2"
 */
function parseHash(hash: string): { chapterId: number; lessonNumber: number } | null {
  if (!hash || hash === '#') return null;
  const clean = hash.replace('#', '');
  const parts = clean.split('-');
  if (parts.length !== 2) return null;
  const chapterId = parseInt(parts[0], 10);
  const lessonNumber = parseInt(parts[1], 10);
  if (isNaN(chapterId) || isNaN(lessonNumber)) return null;
  return { chapterId, lessonNumber };
}

/**
 * 课程学习页服务端组件
 */
export default async function CourseLessonPage({ params }: PageProps) {
  const { courseId: courseIdStr } = await params;
  const courseId = parseInt(courseIdStr, 10);

  const course: Course | undefined = getCourseById(courseId);

  if (!course || course.chapters.length === 0) {
    notFound();
  }

  // 默认第一章第一课（hash 在客户端处理）
  const chapter = course.chapters[0];
  const lesson = chapter.lessons[0];

  if (!lesson) {
    notFound();
  }

  // 加载 Markdown 内容
  const lessonId = lesson.id;
  let markdownContent = loadLessonMarkdown(lessonId);

  if (!markdownContent.trim()) {
    markdownContent = buildFallbackContent(lesson);
  }

  // 预加载该课程所有课时的 Markdown 内容（hash 导航时客户端无需再读取文件）
  const lessonContents: Record<string, string> = {};
  for (const ch of course.chapters) {
    for (const lsn of ch.lessons) {
      const raw = loadLessonMarkdown(lsn.id);
      lessonContents[lsn.id] = raw.trim() ? raw : buildFallbackContent(lsn);
    }
  }

  const lessonWithContent: Lesson = {
    ...lesson,
    content: markdownContent,
  };

  return (
    <LessonClient
      courseId={courseId}
      chapterId={chapter.id}
      lessonSlug={lessonId}
      course={course}
      chapter={chapter}
      lesson={lessonWithContent}
      lessonContents={lessonContents}
    />
  );
}

/**
 * 生成备用内容（当 Markdown 文件不存在时）
 */
function buildFallbackContent(lesson: Lesson): string {
  const codeBlock = '```python\n' + lesson.initialCode + '\n```';
  return (
    '# ' + lesson.title + '\n\n' +
    '## 课程简介\n\n' +
    lesson.description + '\n\n' +
    '## 代码练习\n\n' +
    '在右侧编辑器中编写并运行以下代码：\n\n' +
    codeBlock + '\n\n' +
    '## 练习任务\n\n' +
    '完成以下练习来巩固所学知识：\n\n' +
    '1. 修改上面的代码\n' +
    '2. 尝试不同的输入值\n' +
    '3. 观察程序的输出结果\n\n' +
    '## 知识点总结\n\n' +
    '- 完成本课时的学习内容\n' +
    '- 在编辑器中实践代码\n' +
    '- 点击"标记完成"记录学习进度\n\n' +
    '> 💡 提示：' + (lesson.hint || '多练习是掌握编程的关键！') + '\n'
  );
}
