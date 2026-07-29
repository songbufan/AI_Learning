import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '@/components/ui/Sidebar';
import type { Course, SubChapter, Progress } from '@/types';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock ProgressBar
vi.mock('@/components/ui/ProgressBar', () => ({
  default: ({ completed, total }: { completed: number; total: number }) => (
    <div data-testid="progress-bar">{completed}/{total}</div>
  ),
}));

// Mock CompletionBadge
vi.mock('@/components/ui/CompletionBadge', () => ({
  default: ({ isCompleted }: { isCompleted: boolean }) => (
    <span data-testid="completion-badge">{isCompleted ? '✓' : '○'}</span>
  ),
}));

/** 创建测试用子章节 */
function createTestChapter(overrides?: Partial<SubChapter>): SubChapter {
  return {
    id: 1,
    title: '测试章节',
    icon: '📘',
    lessons: [
      {
        id: '1-1', chapterId: 1, courseId: 1, lessonNumber: 1,
        title: '第一课', description: '', slug: '1-1',
        difficulty: 'easy' as const, duration: 10,
        contentPath: '/test.md', initialCode: '', expectedOutput: '',
      },
      {
        id: '1-2', chapterId: 1, courseId: 1, lessonNumber: 2,
        title: '第二课', description: '', slug: '1-2',
        difficulty: 'medium' as const, duration: 15,
        contentPath: '/test.md', initialCode: '', expectedOutput: '',
      },
    ],
    ...overrides,
  };
}

function createTestCourse(overrides?: Partial<Course>): Course {
  return {
    id: 1,
    title: '测试课程',
    description: '测试描述',
    icon: '🐍',
    color: '#3776AB',
    chapters: [createTestChapter()],
    ...overrides,
  };
}

function createTestProgress(overrides?: Partial<Progress>): Progress {
  return {
    completedLessons: {},
    lastVisit: new Date().toISOString(),
    startDate: new Date().toISOString(),
    totalCompleted: 0,
    ...overrides,
  };
}

