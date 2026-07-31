import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import OutputPanel from '@/components/ui/OutputPanel';

describe('OutputPanel — 代码输出面板', () => {
  // ==================== 空状态 ====================

  describe('空状态', () => {
    it('没有输出且不在运行时应该显示占位提示', () => {
      render(<OutputPanel output="" error="" isRunning={false} />);
      expect(screen.getByText('点击运行查看输出...')).toBeInTheDocument();
      expect(screen.getByText('▶️')).toBeInTheDocument();
    });

    it('空字符串输出应该视为空状态', () => {
      render(<OutputPanel output="" error="" isRunning={false} />);
      expect(screen.getByText('点击运行查看输出...')).toBeInTheDocument();
    });

    it('只有空格的输出应该视为空状态', () => {
      render(<OutputPanel output="   " error="" isRunning={false} />);
      expect(screen.getByText('点击运行查看输出...')).toBeInTheDocument();
    });
  });

  // ==================== 运行中状态 ====================

  describe('运行中状态', () => {
    it('isRunning=true 时应该显示加载动画', () => {
      render(<OutputPanel output="" error="" isRunning={true} />);
      expect(screen.getByText('正在执行代码...')).toBeInTheDocument();
    });

    it('isRunning=true 时不应该显示空状态提示', () => {
      render(<OutputPanel output="" error="" isRunning={true} />);
      expect(screen.queryByText('点击运行查看输出...')).not.toBeInTheDocument();
    });

    it('isRunning=true 且有旧输出时应该显示加载动画而非输出', () => {
      render(<OutputPanel output="旧输出" error="" isRunning={true} />);
      expect(screen.getByText('正在执行代码...')).toBeInTheDocument();
      expect(screen.queryByText('旧输出')).not.toBeInTheDocument();
    });
  });

  // ==================== stdout 输出 ====================

  describe('标准输出（stdout）', () => {
    it('应该显示输出内容', () => {
      render(<OutputPanel output="Hello, World!" error="" isRunning={false} />);
      expect(screen.getByText('Hello, World!')).toBeInTheDocument();
      expect(screen.getByText('输出:')).toBeInTheDocument();
    });

    it('多行输出应该正确显示', () => {
      const multiLine = 'Line 1\nLine 2\nLine 3';
      const { container } = render(<OutputPanel output={multiLine} error="" isRunning={false} />);
      const pre = container.querySelector('pre')!;
      expect(pre.textContent).toBe('Line 1\nLine 2\nLine 3');
    });

    it('输出应该用绿色显示', () => {
      const { container } = render(<OutputPanel output="test" error="" isRunning={false} />);
      const outputPre = container.querySelector('pre');
      expect(outputPre).toHaveStyle({ color: '#4CAF50' });
    });
  });

  // ==================== stderr 输出 ====================

  describe('错误输出（stderr）', () => {
    it('应该显示错误内容', () => {
      render(<OutputPanel output="" error="SyntaxError: invalid syntax" isRunning={false} />);
      expect(screen.getByText('SyntaxError: invalid syntax')).toBeInTheDocument();
      expect(screen.getByText('错误:')).toBeInTheDocument();
    });

    it('错误应该用红色显示', () => {
      const { container } = render(<OutputPanel output="" error="some error" isRunning={false} />);
      const errorPre = container.querySelectorAll('pre')[0];
      expect(errorPre).toHaveStyle({ color: '#f44336' });
    });

    it('同时有输出和错误时都应该显示', () => {
      render(<OutputPanel output="partial output" error="Traceback (most recent call last)" isRunning={false} />);
      expect(screen.getByText('partial output')).toBeInTheDocument();
      expect(screen.getByText('Traceback (most recent call last)')).toBeInTheDocument();
    });
  });

  // ==================== 面板结构 ====================

  describe('面板结构', () => {
    it('应该显示"输出"标题栏', () => {
      render(<OutputPanel output="test" error="" isRunning={false} />);
      expect(screen.getByText('输出')).toBeInTheDocument();
    });

    it('应该有正确的面板边框样式', () => {
      const { container } = render(<OutputPanel output="test" error="" isRunning={false} />);
      const panel = container.firstChild as HTMLElement;
      expect(panel).toHaveStyle({ borderColor: '#2a2a4a' });
    });
  });
});
