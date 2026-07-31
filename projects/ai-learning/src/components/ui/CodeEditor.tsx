/**
 * CodeEditor — CodeJar + Prism.js 轻量代码编辑器
 *
 * 技术选型：
 * - CodeJar (~1KB)：contenteditable 编辑能力，支持 Tab/撤销重做/括号自动闭合
 * - Prism.js：Python 语法高亮
 *
 * 为什么不用 Monaco Editor：
 * Monaco 依赖 web workers 和 AMD 模块加载，在静态导出 (output: 'export')
 * 环境下 worker 文件路径不可达，编辑器初始化崩溃，反复修补无意义。
 * CodeJar 零依赖、无 worker、无构建配置，在静态导出环境下完全可靠。
 *
 * CodeJar 在模块顶层引用 window，因此必须在 useEffect 中动态导入，
 * 确保只在浏览器端执行，避免 SSR 报错。
 *
 * @param code - 编辑器中的代码内容
 * @param onChange - 代码变化时的回调函数
 * @param language - 编程语言，默认为 "python"
 * @param height - 编辑器高度，默认为 "300px"
 */

'use client';

import { useEffect, useRef, useState } from 'react';

import Prism from 'prismjs';

// 导入 Prism Python 语言支持
import 'prismjs/components/prism-python';

export interface CodeEditorProps {
  /** 编辑器中的代码内容 */
  code: string;
  /** 代码变化时的回调，接收新的代码字符串 */
  onChange: (value: string) => void;
  /** 编程语言，默认为 "python" */
  language?: string;
  /** 编辑器高度，默认为 "300px" */
  height?: string;
}

/** CodeJar 实例返回类型 */
interface JarInstance {
  updateCode(code: string, callOnUpdate?: boolean): void;
  onUpdate(callback: (code: string) => void): void;
  destroy(): void;
}

/**
 * Prism 语法高亮回调
 * CodeJar 在每次编辑后会调用此函数，
 * 保存光标位置 → 高亮 → 恢复光标位置
 */
function highlight(editor: HTMLElement): void {
  // 编辑器不在 DOM 中或 CodeJar 已销毁，跳过高亮避免 DOM 操作异常
  if (!editor.isConnected || !editor.parentNode) {
    return;
  }

  // 保存光标位置
  const selection = document.getSelection();
  const cursorOffset = selection?.anchorOffset ?? 0;
  const cursorNode = selection?.anchorNode;

  // Prism 语法高亮
  Prism.highlightElement(editor);

  // 恢复光标位置
  if (selection && cursorNode && editor.contains(cursorNode)) {
    const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
    let currentOffset = 0;
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const nodeLength = node.textContent?.length ?? 0;
      if (currentOffset + nodeLength >= cursorOffset) {
        selection.setPosition(node, Math.min(cursorOffset - currentOffset, nodeLength));
        break;
      }
      currentOffset += nodeLength;
    }
  }
}

/**
 * CodeEditor 组件
 */
export default function CodeEditor({
  code,
  onChange,
  language = 'python',
  height = '300px',
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const jarRef = useRef<JarInstance | null>(null);
  const isInternalUpdate = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let jar: JarInstance | null = null;
    let cancelled = false;

    // 动态导入 CodeJar，确保只在浏览器端执行
    import('codejar').then(({ CodeJar }) => {
      if (cancelled || !editorRef.current) return;

      // 设置语言类名，让 Prism 知道要高亮哪种语言
      const langClass = `language-${language}`;
      editorRef.current.classList.add(langClass);

      jar = CodeJar(editorRef.current, highlight, {
        tab: '    ', // 4 个空格
        catchTab: true,
        preserveIdent: true,
        addClosing: true,
        history: true,
        spellcheck: false,
      });

      jarRef.current = jar;

      // 设置初始代码
      jar.updateCode(code, false);

      // 监听代码变化，通知父组件
      jar.onUpdate((newCode: string) => {
        // 标记此次更新来自编辑器内部，防止父组件回传时循环调用 updateCode
        isInternalUpdate.current = true;
        onChange(newCode);
      });

      setIsReady(true);
    });

    return () => {
      cancelled = true;
      if (jar) {
        jar.destroy();
        jarRef.current = null;
      }
    };
    // CodeJar 实例只创建一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // 父组件传入的 code 变化时更新编辑器
  useEffect(() => {
    if (jarRef.current && !isInternalUpdate.current) {
      jarRef.current.updateCode(code, false);
    }
    isInternalUpdate.current = false;
  }, [code]);

  return (
    <div
      className="codejar-editor"
      style={{
        position: 'relative',
        height,
        backgroundColor: '#1e1e1e',
        border: '1px solid #2a2a4a',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        padding: '12px',
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
        fontSize: '14px',
        lineHeight: '22px',
        color: '#d4d4d4',
        outline: 'none',
        whiteSpace: 'pre-wrap',
        tabSize: 4,
      }}
    >
      {/* CodeJar 管理的编辑器（React 不干预其子节点） */}
      <div
        ref={editorRef}
        style={{
          minHeight: '100%',
          outline: 'none',
        }}
      />

      {/* 加载覆盖层：独立于编辑器 div，避免 React 与 CodeJar 的 DOM 操作冲突 */}
      {!isReady && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1e1e1e',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: '#3776AB', borderTopColor: 'transparent' }}
            />
            <span style={{ color: '#a0a0b0' }}>正在加载编辑器...</span>
          </div>
        </div>
      )}
    </div>
  );
}
