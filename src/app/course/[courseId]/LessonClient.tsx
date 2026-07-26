/**
 * LessonClient — 课程页面客户端交互组件
 *
 * 处理课程页面的所有客户端交互逻辑：
 * - 代码编辑器状态管理
 * - Pyodide 代码执行
 * - 进度管理（完成标记）
 * - 侧边栏开关（移动端）
 * - 上/下一课导航
 * - URL hash 导航（?chapter=&lesson= 的替代方案）
 *
 * 该组件由服务端组件 CourseLessonPage 渲染，
 * 接收课程、章节、课时数据和课程内容作为 props。
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Course, SubChapter, Lesson } from '@/types';
import { courses, getChapterByCourseAndId } from '@/lib/content';
import { useProgress } from '@/hooks/useProgress';
import { usePyodide } from '@/hooks/usePyodide';
import Sidebar from '@/components/ui/Sidebar';
import LessonContent from '@/components/ui/LessonContent';
import CodeEditor from '@/components/ui/CodeEditor';
import OutputPanel from '@/components/ui/OutputPanel';
import Navigation from '@/components/ui/Navigation';

/**
 * LessonClient 组件的属性
 */
interface LessonClientProps {
  /** 当前课程 ID */
  courseId: number;
  /** 当前子章节 ID（默认值，会被 hash 覆盖） */
  chapterId: number;
  /** 当前课时 ID（默认值，会被 hash 覆盖） */
  lessonSlug: string;
  /** 当前课程数据 */
  course: Course;
  /** 当前子章节数据（默认值） */
  chapter: SubChapter;
  /** 当前课时数据（含 content 字段，默认值） */
  lesson: Lesson;
  /** 所有课时的 Markdown 内容映射 {lessonId: markdown} */
  lessonContents: Record<string, string>;
}

/**
 * 从 hash 解析章节和课时号
 * hash 格式: "chapterId-lessonNumber" 如 "1-2"
 */
function parseHash(hash: string): { chapterId: number; lessonNumber: number } | null {
  if (!hash || hash === '#') return null;
  const clean = hash.replace('#', '');
  const [chStr, lsStr] = clean.split('-');
  if (!chStr || !lsStr) return null;
  const chapterId = parseInt(chStr, 10);
  const lessonNumber = parseInt(lsStr, 10);
  if (isNaN(chapterId) || isNaN(lessonNumber)) return null;
  return { chapterId, lessonNumber };
}

/**
 * LessonClient 组件
 */
