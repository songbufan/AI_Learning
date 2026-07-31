/**
 * ProgressBar — 进度条组件
 *
 * 显示学习进度的可视化条，使用 Python 品牌蓝色。
 *
 * @param completed - 已完成的数量
 * @param total - 总数量
 * @param className - 额外的 CSS 类名（可选）
 */

/**
 * ProgressBar 组件的属性
 */
interface ProgressBarProps {
  /** 已完成的数量 */
  completed: number;
  /** 总数量 */
  total: number;
  /** 额外的 CSS 类名（可选） */
  className?: string;
}

/**
 * ProgressBar 组件
 *
 * 根据 completed 和 total 计算百分比，渲染进度条。
 * 颜色使用 Python 品牌蓝 #3776AB。
 *
 * @param props - 组件属性
 * @returns 进度条 JSX
 */
export default function ProgressBar({
  completed,
  total,
  className = '',
}: ProgressBarProps) {
  // 计算百分比，限制在 0-100 范围内
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className={`w-full ${className}`}>
      {/* 进度条轨道 */}
      <div
        className="w-full h-3 rounded-full overflow-hidden"
        style={{ backgroundColor: '#2a2a4a' }}
      >
        {/* 进度条填充 */}
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${clampedPercentage}%`,
            backgroundColor: '#3776AB',
          }}
        />
      </div>

      {/* 百分比文字 */}
      <div className="flex justify-between mt-1">
        <span className="text-xs" style={{ color: '#a0a0b0' }}>
          {completed} / {total} 已完成
        </span>
        <span className="text-xs font-medium" style={{ color: '#3776AB' }}>
          {clampedPercentage}%
        </span>
      </div>
    </div>
  );
}
