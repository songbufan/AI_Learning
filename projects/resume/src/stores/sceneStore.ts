import { create } from 'zustand';

export type SceneObjectKey = 'laptop' | 'bookshelf' | 'frame' | 'character' | 'lamp' | null;

export type LoadStage =
  | 'idle'
  | 'renderer'
  | 'lights'
  | 'room'
  | 'furniture'
  | 'character'
  | 'ready';

interface LoadingState {
  progress: number;
  hint: string;
  stage: LoadStage;
  done: boolean;
}

interface FocusState {
  key: SceneObjectKey;
}

interface LampState {
  on: boolean;
}

interface ClockState {
  hour: number;
  minute: number;
  dayT: number;
}

interface WebGLState {
  supported: boolean;
  checked: boolean;
}

interface SceneState {
  loading: LoadingState;
  focus: FocusState;
  lamp: LampState;
  clock: ClockState;
  webgl: WebGLState;

  setProgress: (pct: number, hint: string, stage?: LoadStage) => void;
  setFocus: (key: SceneObjectKey) => void;
  toggleLamp: () => void;
  updateClock: (hour: number, minute: number, dayT: number) => void;
  setWebGLSupport: (supported: boolean) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  loading: {
    progress: 0,
    hint: 'Initialising scene…',
    stage: 'idle',
    done: false
  },
  focus: { key: null },
  lamp: { on: true },
  clock: {
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
    dayT: 0
  },
  webgl: {
    supported: true,
    checked: false
  },

  setProgress: (progress, hint, stage) =>
    set((state) => ({
      loading: {
        ...state.loading,
        progress,
        hint,
        ...(stage && { stage }),
        done: progress >= 100
      }
    })),

  setFocus: (key) => set({ focus: { key } }),

  toggleLamp: () =>
    set((state) => ({ lamp: { on: !state.lamp.on } })),

  updateClock: (hour, minute, dayT) =>
    set({ clock: { hour, minute, dayT } }),

  setWebGLSupport: (supported) =>
    set({ webgl: { supported, checked: true } })
}));
