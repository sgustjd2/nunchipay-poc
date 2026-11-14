import type { Cond, Data, Quote } from '../../lib/types'
import { K_HIGH, K_LOW, holdReason, offerOf, type Stance } from '../../lib/lookup'
import { CONF_LABEL, EXP_LABEL, LEVEL_LABEL, SOURCE_PERIOD, basisCount, basisName, rangeText, stateLabel, usd } from '../../lib/format'
import { socKo } from '../../content/labels'
import { Ruler } from '../../ui/Ruler'
import { Hint } from '../../ui/Hint'

// 견적 도구(#/app)와 홈의 데모 장면·리포트 미리보기가 같은 카드를 쓴다. 한 곳을 고치면 모두 바뀐다.

/** 참고 연봉 범위 카드 */
export function ResultCard({ data, cond, quote }: { data: Data; cond: Cond; quote: Quote | null }) {
  return (
    <section className="ap-card ap-result" aria-labelledby="q-h" aria-live="polite">
      {quote ? (
        <>
          <div className="ap-card__top">
            <h2 id="q-h">참고 연봉 범위<Hint text="같은 조건으로 올라온 공고들의 연봉 중, 가운데 절반이 모여 있는 구간입니다. 가장 낮은 값과 가장 높은 값이 아니고, 오퍼 수락을 보장하는 범위도 아닙니다." /></h2>
            <span className="ap-conf"><span className={'tag' + (quote.conf === 'low' ? ' tag--warn' : '')}>{CONF_LABEL[quote.conf]}</span><Hint align="right" text="범위가 좁을수록 확신도가 높습니다. 높음: 견적을 출발점으로 써도 됩니다. 보통: 참고 범위와 함께 검토하세요. 낮음: 담당자가 꼭 검토해야 합니다." /></span>
          </div>
          <p className="ap-range">{rangeText(quote.p25, quote.p75)}</p>
          <p className="muted ap-note">같은 조건 공고 연봉의 가운데 절반이 이 안에 있습니다. 중간값은 {usd(quote.p50)}입니다.</p>
          <Ruler p25={quote.p25} p50={quote.p50} p75={quote.p75} />
          <dl className="ap-basis">
            <div><dt>근거 방식<Hint text="관측 범위 사용: 같은 직무·주·경력 공고가 30건 이상이라 그대로 썼습니다. 모델로 보완: 공고가 부족해 비슷한 조건의 공고를 학습한 모델로 보완했습니다." /></dt><dd>{basisName(quote)}</dd></div>
            <div><dt>{basisCount(quote)}</dt><dd>{quote.n}건</dd></div>
            <div><dt>기준 시점</dt><dd>{SOURCE_PERIOD}</dd></div>
            <div><dt>현재 기준 환산<Hint text="공고가 올라온 2024년 3~4월 이후의 임금 상승(ECI)을 반영한 참고값입니다. 범위 자체를 바꾸는 값은 아닙니다." /></dt><dd title={`임금 상승(ECI ${data.eci.base}→${data.eci.latest}, ×${data.eci.factor.toFixed(3)})을 반영한 참고값`}>{rangeText(quote.now.p25, quote.now.p75)}</dd></div>
          </dl>
          {quote.level && quote.basis === 'model' && <p className="faint ap-note">{LEVEL_LABEL[quote.level] ?? quote.level}</p>}
          {quote.conf === 'low' && <p className="note note--warn ap-note">확신도가 낮은 견적입니다. 담당자가 한 번 더 검토한 뒤 공고에 적으세요.</p>}
        </>
      ) : (
        <>
          <h2 id="q-h">참고 연봉 범위</h2>
          <p className="ap-none">범위 제공을 보류합니다</p>
          <p className="muted">{holdReason(data, cond.soc, cond.state, cond.exp)}</p>
          <p className="faint ap-note">확인할 수 없는 숫자를 만들지 않는 것이 의도입니다. 경력이나 지역을 바꿔 보세요.</p>
        </>
      )}
    </section>
  )
}

// 회사가 더 피하고 싶은 손해에 따라 공고에 적을 제시 연봉을 고른다(발표자료 12쪽)
export const STANCES: { id: Stance; title: string; sub: string; where: string }[] = [
  { id: 'low', title: '인건비 절감이 더 중요', sub: '채용 지연 손해가 인건비 손해의 0.55배 미만', where: '낮은 편' },
  { id: 'mid', title: '비용과 채용 속도를 비슷하게', sub: '0.55~1.67배', where: '중간값' },
  { id: 'high', title: '채용 지연 손해가 더 큼', sub: '1.67배 초과', where: '높은 편' },
]

