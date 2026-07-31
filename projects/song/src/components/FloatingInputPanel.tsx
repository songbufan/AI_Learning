import { useCallback, useRef, useState } from 'react'
import { InputDock3D } from './InputDock3D'

export interface FloatingInputPanelProps {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  busy: boolean
  loading: boolean
  placeholder: string
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

/**
 * 固定于视口底部居中：层叠阴影 + Three.js 底景 + 鼠标驱动 3D 倾斜
 */
export function FloatingInputPanel({
  value,
  onChange,
  onSubmit,
  busy,
  loading,
  placeholder,
  onKeyDown,
}: FloatingInputPanelProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setTilt({ rx: py * -9, ry: px * 11 })
  }, [])

  const onLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0 })
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
      <div
        className="pointer-events-auto w-[min(92vw,42rem)] px-2"
        style={{ perspective: '1100px' }}
      >
        <div
          ref={wrapRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="relative transition-[transform] duration-200 ease-out will-change-transform"
          style={{
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* 层叠：底层光晕 */}
          <div
            className="absolute -inset-3 -z-20 rounded-[1.75rem] bg-emerald-400/35 blur-2xl"
            aria-hidden
          />
          <div
            className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-br from-emerald-300/50 via-white/20 to-teal-400/30 shadow-[0_28px_64px_-12px_rgba(16,185,129,0.55)]"
            aria-hidden
          />
          {/* 中层：顶光 + 底影 */}
          <div
            className="absolute inset-0 -z-[5] rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_18px_40px_-8px_rgba(15,118,110,0.35)]"
            aria-hidden
          />

          <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.15)] backdrop-blur-md">
            <div className="pointer-events-none absolute inset-0 z-0 min-h-[7.5rem]">
              <InputDock3D />
            </div>
            <div className="relative z-10 flex min-h-[5.25rem] items-end gap-3 px-4 py-4">
              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={loading ? '思考中...' : placeholder}
                disabled={busy}
                rows={1}
                className="max-h-32 min-h-[46px] min-w-0 flex-1 cursor-text resize-y rounded-xl border border-emerald-400/55 bg-white/85 px-3 py-2.5 text-[15px] text-slate-900 shadow-[inset_0_2px_6px_rgba(0,0,0,0.06),0_4px_14px_rgba(16,185,129,0.18)] outline-none ring-1 ring-white/80 backdrop-blur-sm placeholder:text-slate-400 transition-shadow focus:border-emerald-500 focus:shadow-[inset_0_2px_8px_rgba(0,0,0,0.07),0_0_0_3px_rgba(16,185,129,0.25)] disabled:cursor-not-allowed disabled:bg-slate-100/90 disabled:text-slate-400"
              />
              <button
                type="button"
                onClick={onSubmit}
                disabled={busy || !value.trim()}
                className="mb-0.5 shrink-0 cursor-pointer rounded-xl bg-gradient-to-b from-emerald-400 to-emerald-700 px-6 py-2.5 text-[15px] font-semibold text-white shadow-[0_4px_0_0_#047857,0_12px_28px_rgba(16,185,129,0.45)] transition [transform:translateZ(12px)] hover:from-emerald-300 hover:to-emerald-600 hover:shadow-[0_4px_0_0_#047857,0_16px_36px_rgba(16,185,129,0.5)] active:translate-y-[2px] active:shadow-[0_2px_0_0_#047857,0_8px_20px_rgba(16,185,129,0.4)] disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-500 disabled:shadow-none"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