export default function LessonClient({
  courseId,
  chapterId: defaultChapterId,
  lessonSlug: defaultLessonSlug,
  course,
  chapter: defaultChapter,
  lesson: defaultLesson,
  lessonContents,
}: LessonClientProps) {
  // ========== 进度管理 ==========
  const { markComplete, markIncomplete, isCompleted, progress } = useProgress();

  // ========== Hash 导航状态 ==========
  // 当前实际显示的章节和课时（可由 hash 驱动）
  const [currentChapterId, setCurrentChapterId] = useState(defaultChapterId);
  const [currentLessonSlug, setCurrentLessonSlug] = useState(defaultLessonSlug);
  const [currentLesson, setCurrentLesson] = useState(defaultLesson);
  const [currentChapter, setCurrentChapter] = useState(defaultChapter);
  const isNavigating = useRef(false);

  // 当前课时是否已完成
  const completed = isCompleted(currentLessonSlug);

  // ========== 代码编辑器状态 ==========
  const [code, setCode] = useState(defaultLesson.initialCode);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  // Pyodide 执行能力
  const { isLoading: isPyodideLoading, error: pyodideError, runPython } = usePyodide();

  // 用 ref 跟踪最新代码，避免 handleRunCode 每次输入都重建
  const codeRef = useRef(code);
  codeRef.current = code;

  // ========== 页面加载动画状态 ==========
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // 页面加载完成后触发渐入动画
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsPageLoaded(true);
      });
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // ========== 加载课时 Markdown 内容（hash 导航时从预加载映射中获取） ==========
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [loadedContent, setLoadedContent] = useState('');

  useEffect(() => {
    if (currentLesson.content) {
      setLoadedContent(currentLesson.content);
      return;
    }
    setIsLoadingContent(true);
    const markdown = lessonContents[currentLessonSlug] || '';
    setLoadedContent(markdown);
    setIsLoadingContent(false);
  }, [currentLessonSlug, currentLesson.content, lessonContents]);

  const displayContent = isLoadingContent ? '' : loadedContent;

  // ========== Hash 导航：监听 hash 变化 ==========
  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash;
      const parsed = parseHash(hash);

      if (!parsed) return;

      const { chapterId, lessonNumber } = parsed;
      const chapter = getChapterByCourseAndId(courseId, chapterId);
      if (!chapter) return;

      const lesson = chapter.lessons.find((l) => l.lessonNumber === lessonNumber);
      if (!lesson) return;

      isNavigating.current = true;
      setCurrentChapterId(chapterId);
      setCurrentChapter(chapter);
      setCurrentLessonSlug(lesson.id);
      setCurrentLesson(lesson);

      // 滚动到顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 初始加载时检查 hash
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [courseId]);

  // 导航到指定章节课时
  const navigateTo = useCallback((chapterId: number, lessonNumber: number) => {
    window.location.hash = `${chapterId}-${lessonNumber}`;
  }, []);

  // ========== 同步代码编辑器状态 ==========
  useEffect(() => {
    setCode(currentLesson.initialCode);
    setOutput('');
    setError('');
  }, [currentLesson.initialCode]);

  // ========== 查找上/下一课 ==========
  const lessonIndex = currentChapter.lessons.findIndex((l) => l.slug === currentLessonSlug);
  const prevLesson = lessonIndex > 0 ? currentChapter.lessons[lessonIndex - 1] : undefined;
  const nextLesson =
    lessonIndex < currentChapter.lessons.length - 1 ? currentChapter.lessons[lessonIndex + 1] : undefined;

  // ========== 运行代码 ==========
  const handleRunCode = useCallback(async () => {
    const currentCode = codeRef.current;
    if (!currentCode.trim()) return;

    setIsRunning(true);
    setOutput('');
    setError('');

    if (isPyodideLoading) {
      setError('Python 运行环境正在加载中，请稍候...');
      setIsRunning(false);
      return;
    }

    if (pyodideError) {
      setError(`Python 运行环境加载失败：${pyodideError}`);
      setIsRunning(false);
      return;
    }

    try {
      const result = await runPython(currentCode);
      setOutput(result.stdout);
      setError(result.stderr);
    } catch {
      setError('代码执行出错，请检查语法');
    } finally {
      setIsRunning(false);
    }
  }, [isPyodideLoading, pyodideError, runPython]);

  // ========== 重置代码 ==========
  const handleResetCode = useCallback(() => {
    setCode(currentLesson.initialCode);
    setOutput('');
    setError('');
  }, [currentLesson.initialCode]);

  // ========== 切换完成状态 ==========
  const handleToggleComplete = useCallback(() => {
    if (completed) {
      markIncomplete(currentLessonSlug);
    } else {
      markComplete(currentLessonSlug);
    }
  }, [completed, currentLessonSlug, markComplete, markIncomplete]);

  // 如果课程数据未找到，显示提示
  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="text-6xl block mb-4">😕</span>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#eaeaea' }}>
            课程未找到
          </h2>
          <p className="mb-4" style={{ color: '#a0a0b0' }}>
            该课时内容正在准备中，请稍后再来
          </p>
          <a
            href="/"
            className="inline-block px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: '#3776AB', color: '#fff' }}
          >
            返回课程总览
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex gap-6"
      style={{
        opacity: isPageLoaded ? 1 : 0,
        transition: 'opacity 0.4s ease-out',
      }}
    >
      {/* Pyodide 加载指示器（非阻塞） */}
      {isPyodideLoading && (
        <div
          className="fixed top-16 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg border"
          style={{
            backgroundColor: '#16213e',
            borderColor: '#2a2a4a',
          }}
        >
          <div
            className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: '#3776AB', borderTopColor: 'transparent' }}
          />
          <span className="text-xs" style={{ color: '#a0a0b0' }}>
            加载 Python 环境...
          </span>
        </div>
      )}

      {/* ========== 左侧：侧边栏导航 ========== */}
      <Sidebar
        courses={courses}
        currentCourseId={courseId}
        currentChapterId={currentChapterId}
        currentLessonId={currentLessonSlug}
        progress={progress}
      />

      {/* ========== 中间：课程内容 ========== */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div
          className="max-w-3xl mx-auto px-8 sm:px-10 py-10 sm:py-12"
          style={{
            animation: isPageLoaded ? 'fadeInUp 0.5s ease-out' : 'none',
          }}
        >

          {/* 课时标题区 */}
          <div className="mb-8">
            {/* 面包屑导航 */}
            <nav className="mb-4">
              <ol className="flex items-center gap-2 text-sm" style={{ color: '#a0a0b0' }}>
                <li>
                  <a href="/" className="hover:text-white transition-colors">
                    课程总览
                  </a>
                </li>
                <li style={{ color: '#3776AB' }}>/</li>
                <li>
                  <a
                    href={`/course/${courseId}`}
                    className="hover:text-white transition-colors"
                  >
                    {course.title}
                  </a>
                </li>
                <li style={{ color: course.color }}>/</li>
                <li style={{ color: course.color }}>
                  第{currentChapter.id}章 · 第{currentLesson.lessonNumber}课：{currentLesson.title}
                </li>
              </ol>
            </nav>

            {/* 课时标题和操作按钮 */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1
                  className="text-2xl md:text-3xl font-bold mb-2"
                  style={{ color: course.color }}
                >
                  第{currentLesson.lessonNumber}课：{currentLesson.title}
                </h1>
                <p style={{ color: '#a0a0b0' }}>{currentLesson.description}</p>
              </div>

              {/* 完成按钮 */}
              <button
                onClick={handleToggleComplete}
                className={`
                  flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl
                  border transition-all duration-200 hover:scale-105 active:scale-95
                `}
                style={{
                  borderColor: completed ? '#4CAF50' : '#2a2a4a',
                  backgroundColor: completed ? 'rgba(76, 175, 80, 0.15)' : 'transparent',
                  color: completed ? '#4CAF50' : '#a0a0b0',
                }}
              >
                <span>{completed ? '✓' : '○'}</span>
                <span>{completed ? '已完成' : '标记完成'}</span>
              </button>
            </div>
          </div>

          {/* Markdown 课程内容 */}
          <div className="mb-8">
            {isLoadingContent ? (
              <div className="flex items-center gap-3 py-12 justify-center">
                <div
                  className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: course.color, borderTopColor: 'transparent' }}
                />
                <span className="text-sm" style={{ color: '#a0a0b0' }}>
                  加载课程内容...
                </span>
              </div>
            ) : (
              <LessonContent content={displayContent} />
            )}
          </div>

          {/* 上/下一课导航 */}
          <Navigation
            prevLesson={prevLesson}
            nextLesson={nextLesson}
            courseId={courseId}
            chapterId={currentChapterId}
            onNavigate={navigateTo}
          />
        </div>
      </main>

      {/* ========== 右侧：代码编辑器面板 ========== */}
      <aside
        className="
          w-full lg:w-[420px] xl:w-[480px]
          border-l flex flex-col
          fixed right-0 top-14 bottom-0 z-30
          lg:relative lg:top-auto lg:bottom-auto lg:pt-5 lg:z-[60]
          bg-[#16213e]
          max-lg:hidden
        "
        style={{ borderColor: '#2a2a4a' }}
      >
        {/* 编辑器头部 */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0"
          style={{ borderColor: '#2a2a4a' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: '#eaeaea' }}>
              💻 代码编辑器
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#3776AB20', color: '#3776AB' }}
            >
              Python
            </span>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
            {/* 重置按钮 */}
            <button
              onClick={handleResetCode}
              disabled={isRunning}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 hover:bg-white/5 disabled:opacity-50"
              style={{ borderColor: '#2a2a4a', color: '#a0a0b0' }}
            >
              ↺ 重置
            </button>

            {/* 运行按钮 */}
            <button
              onClick={handleRunCode}
              disabled={isRunning || !code.trim()}
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100"
              style={{ backgroundColor: '#3776AB', color: '#fff' }}
            >
              {isRunning ? '⏳ 运行中...' : '▶ 运行代码'}
            </button>
          </div>
        </div>

        {/* 编辑器和输出区域 */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Monaco 代码编辑器 */}
          <div className="rounded-lg overflow-hidden border" style={{ borderColor: '#2a2a4a' }}>
            <CodeEditor
              code={code}
              onChange={setCode}
              language="python"
              height="300px"
            />
          </div>

          {/* 输出面板 */}
          <OutputPanel output={output} error={error} isRunning={isRunning} />
        </div>
      </aside>

      {/* ========== 移动端：编辑器一直显示 ========== */}
      <div className="lg:hidden mt-6">
        <div className="rounded-lg overflow-hidden border" style={{ borderColor: '#2a2a4a' }}>
          <CodeEditor
            code={code}
            onChange={setCode}
            language="python"
            height="250px"
          />
        </div>
        <div className="mt-4">
          <OutputPanel output={output} error={error} isRunning={isRunning} />
        </div>
        <div className="flex gap-3 mt-4 pb-6">
          <button
            onClick={handleResetCode}
            disabled={isRunning}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-medium border transition-all active:scale-95 disabled:opacity-50"
            style={{ borderColor: '#2a2a4a', color: '#a0a0b0' }}
          >
            ↺ 重置代码
          </button>
          <button
            onClick={handleRunCode}
            disabled={isRunning || !code.trim()}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            style={{ backgroundColor: '#3776AB', color: '#fff' }}
          >
            {isRunning ? '⏳ 运行中...' : '▶ 运行代码'}
          </button>
        </div>
      </div>
    </div>
  );
}