/** 공고에 적을 제시 연봉 선택 카드 */
export function StanceCard({ data, quote, stance, applied, hires = 1, onStance, onApply, targets }: {
  data: Data; quote: Quote; stance: Stance; applied: boolean; hires?: number
  onStance: (s: Stance) => void; onApply: () => void; targets?: boolean
}) {
  return (
    <section className="ap-card ap-stance-card" aria-labelledby="o-h">
      <h2 id="o-h">공고에 적을 제시 연봉<Hint text="범위 안에서 공고에 실제로 적을 금액을 고르는 단계입니다. 인건비 부담과 채용 지연 위험 중 더 피하고 싶은 쪽에 맞춰 하나를 선택하세요." /></h2>
      <p className="muted ap-note">범위 안에서 어느 값을 적을지는 회사가 더 피하고 싶은 손해에 따라 정합니다. 제시 연봉을 높이면 인건비 부담은 늘고 채용 지연 위험은 줄어듭니다.</p>
      <div className="ap-stance" role="radiogroup" aria-label="더 피하고 싶은 손해">
        {STANCES.map((s) => (
          <button key={s.id} type="button" role="radio" aria-checked={stance === s.id} onClick={() => onStance(s.id)}
            data-target={targets ? `stance-${s.id}` : undefined} data-cursor={targets ? 'pointer' : undefined}>
            <span className="ap-stance__t">{s.title}</span>
            <b>{usd(offerOf(quote, s.id))}</b>
            <small>{s.where} · {s.sub}</small>
            {hires > 1 && <small className="ap-stance__sum">{hires}명 채용 시 연 {usd(offerOf(quote, s.id) * hires)}</small>}
          </button>
        ))}
      </div>
      <p className="faint ap-note">채용 지연 손해 ÷ 인건비 과다 손해가 {K_LOW}배 미만이면 낮은 편, {K_LOW}~{K_HIGH}배면 중간값, {K_HIGH}배를 넘으면 높은 편이 예상 손해가 가장 작았습니다(2024년 공고 {data.counts.postings.toLocaleString('en-US')}건 평균). 몇 배로 볼지는 담당자가 직무별로 미리 정합니다.</p>
      <div>
        <button className="btn" onClick={onApply} disabled={applied} data-target={targets ? 'apply' : undefined} data-cursor={targets ? 'pointer' : undefined}>
          {applied ? '공고에 적용됨' : '제시 연봉과 범위를 공고에 적기'}
        </button>
      </div>
    </section>
  )
}

/** 공고 미리보기 카드 */
export function PostingCard({ data, cond, quote, stance, applied, hires, onHires }: {
  data: Data; cond: Cond; quote: Quote | null; stance: Stance; applied: boolean; hires: number; onHires?: (n: number) => void
}) {
  const title = socKo(cond.soc, data.socs.find((s) => s.code === cond.soc)?.title)
  const offer = quote ? offerOf(quote, stance) : null
  return (
    <section className="ap-card ap-posting" aria-labelledby="p-h">
      <div className="ap-card__top">
        <h2 id="p-h">공고 미리보기</h2>
        <span className="faint">작성 중</span>
      </div>
      <div className="ap-posting__body">
        <h3>{title}</h3>
        <p className="muted">{EXP_LABEL[cond.exp]} · {stateLabel(cond.state)}</p>
        <div className={'ap-posting__pay' + (applied && quote ? ' is-set' : '')}>
          <span className="faint">연봉</span>
          {applied && quote && offer !== null ? (
            <>
              <b>제시 {usd(offer)} / 년</b>
              <small>참고 범위 {rangeText(quote.p25, quote.p75)}</small>
              <small>눈치페이 견적 기반, 채용담당자 확정 전</small>
            </>
          ) : <b>범위 미기재</b>}
        </div>
      </div>
      <label className="ap-hires">
        <span>채용 인원<Hint align="right" text="견적(범위)에는 영향이 없습니다. 2명 이상 입력하면 위 제시 연봉 카드에 연 인건비 합계가 함께 표시되어, 높은 편과 낮은 편의 비용 차이를 비교할 수 있습니다." /></span>
        <input type="number" min={1} value={hires} readOnly={!onHires} onChange={(e) => onHires?.(Math.max(1, Number(e.target.value) || 1))} />
        <span>명</span>
      </label>
    </section>
  )
}
