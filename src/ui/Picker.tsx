import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import type { Opt } from '../content/labels'
import '../styles/picker.css'

interface PickerProps {
  label: string
  value: string
  options: Opt[]
  groups?: string[]
  onChange: (v: string) => void
  hint?: string
  /** browse: 분류 목록 + 항목이 있는 넓은 패널(사람인 방식). list: 항목 몇 개만 있는 작은 목록 */
  mode?: 'browse' | 'list'
  /** 데모 장면에서 커서가 찾아갈 이름 */
  target?: string
}

// 항목이 많을 때 쓰는 선택기. 왼쪽에서 분류를 고르고 오른쪽에서 항목을 누르거나, 위 검색칸에 이름을 쓴다.
export function Picker({ label, value, options, groups = [], onChange, hint = '이름으로 검색', mode = 'browse', target }: PickerProps) {
  const cur = options.find((o) => o.value === value)
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [group, setGroup] = useState(cur?.group ?? '전체')
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const browse = mode === 'browse'

  const items = useMemo(() => {
    const n = q.trim().toLowerCase()
    if (n) return options.filter((o) => `${o.label} ${o.sub ?? ''} ${o.kw ?? ''} ${o.group}`.toLowerCase().includes(n))
    if (!browse || group === '전체') return options
    return options.filter((o) => o.group === group)
  }, [options, q, group, browse])

  const close = () => { setOpen(false); setQ('') }
  const pick = (o: Opt) => { onChange(o.value); close(); btn.current?.focus() }
  const openPanel = () => { setGroup(cur?.group ?? '전체'); setOpen(true) }

  useEffect(() => {
    if (!open) return
    if (browse) input.current?.focus()
    const outside = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) close() }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [open, browse])
  useEffect(() => { setActive(Math.max(0, items.findIndex((o) => o.value === value))) }, [open, q, group]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' }) }, [active, open])

  function onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); setActive((a) => Math.min(items.length - 1, a + 1)) }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)) }
    else if (e.key === 'Enter') { e.preventDefault(); if (items[active]) pick(items[active]) }
    else if (e.key === 'Escape') { close(); btn.current?.focus() }
  }

  return (
    <div className={`pk pk--${mode}`} ref={root}>
      <button ref={btn} type="button" className="pk__btn" aria-haspopup="dialog" aria-expanded={open}
        data-target={target} data-cursor={target ? 'pointer' : undefined}
        onClick={() => (open ? close() : openPanel())}>
        <span className="pk__label">{label}</span>
        <span className="pk__val"><span className="pk__main">{cur?.label ?? '선택'}</span>{browse && cur?.sub && <small>{cur.sub}</small>}</span>
        <ChevronDown size={20} strokeWidth={1.5} aria-hidden className="pk__chev" />
      </button>
      {open && (
        <div className="pk__panel" role="dialog" aria-label={`${label} 선택`} onKeyDown={onKey}>
          {browse && (
            <label className="pk__search">
              <Search size={20} strokeWidth={1.5} aria-hidden />
              <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder={hint} aria-label={`${label} 검색`} />
            </label>
          )}
          <div className="pk__body">
            {browse && (
              <ul className="pk__cats">
                {['전체', ...groups].map((g) => (
                  <li key={g}>
                    <button type="button" aria-current={!q.trim() && g === group} onClick={() => { setQ(''); setGroup(g) }}>
                      <span>{g}</span><small>{g === '전체' ? options.length : options.filter((o) => o.group === g).length}</small>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="pk__items" role="listbox" aria-label={label} ref={listRef}>
              {browse && q.trim() && <p className="pk__note">'{q.trim()}' 검색 결과 {items.length}개</p>}
              {items.length === 0 && <p className="pk__none">찾는 항목이 없습니다. 다른 말로 검색하거나 왼쪽 분류를 눌러 보세요</p>}
              <div className="pk__grid">
                {items.map((o, i) => (
                  <div key={o.value} role="option" aria-selected={o.value === value} data-active={i === active} className="pk__opt"
                    onMouseDown={(e) => { e.preventDefault(); pick(o) }} onMouseEnter={() => setActive(i)}>
                    <span>{o.label}</span>{browse && o.sub && <small>{o.sub}</small>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface SegProps { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }

// 선택지가 5개 안팎이고 좁은 곳에서는 펼쳐 두고 한 번에 누른다.
export function Seg({ label, value, options, onChange }: SegProps) {
  return (
    <div className="seg-wrap">
      <span className="seg-label">{label}</span>
      <div className="seg" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={o.value === value} onClick={() => onChange(o.value)}>{o.label}</button>
        ))}
      </div>
    </div>
  )
}