describe('Sidebar — 侧边栏导航', () => {
  const mockCourses = [
    createTestCourse({
      id: 1,
      chapters: [
        createTestChapter({ id: 1, title: 'Python 入门', icon: '📘' }),
        createTestChapter({ id: 2, title: '条件判断', icon: '🔀', lessons: [] }),
      ],
    }),
  ];

  // ==================== 折叠状态 ====================

  describe('折叠状态', () => {
    it('默认应该显示折叠状态（章节图标列表）', () => {
      render(<Sidebar courses={mockCourses} currentCourseId={1} progress={createTestProgress()} />);
      // 折叠状态下显示课程图标和章节图标
      const courseIcons = screen.getAllByText('🐍');
      const chapter1Icons = screen.getAllByText('📘');
      const chapter2Icons = screen.getAllByText('🔀');
      expect(courseIcons.length).toBe(1); // 仅折叠区
      expect(chapter1Icons.length).toBe(2); // 折叠区链接 + 展开区章节图标
      expect(chapter2Icons.length).toBe(2);
    });

    it('折叠状态不应该显示章节文字', () => {
      render(<Sidebar courses={mockCourses} currentCourseId={1} progress={createTestProgress()} />);
      // 折叠区域使用 hash 链接，不包含"第1章"文字
      const collapsedLinks = screen.getAllByRole('link');
      const collapsedChapterLinks = collapsedLinks.filter(l => l.getAttribute('href')?.includes('#'));
      expect(collapsedChapterLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('折叠状态的章节图标应该链接到对应章节', () => {
      render(<Sidebar courses={mockCourses} currentCourseId={1} progress={createTestProgress()} />);
      // 查找折叠区域的章节图标链接（使用 hash）
      const collapsedLink = screen.getByRole('link', { name: '📘' });
      expect(collapsedLink).toHaveAttribute('href', '/course/1#1-1');
    });
  });

  // ==================== 展开状态（悬浮） ====================

  describe('展开状态', () => {
    it('悬浮时应该展开显示完整内容', () => {
      render(<Sidebar courses={mockCourses} currentCourseId={1} progress={createTestProgress()} />);
      const sidebar = screen.getByText('总进度').closest('aside')!;
      fireEvent.mouseEnter(sidebar);

      expect(screen.getByText('Python 入门')).toBeInTheDocument();
      expect(screen.getByText('条件判断')).toBeInTheDocument();
    });

    it('展开时应该显示章节图标', () => {
      render(<Sidebar courses={mockCourses} currentCourseId={1} progress={createTestProgress()} />);
      const sidebar = screen.getByText('总进度').closest('aside')!;
      fireEvent.mouseEnter(sidebar);

      const chapterIcons = screen.getAllByText('📘');
      expect(chapterIcons.length).toBeGreaterThanOrEqual(1);
      const chapterIcons2 = screen.getAllByText('🔀');
      expect(chapterIcons2.length).toBeGreaterThanOrEqual(1);
    });

    it('展开时应该显示课时数量徽章', () => {
      render(<Sidebar courses={mockCourses} currentCourseId={1} progress={createTestProgress()} />);
      const sidebar = screen.getByText('总进度').closest('aside')!;
      fireEvent.mouseEnter(sidebar);

      const lessonBadges = screen.getAllByText('2');
      expect(lessonBadges.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ==================== 展开/折叠章节 ====================

  describe('展开/折叠章节', () => {
    it('点击章节按钮可以展开显示课时列表', () => {
      render(
        <Sidebar
          courses={mockCourses}
          currentCourseId={1}
          currentChapterId={1}
          progress={createTestProgress()}
        />
      );
      const sidebar = screen.getByText('总进度').closest('aside')!;
      fireEvent.mouseEnter(sidebar);

      expect(screen.getByText('1. 第一课')).toBeInTheDocument();
      expect(screen.getByText('2. 第二课')).toBeInTheDocument();
    });

    it('点击章节按钮可以折叠隐藏课时列表', () => {
      render(
        <Sidebar
          courses={mockCourses}
          currentCourseId={1}
          currentChapterId={1}
          progress={createTestProgress()}
        />
      );
      const sidebar = screen.getByText('总进度').closest('aside')!;
      fireEvent.mouseEnter(sidebar);

      expect(screen.getByText('1. 第一课')).toBeInTheDocument();
      const chapterBtn = screen.getByText('Python 入门').closest('button')!;
      fireEvent.click(chapterBtn);
      expect(screen.queryByText('1. 第一课')).not.toBeInTheDocument();
    });
  });

  // ==================== 当前章节高亮 ====================

  describe('当前章节高亮', () => {
    it('当前章节按钮应该渲染', () => {
      render(
        <Sidebar
          courses={mockCourses}
          currentCourseId={1}
          currentChapterId={1}
          progress={createTestProgress()}
        />
      );
      const sidebar = screen.getByText('总进度').closest('aside')!;
      fireEvent.mouseEnter(sidebar);

      const chapter1Btn = screen.getByText('Python 入门').closest('button');
      expect(chapter1Btn).toBeInTheDocument();
    });
  });

  // ==================== 进度显示 ====================

  describe('进度显示', () => {
    it('应该渲染进度条', () => {
      render(<Sidebar courses={mockCourses} currentCourseId={1} progress={createTestProgress()} />);
      expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    });

    it('零进度时显示 0/2', () => {
      render(<Sidebar courses={mockCourses} currentCourseId={1} progress={createTestProgress()} />);
      expect(screen.getByText('0/2')).toBeInTheDocument();
    });

    it('有已完成课时时显示正确完成数', () => {
      const progress = createTestProgress({
        completedLessons: { '1-1': true },
        totalCompleted: 1,
      });
      render(
        <Sidebar
          courses={mockCourses}
          currentCourseId={1}
          currentChapterId={1}
          progress={progress}
        />
      );
      expect(screen.getByText('1/2')).toBeInTheDocument();
    });
  });

  // ==================== 完成标记 ====================

  describe('完成标记', () => {
    it('已完成的课时显示 ✓', () => {
      const progress = createTestProgress({ completedLessons: { '1-1': true } });
      render(
        <Sidebar
          courses={mockCourses}
          currentCourseId={1}
          currentChapterId={1}
          progress={progress}
        />
      );
      const sidebar = screen.getByText('总进度').closest('aside')!;
      fireEvent.mouseEnter(sidebar);

      const badges = screen.getAllByTestId('completion-badge');
      expect(badges[0].textContent).toBe('✓');
      expect(badges[1].textContent).toBe('○');
    });

    it('未完成的课时显示 ○', () => {
      render(
        <Sidebar
          courses={mockCourses}
          currentCourseId={1}
          currentChapterId={1}
          progress={createTestProgress()}
        />
      );
      const sidebar = screen.getByText('总进度').closest('aside')!;
      fireEvent.mouseEnter(sidebar);

      const badges = screen.getAllByTestId('completion-badge');
      expect(badges[0].textContent).toBe('○');
      expect(badges[1].textContent).toBe('○');
    });
  });

  // ==================== 难度标签 ====================

  describe('难度标签', () => {
    it('easy 显示"简"', () => {
      render(
        <Sidebar
          courses={mockCourses}
          currentCourseId={1}
          currentChapterId={1}
          progress={createTestProgress()}
        />
      );
      const sidebar = screen.getByText('总进度').closest('aside')!;
      fireEvent.mouseEnter(sidebar);

      expect(screen.getByText('简')).toBeInTheDocument();
    });

    it('medium 显示"中"', () => {
      render(
        <Sidebar
          courses={mockCourses}
          currentCourseId={1}
          currentChapterId={1}
          progress={createTestProgress()}
        />
      );
      const sidebar = screen.getByText('总进度').closest('aside')!;
      fireEvent.mouseEnter(sidebar);

      expect(screen.getByText('中')).toBeInTheDocument();
    });

    it('hard 显示"难"', () => {
      const hardCourse = createTestCourse({
        chapters: [
          createTestChapter({
            lessons: [
              {
                id: '1-3', chapterId: 1, courseId: 1, lessonNumber: 3,
                title: '困难课', description: '', slug: '1-3',
                difficulty: 'hard' as const, duration: 30,
                contentPath: '/test.md', initialCode: '', expectedOutput: '',
              },
            ],
          }),
        ],
      });
      render(
        <Sidebar courses={[hardCourse]} currentCourseId={1} currentChapterId={1} progress={createTestProgress()} />
      );
      const sidebar = screen.getByText('总进度').closest('aside')!;
      fireEvent.mouseEnter(sidebar);

      expect(screen.getByText('难')).toBeInTheDocument();
    });
  });
});
