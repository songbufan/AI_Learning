/**
 * ProgressOverview — 首页总进度概览组件
 *
 * 在首页显示用户的总学习进度，包括：
 * - 已完成课时数 / 总课时数
 * - 进度百分比
 * - 进度条
 *
 * 这是一个客户端组件，使用 useProgress Hook 获取实时进度数据。
 *
 * @param totalLessons - 总课时数
 */

'use client';

import { useProgress } from '@/hooks/useProgress';
import ProgressBar from './ProgressBar';

/**
 * ProgressOverview 组件的属性
 */
interface ProgressOverviewProps {
  /** 总课时数 */
  totalLessons: number;
}

/**
 * ProgressOverview 组件
 *
 * @param props - 组件属性
 * @returns 进度概览 JSX
 */
export default function ProgressOverview({ totalLessons }: ProgressOverviewProps) {
  const { totalCompleted } = useProgress();

  return (
    <div>
      <div className="flex justify-between text-sm mb-2" style={{ color: '#a0a0b0' }}>
        <span>总进度</span>
        <span>{totalCompleted} / {totalLessons} 课时</span>
      </div>
      <ProgressBar completed={totalCompleted} total={totalLessons} />
    </div>
  );
}
