import { useId, useState } from 'react'
import { Info } from 'lucide-react'

interface Props {
  /** 풍선에 보일 설명 */
  text: string
  /** 스크린리더용 이름 */
  label?: string
  /** 풍선이 열리는 쪽. 화면 오른쪽 가장자리에서는 right를 쓴다 */
  align?: 'left' | 'right'
}

// 물음표 설명. 마우스를 올리거나, 눌러서(터치) 열고, 바깥을 누르거나 Esc로 닫는다.
export function Hint({ text, label = '설명 보기', align = 'left' }: Props) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <span className="hint" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button" className="hint__btn" aria-label={label} aria-expanded={open} aria-describedby={open ? id : undefined}
        onClick={() => setOpen((o) => !o)} onBlur={() => setOpen(false)} onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}
      >
        <Info size={16} strokeWidth={1.5} aria-hidden />
      </button>
      {open && <span role="tooltip" id={id} className={'hint__tip' + (align === 'right' ? ' hint__tip--right' : '')}>{text}</span>}
    </span>
  )
}
