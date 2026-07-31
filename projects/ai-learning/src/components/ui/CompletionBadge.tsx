/**
 * CompletionBadge — 课时完成标记组件
 *
 * 显示课时是否已完成的视觉标记：
 * - 已完成：绿色背景 + 对勾 ✓
 * - 未完成：灰色背景 + 圆圈 ○
 *
 * @param isCompleted - 是否已完成
 * @param title - 鼠标悬停时的提示文字（可选）
 */

/**
 * CompletionBadge 组件的属性
 */
interface CompletionBadgeProps {
  /** 是否已完成 */
  isCompleted: boolean;
  /** 鼠标悬停提示文字（可选） */
  title?: string;
}

/**
 * CompletionBadge 组件
 *
 * @param props - 组件属性
 * @returns 完成标记 JSX
 */
export default function CompletionBadge({
  isCompleted,
  title,
}: CompletionBadgeProps) {
  // 根据完成状态确定显示内容和样式
  const displayText = isCompleted ? '✓' : '○';
  const backgroundColor = isCompleted
    ? 'rgba(76, 175, 80, 0.2)'    // 绿色半透明背景
    : 'rgba(255, 255, 255, 0.05)'; // 灰色半透明背景
  const textColor = isCompleted ? '#4CAF50' : '#666'; // 绿色或灰色文字
  const borderColor = isCompleted ? '#4CAF50' : '#333'; // 绿色或灰色边框
  const tooltipText = title || (isCompleted ? '已完成' : '未完成');

  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0"
      style={{
        backgroundColor,
        color: textColor,
        border: `1.5px solid ${borderColor}`,
      }}
      title={tooltipText}
    >
      {displayText}
    </span>
  );
}
