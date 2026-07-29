/**
 * lesson-loader.ts — 课时 Markdown 内容加载器
 *
 * 从文件系统读取 Markdown 格式的课程内容。
 * 在服务端组件中使用，读取 src/lib/content/lessons/ 目录下的 .md 文件。
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径（ESM 环境下 __dirname 不可用）
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 项目的根目录路径（src/ 的上一级）
 */
const PROJECT_ROOT = join(__dirname, '..', '..', '..');

/**
 * Markdown 内容存储目录
 */
const LESSONS_DIR = join(PROJECT_ROOT, 'src', 'lib', 'content', 'lessons');

/**
 * 根据课时 ID 加载 Markdown 内容
 *
 * @param lessonId - 课时 ID，格式为 "章节号-课时号"，如 "1-1"、"2-1"、"3-5"
 * @returns Markdown 内容字符串，文件不存在返回空字符串
 */
export function loadLessonMarkdown(lessonId: string): string {
  // 根据课时 ID 前缀确定课程目录
  const coursePrefix = lessonId.split('-')[0];
  const courseDir = getCourseDir(coursePrefix);

  // 构建文件路径
  const filePath = join(LESSONS_DIR, courseDir, `${lessonId}.md`);

  if (!existsSync(filePath)) {
    console.warn(`课程内容文件不存在: ${filePath}`);
    return '';
  }

  try {
    const content = readFileSync(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`读取课程内容失败: ${filePath}`, error);
    return '';
  }
}

/**
 * 根据课程 ID 前缀获取子目录名
 */
function getCourseDir(prefix: string): string {
  switch (prefix) {
    case '8':
    case '9':
    case '10':
      return 'python';
    case '2':
      return 'agent';
    case '3':
      return 'blockchain';
    case '4':
      return 'linux';
    case '5':
      return 'go';
    case '6':
      return 'rust';
    default:
      return '';
  }
}
