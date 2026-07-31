/**
 * Python 学习中心 — 类型定义
 *
 * 定义了课程系统的核心数据结构（三级结构）：
 * - Course：课程（Python 开发 / 智能体开发 / 区块链开发）
 * - SubChapter：子章节（课程内的章）
 * - Lesson：单个课时
 * - Progress：用户学习进度
 */

/**
 * 子章节的数据结构
 * 属于某个 Course 下的章
 */
export interface SubChapter {
  /** 子章节 ID（数字，在课程内唯一） */
  id: number;
  /** 子章节标题，如 "Python 入门" */
  title: string;
  /** 子章节图标（emoji） */
  icon: string;
  /** 该子章节包含的所有课时 */
  lessons: Lesson[];
}

/**
 * 课程的数据结构
 * 顶级导航单元
 */
export interface Course {
  /** 课程 ID（数字，1-3） */
  id: number;
  /** 课程标题，如 "Python 开发" */
  title: string;
  /** 课程描述 */
  description: string;
  /** 课程图标（emoji） */
  icon: string;
  /** 课程主题色（十六进制颜色值） */
  color: string;
  /** 该课程包含的所有子章节 */
  chapters: SubChapter[];
}

/**
 * 单个课时的数据结构
 */
export interface Lesson {
  /** 课时唯一标识，格式为 "章节号-课时号"，如 "1-1" */
  id: string;
  /** 所属子章节 ID（数字） */
  chapterId: number;
  /** 所属课程 ID（数字） */
  courseId: number;
  /** 课时在子章节内的序号（从 1 开始） */
  lessonNumber: number;
  /** 课时标题，如 "第一个 Python 程序" */
  title: string;
  /** 课时路由路径，如 "1-1" */
  slug: string;
  /** 一句话描述 */
  description: string;
  /** 难度等级 */
  difficulty: 'easy' | 'medium' | 'hard';
  /** 预计学习时间（分钟） */
  duration: number;
  /** Markdown 格式的理论内容文件路径，如 "src/lib/content/lessons/1-1.md" */
  contentPath: string;
  /** 编辑器初始代码 */
  initialCode: string;
  /** 预期输出提示 */
  expectedOutput: string;
  /** Markdown 格式的理论内容（运行时加载后填充，可选） */
  content?: string;
  /** 提示信息（可选） */
  hint?: string;
  /** 参考解答（可选） */
  solution?: string;
}

/**
 * 用户学习进度的数据结构
 * 使用 localStorage 持久化存储
 */
export interface Progress {
  /** 已完成课时的映射表，key 为 "章节号-课时号"，如 "1-1" */
  completedLessons: Record<string, boolean>;
  /** 最后访问日期（ISO 8601 格式） */
  lastVisit: string;
  /** 开始学习的日期（ISO 8601 格式） */
  startDate: string;
  /** 已完成的课时总数 */
  totalCompleted: number;
}
