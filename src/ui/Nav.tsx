import { useState } from 'react'
import { X } from 'lucide-react'
import { FACTS } from '../content/facts'

export type Route = 'home' | 'app' | 'pitch'

const LINKS: [string, string, string?][] = [
  ['#problem', '문제'],
  ['#solution', '해결'],
  ['#model', '사업모델'],
  ['#proof', '증명'],
  ['#cases', '납품 사례'],
  ['#pilot', '시범 운영'],
  ['#faq', 'FAQ'],
]

export function Nav({ route }: { route: Route }) {
  const [bar, setBar] = useState(true)
  return (
    <>
      {route === 'home' && bar && (
        <div className="announce">
          <p>공고 초안형 연봉 견적, 시범 운영을 제안합니다 <a href="#/pitch">시범 운영 안내 보기</a></p>
          <button type="button" aria-label="안내 닫기" onClick={() => setBar(false)}><X size={18} strokeWidth={1.5} /></button>
        </div>
      )}
      <header className="nav">
        <div className="nav__in">
          <a className="nav__brand" href="#/">눈치페이</a>
          <nav className="nav__links" aria-label="주요 메뉴">
            {route === 'home' && LINKS.map(([href, label, badge]) => <a key={href} className="nav__link" href={href}>{label}{badge && <em className="nav__badge">{badge}</em>}</a>)}
          </nav>
          <div className="nav__actions">
            {route !== 'home' && <a className="btn btn--sm btn--ghost" href="#/">소개로 돌아가기</a>}
            {route !== 'app' && <a className="btn btn--sm btn--ghost nav__pitch" href="#/app">견적 체험</a>}
            {route !== 'pitch' && <a className="btn btn--sm" href="#/pitch">시범 운영 안내</a>}
          </div>
        </div>
      </header>
    </>
  )
}
