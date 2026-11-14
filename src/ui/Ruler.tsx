import { SPREAD, usd } from '../lib/format'

interface Props { p25: number; p50: number; p75: number; notes?: [string, string, string]; bare?: boolean }

// 이 제품의 서명: 눈금자. 낮은 편~높은 편 범위를 눈금 위의 구간으로, 중간값을 막대로 그린다.
// (p25, p50, p75는 데이터의 하위 25%, 중간, 상위 25% 값. 화면에는 통계 용어를 쓰지 않는다)
// bare는 눈금자만 그린다(숫자는 바깥에서 따로 보여줄 때).
export function Ruler({ p25, p50, p75, notes, bare }: Props) {
  const lo = p25 * 0.85
  const hi = p75 * 1.15
  const pos = (v: number) => ((v - lo) / (hi - lo)) * 100
  return (
    <div className="ruler" role="img" aria-label={`${SPREAD.lo} ${usd(p25)}, ${SPREAD.mid} ${usd(p50)}, ${SPREAD.hi} ${usd(p75)}`}>
      <div className="ruler__track">
        <div className="ruler__fill" style={{ left: pos(p25) + '%', width: pos(p75) - pos(p25) + '%' }} />
        <i className="ruler__mid" style={{ left: pos(p50) + '%' }} />
      </div>
      {!bare && (
        <div className="ruler__labels">
          <span className="ruler__lab ruler__lab--lo" style={{ left: pos(p25) + '%' }}><b>{usd(p25)}</b><small>{SPREAD.lo}</small></span>
          <span className="ruler__lab ruler__lab--mid" style={{ left: pos(p50) + '%' }}><b>{usd(p50)}</b><small>{SPREAD.mid}</small></span>
          <span className="ruler__lab ruler__lab--hi" style={{ left: pos(p75) + '%' }}><b>{usd(p75)}</b><small>{SPREAD.hi}</small></span>
        </div>
      )}
      {notes && (
        <ul className="ruler__notes">
          {notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      )}
    </div>
  )
}
