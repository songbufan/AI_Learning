/**
 * Python 学习中心 — 课程内容模块统一导出
 *
 * 该文件作为课程内容模块的入口，
 * 统一导出所有类型、数据和工具函数。
 */

// 导出类型定义
export type { Course, SubChapter, Lesson, Progress } from '@/types';

// 导出课程数据和工具函数
export {
  courses,
  getCourseById,
  getChapterByCourseAndId,
  getLessonByCourseChapterAndId,
  getLessonById,
  getAllLessons,
} from './chapters';
