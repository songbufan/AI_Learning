import Link from 'next/link';
import type { Course } from '@/types';
import { courses } from '@/lib/content';

/**
 * 首页组件 — 仅显示课程卡片网格，居中展示
 *
 * 路由：/
 */
export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto px-6 sm:px-8">
        {courses.map((course: Course, index) => {
          // 计算该课程的总课时数
          const courseLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);

          return (
            <Link
              key={course.id}
              href={`/course/${course.id}`}
              className="group block rounded-xl border-2 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]"
              style={{
                borderColor: course.color,
                backgroundColor: '#16213e',
                animation: `fadeInUp 0.4s ease-out ${index * 0.08}s both`,
              }}
            >
              {/* 课程图标和标题 */}
              <div className="flex items-center gap-3 mb-4 px-7 py-6 pb-0">
                <span className="text-3xl">{course.icon}</span>
                <div>
                  <h3
                    className="text-lg font-bold group-hover:underline"
                    style={{ color: course.color }}
                  >
                    {course.title}
                  </h3>
                  <p className="text-xs" style={{ color: '#a0a0b0' }}>
                    {course.chapters.length} 章 · {courseLessons} 课时
                  </p>
                </div>
              </div>

              {/* 课程描述 */}
              <p
                className="text-sm leading-relaxed px-24 py-20"
                style={{ color: '#a0a0b0' }}
              >
                {course.description}
              </p>

              {/* 悬停指示器 */}
              <div
                className="px-7 py-6 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0"
                style={{ color: course.color }}
              >
                开始学习 →
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
