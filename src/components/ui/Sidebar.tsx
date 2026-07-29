/**
 * Sidebar — 悬浮展开侧边栏导航组件
 *
 * - <aside> 始终占 220px，折叠时只显示左侧 52px 图标条
 * - 鼠标悬浮展开（滑入完整内容），移开折叠（滑出）
 * - 状态持久化到 localStorage（默认折叠）
 */

import { useState, useEffect, useRef } from 'react';
import type { Course, Progress, Lesson } from '@/types';
import ProgressBar from './ProgressBar';
import CompletionBadge from './CompletionBadge';

const SIDEBAR_COLLAPSED_KEY = 'sidebar-collapsed';
const SIDEBAR_WIDTH = 220;
const SIDEBAR_COLLAPSED = 52;

export interface SidebarProps {
  /** 所有课程数据 */
  courses: Course[];
  /** 当前课程 ID */
  currentCourseId?: number;
  /** 当前子章节 ID */
  currentChapterId?: number;
  /** 当前课时 ID */
  currentLessonId?: string;
  /** 进度数据 */
  progress: Progress;
}

export default function Sidebar({
  courses,
  currentCourseId,
  currentChapterId,
  currentLessonId,
  progress,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const hasMounted = useRef(false);

  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(
    currentChapterId ? new Set([currentChapterId]) : new Set()
  );

  useEffect(() => {
    hasMounted.current = true;
    try {
      const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (stored === 'false') {
        setIsCollapsed(false);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (hasMounted.current) {
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isCollapsed));
      } catch {
        // ignore
      }
    }
  }, [isCollapsed]);

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      next.has(chapterId) ? next.delete(chapterId) : next.add(chapterId);
      return next;
    });
  };

  const isActuallyCollapsed = isCollapsed && !isHovered;
  const isExpanded = !isActuallyCollapsed;

  const currentCourse = courses.find((c) => c.id === currentCourseId);
  const currentCourseChapters = currentCourse?.chapters ?? [];

  const totalLessons = courses.reduce(
    (sum, c) => sum + c.chapters.reduce((s, ch) => s + ch.lessons.length, 0),
    0
  );
  const totalCompleted = progress.totalCompleted;

  return (
    <aside
      className="sticky top-14 self-start flex-shrink-0"
      style={{
        width: SIDEBAR_WIDTH,
        height: 'calc(100vh - 3.5rem)',
        backgroundColor: '#1a1a2e',
        borderLeft: '1px solid #2a2a4a',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ===== 折叠状态：章节图标列表（左侧 52px） ===== */}
      <div
        className="absolute top-0 left-0 h-full flex flex-col items-center"
        style={{
          width: SIDEBAR_COLLAPSED,
          zIndex: 2,
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 8,
          paddingRight: 8,
          gap: 0,
          opacity: isActuallyCollapsed ? 1 : 0,
          pointerEvents: isActuallyCollapsed ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
        }}
      >
        {/* 当前课程图标 */}
        {currentCourse && (
          <a
            href={`/course/${currentCourse.id}`}
            className="text-2xl hover:scale-110 transition-transform flex-shrink-0"
            title={currentCourse.title}
          >
            {currentCourse.icon}
          </a>
        )}

        {/* 分隔线 */}
        <div
          className="w-8 my-0.5 flex-shrink-0"
          style={{ borderTop: `1px solid #2a2a4a` }}
        />

        {/* 各章节图标（无数字） */}
        {currentCourseChapters.map((chapter) => {
          const isCurrent = currentChapterId === chapter.id;

          return (
            <a
              key={chapter.id}
              href={`/course/${currentCourseId}#${chapter.id}-1`}
              className={`text-xl hover:scale-110 transition-transform flex-shrink-0 py-1 ${isCurrent ? 'ring-2 rounded-lg' : ''}`}
              style={{
                color: isCurrent ? currentCourse?.color : '#a0a0b0',
                ...(isCurrent ? { ringColor: currentCourse?.color } : {}),
              }}
              title={`${chapter.icon} ${chapter.title}`}
            >
              {chapter.icon}
            </a>
          );
        })}
      </div>

      {/* ===== 展开状态：完整内容（从左侧滑入） ===== */}
      <div
        className="absolute top-0 left-0 h-full overflow-y-auto overflow-x-hidden"
        style={{
          width: SIDEBAR_WIDTH,
          zIndex: 1,
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? 'translateX(0)' : 'translateX(-100%)',
          pointerEvents: isExpanded ? 'auto' : 'none',
          transition: 'opacity 0.2s ease, transform 0.25s ease',
        }}
      >
        <div className="p-4">
          {/* 总进度条 */}
          <div className="mb-5">
            <div className="flex justify-between text-xs mb-1" style={{ color: '#a0a0b0' }}>
              <span>总进度</span>
              <span>{totalCompleted} / {totalLessons}</span>
            </div>
            <ProgressBar completed={totalCompleted} total={totalLessons} />
          </div>

          {/* 章节列表（仅当前课程） */}
          <nav className="space-y-1.5">
            {currentCourseChapters.map((chapter) => {
              const isExpandedChapter = expandedChapters.has(chapter.id);
              const isCurrentChapter = currentChapterId === chapter.id;

              return (
                <div
                  key={chapter.id}
                  className="rounded-lg overflow-hidden"
                  style={{
                    border: isCurrentChapter ? `1px solid ${currentCourse?.color}33` : '1px solid transparent',
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleChapter(chapter.id);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition-colors hover:bg-white/5 active:bg-white/10 touch-manipulation"
                    style={{
                      backgroundColor: isCurrentChapter
                        ? `${currentCourse?.color}15`
                        : 'transparent',
                    }}
                  >
                    <span
                      className="text-lg flex-shrink-0"
                      style={{ color: currentCourse?.color }}
                    >
                      {chapter.icon}
                    </span>

                    <span
                      className="text-sm font-medium flex-1 text-left truncate"
                      style={{ color: isCurrentChapter ? currentCourse?.color : '#eaeaea' }}
                    >
                      {chapter.title}
                    </span>

                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: `${currentCourse?.color}20`,
                        color: currentCourse?.color,
                      }}
                    >
                      {chapter.lessons.length}
                    </span>
                  </button>

                  {isExpandedChapter && (
                    <div className="ml-5 mt-0.5 space-y-0.5">
                      {chapter.lessons.map((lesson: Lesson) => {
                        const isCurrent =
                          currentChapterId === chapter.id &&
                          currentLessonId === lesson.slug;
                        const isLessonCompleted =
                          progress.completedLessons[lesson.slug] === true;

                        return (
                          <a
                            key={lesson.id}
                            href={`/course/${currentCourseId}#${chapter.id}-${lesson.lessonNumber}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition-all duration-200 hover:bg-white/5"
                            style={{
                              backgroundColor: isCurrent
                                ? 'rgba(55, 118, 171, 0.2)'
                                : 'transparent',
                              borderLeft: isCurrent
                                ? `2px solid ${currentCourse?.color}`
                                : '2px solid transparent',
                            }}
                          >
                            <CompletionBadge
                              isCompleted={isLessonCompleted}
                              title={isLessonCompleted ? '已完成' : '未完成'}
                            />

                            <span
                              className="flex-1 truncate text-xs"
                              style={{
                                color: isCurrent ? '#fff' : '#a0a0b0',
                                fontWeight: isCurrent ? 600 : 400,
                              }}
                            >
                              {lesson.lessonNumber}. {lesson.title}
                            </span>

                            <span
                              className="text-[10px] px-1 py-0.5 rounded flex-shrink-0"
                              style={{
                                backgroundColor:
                                  lesson.difficulty === 'easy'
                                    ? 'rgba(76, 175, 80, 0.15)'
                                    : lesson.difficulty === 'medium'
                                      ? 'rgba(255, 193, 7, 0.15)'
                                      : 'rgba(244, 67, 54, 0.15)',
                                color:
                                  lesson.difficulty === 'easy'
                                    ? '#4CAF50'
                                    : lesson.difficulty === 'medium'
                                      ? '#FFC107'
                                      : '#f44336',
                              }}
                            >
                              {lesson.difficulty === 'easy'
                                ? '简'
                                : lesson.difficulty === 'medium'
                                  ? '中'
                                  : '难'}
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
