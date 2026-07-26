/**
 * OutputPanel — 代码输出面板组件
 *
 * 显示 Python 代码执行的输出结果，包括：
 * - 标准输出（stdout）- 绿色文字
 * - 错误输出（stderr）- 红色文字
 * - 运行中状态 - 加载动画
 * - 空状态 - 占位提示
 *
 * @param output - 标准输出内容
 * @param error - 错误输出内容（可选）
 * @param isRunning - 是否正在运行（可选）
 */

/**
 * OutputPanel 组件的属性
 */
export interface OutputPanelProps {
  /** 标准输出内容 */
  output: string;
  /** 错误输出内容（可选） */
  error?: string;
  /** 是否正在运行代码（可选） */
  isRunning?: boolean;
}

/**
 * OutputPanel 组件
 *
 * @param props - 组件属性
 * @returns 输出面板 JSX
 */
export default function OutputPanel({
  output,
  error,
  isRunning = false,
}: OutputPanelProps) {
  // 判断是否有任何内容
  const hasContent = output.trim().length > 0 || (error && error.trim().length > 0);

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        borderColor: '#2a2a4a',
        backgroundColor: '#1e1e1e',
        minHeight: '120px',
      }}
    >
      {/* 面板标题栏 */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ borderColor: '#2a2a4a', backgroundColor: '#16213e' }}
      >
        <span className="text-xs font-medium" style={{ color: '#a0a0b0' }}>
          输出
        </span>

        {/* 运行中状态指示 */}
        {isRunning && (
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: '#FFD43B' }}
            />
            <span className="text-xs" style={{ color: '#FFD43B' }}>
              运行中...
            </span>
          </div>
        )}
      </div>

      {/* 输出内容区域 */}
      <div className="p-4">
        {isRunning ? (
          // 运行中：显示加载动画
          <div className="flex items-center gap-3 py-2">
            <div
              className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
              style={{
                borderColor: '#3776AB',
                borderTopColor: 'transparent',
              }}
            />
            <span className="text-sm" style={{ color: '#a0a0b0' }}>
              正在执行代码...
            </span>
          </div>
        ) : !hasContent ? (
          // 空状态：显示占位提示
          <div className="text-center py-6">
            <span className="text-3xl mb-3 block opacity-40">▶️</span>
            <p className="text-sm" style={{ color: '#666' }}>
              点击运行查看输出...
            </p>
          </div>
        ) : (
          // 有内容：显示输出和错误
          <div className="space-y-2">
            {/* 标准输出（绿色） */}
            {output.trim().length > 0 && (
              <div>
                <span className="text-xs block mb-1" style={{ color: '#4CAF50' }}>
                  输出:
                </span>
                <pre
                  className="text-sm whitespace-pre-wrap break-words font-mono"
                  style={{ color: '#4CAF50' }}
                >
                  {output}
                </pre>
              </div>
            )}

            {/* 错误输出（红色） */}
            {error && error.trim().length > 0 && (
              <div>
                <span className="text-xs block mb-1" style={{ color: '#f44336' }}>
                  错误:
                </span>
                <pre
                  className="text-sm whitespace-pre-wrap break-words font-mono"
                  style={{ color: '#f44336' }}
                >
                  {error}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
