import { vi } from 'vitest';
/// <reference types="vitest" />

import '@testing-library/jest-dom/vitest';

// 为 tsc 提供 localStorage mock 的类型声明（避免 "Property 'mockReturnValue' does not exist" 错误）
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      __localStorageMock__: typeof localStorage;
    }
  }
}

// Mock localStorage — 使用 ReturnType<typeof vi.fn> 让 tsc 识别 mock 方法
const createLocalStorageMock = () => {
  const store: Record<string, string> = {};
  const mock = {
    getItem: vi.fn((key: string) => store[key] ?? null) as ReturnType<typeof vi.fn>,
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }) as ReturnType<typeof vi.fn>,
    removeItem: vi.fn((key: string) => { delete store[key]; }) as ReturnType<typeof vi.fn>,
    clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }) as ReturnType<typeof vi.fn>,
    length: 0,
    key: vi.fn((_i: number) => null) as ReturnType<typeof vi.fn>,
  };
  return mock;
};

Object.defineProperty(window, 'localStorage', { value: createLocalStorageMock() });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: ResizeObserverMock,
});

// Suppress console errors in tests (optional)
const originalError = console.error;
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning:') || args[0].includes('ReactDOM'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};
