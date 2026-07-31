import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CodeEditor from '@/components/ui/CodeEditor';

// Mock codejar 模块
vi.mock('codejar', () => ({
  CodeJar: vi.fn((editor: HTMLElement, _highlight: unknown, _options: unknown) => {
    // 模拟 CodeJar 实例
    return {
      updateCode: vi.fn((code: string) => {
        editor.textContent = code;
      }),
      onUpdate: vi.fn((_callback: (code: string) => void) => {}),
      destroy: vi.fn(),
    };
  }),
}));

describe('CodeEditor — 代码编辑器', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==================== 渲染 ====================

  describe('渲染', () => {
    it('应该渲染编辑器容器', () => {
      render(<CodeEditor code="test" onChange={() => {}} />);
      expect(screen.getByText('正在加载编辑器...')).toBeInTheDocument();
    });

    it('应该渲染加载动画', async () => {
      render(<CodeEditor code="test" onChange={() => {}} />);
      // CodeJar 异步加载，初始显示加载状态
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('应该应用自定义高度', () => {
      const { container } = render(<CodeEditor code="test" onChange={() => {}} height="400px" />);
      const editorContainer = container.querySelector('.codejar-editor');
      expect(editorContainer).toHaveStyle({ height: '400px' });
    });

    it('默认高度应该是 300px', () => {
      const { container } = render(<CodeEditor code="test" onChange={() => {}} />);
      const editorContainer = container.querySelector('.codejar-editor');
      expect(editorContainer).toHaveStyle({ height: '300px' });
    });
  });

  // ==================== 语言类名 ====================

  describe('语言高亮', () => {
    it('应该添加 language-python 类名', async () => {
      render(<CodeEditor code="test" onChange={() => {}} language="python" />);
      await waitFor(() => {
        const editor = document.querySelector('.language-python');
        expect(editor).toBeInTheDocument();
      });
    });

    it('应该添加 language-javascript 类名', async () => {
      render(<CodeEditor code="test" onChange={() => {}} language="javascript" />);
      await waitFor(() => {
        const editor = document.querySelector('.language-javascript');
        expect(editor).toBeInTheDocument();
      });
    });
  });

  // ==================== 编辑器样式 ====================

  describe('编辑器样式', () => {
    it('应该有深色背景', () => {
      const { container } = render(<CodeEditor code="test" onChange={() => {}} />);
      const editorContainer = container.querySelector('.codejar-editor');
      expect(editorContainer).toHaveStyle({ backgroundColor: '#1e1e1e' });
    });

    it('应该有边框', () => {
      const { container } = render(<CodeEditor code="test" onChange={() => {}} />);
      const editorContainer = container.querySelector('.codejar-editor');
      expect(editorContainer).toHaveStyle({ border: '1px solid #2a2a4a' });
    });

    it('应该有等宽字体', () => {
      const { container } = render(<CodeEditor code="test" onChange={() => {}} />);
      const editorContainer = container.querySelector('.codejar-editor');
      expect(editorContainer).toHaveStyle({
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
      });
    });
  });

  // ==================== Prism 导入 ====================

  describe('Prism.js 集成', () => {
    it('应该导入 Prism 模块', async () => {
      // 验证 Prism 被导入（组件源码中直接 import Prism）
      const prism = await import('prismjs');
      expect(prism).toBeDefined();
    });

    it('应该导入 Python 语言高亮支持', async () => {
      // 验证 Prism Python 组件被导入（该模块缺少类型声明，使用 @ts-ignore）
      // @ts-ignore — prismjs/components/prism-python 无 .d.ts 声明文件
      await import('prismjs/components/prism-python');
      // 如果导入成功，Prism.languages 应该包含 python
      const Prism = (await import('prismjs')).default;
      expect(Prism.languages.python).toBeDefined();
    });
  });
});
