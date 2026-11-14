import { useMemo, useState } from 'react'
import type { Cond, Data } from '../lib/types'
import { getBench, getQuote, type Stance } from '../lib/lookup'
import { BACKOFF_LABEL, LEVEL_LABEL, basisName, pct1, rangeText, usd } from '../lib/format'
import { Conditions } from '../ui/Conditions'
import { PostingCard, ResultCard, StanceCard } from '../features/quote/cards'
import '../styles/app.css'

const DEFAULT: Cond = { soc: '15-1252', state: 'CA', exp: 'Mid-Senior level' }

// 랜딩의 납품 사례 카드에서 #/app?soc=..&state=..&exp=.. 로 넘어오면 그 조건으로 시작한다
function initialCond(data: Data): Cond {
  const p = new URLSearchParams(location.hash.split('?')[1] ?? '')
  const soc = p.get('soc'), state = p.get('state'), exp = p.get('exp')
  return {
    soc: soc && data.socs.some((s) => s.code === soc) ? soc : DEFAULT.soc,
    state: state && data.states.includes(state) ? state : DEFAULT.state,
    exp: exp && data.experiences.includes(exp) ? exp : DEFAULT.exp,
  }
}

const STEPS: [string, string][] = [
  ['조건 선택', '위 세 칸을 눌러 고르기'],
  ['범위·확신도 확인', '결과 카드 읽기'],
  ['제시 연봉 선택', '낮은 편·중간값·높은 편 중 고르기'],
  ['공고에 적기', '버튼을 누르면 오른쪽에 반영'],
]

export function QuoteApp({ data }: { data: Data }) {
  const [cond, setCond] = useState<Cond>(() => initialCond(data))
  const [stance, setStance] = useState<Stance>('mid')
  const [hires, setHires] = useState(1)
  const [applied, setApplied] = useState(false)
  const change = (p: Partial<Cond>) => { setCond({ ...cond, ...p }); setApplied(false) }
  const pickStance = (s: Stance) => { setStance(s); setApplied(false) }

  const quote = useMemo(() => getQuote(data, cond.soc, cond.state, cond.exp), [data, cond])
  const bench = useMemo(() => getBench(data, cond.soc, cond.state, cond.exp), [data, cond])
  const diff = quote && bench?.p50 ? (quote.p50 - bench.p50) / bench.p50 : null
  const k = data.kpi
  // 지금 어느 단계인지: 조건을 고른 상태(1) → 범위가 나옴(2) → 제시 연봉을 보고 있음(3) → 공고에 적음(4)
  const step = !quote ? 1 : applied ? 4 : 3

  return (
    <main className="ap">
      <header className="ap__head">
        <h1>공고 연봉 견적</h1>
        <p className="muted">직무·지역·경력을 고르면, 같은 조건으로 올라온 공고들의 연봉이 어디에 모여 있는지 보여줍니다. 금액은 연봉 기준, 단위는 달러입니다.</p>
        <p className="faint">이 화면은 직무·지역·경력만 넣는 간편 조회형 견적입니다. 직무명, 산업, 회사 규모까지 넣는 공고 초안형은 이 데모에 포함하지 않았습니다.</p>
      </header>

      <div className="search-band search-band--3" role="group" aria-label="공고 조건">
        <Conditions variant="band" data={data} value={cond} onChange={change} />
      </div>
      <p className="faint ap-tip">칸을 누르면 분류·검색 패널이 열립니다. 직무는 이름으로 검색할 수 있고(예: 개발자, 간호사), 지역은 권역으로 좁힐 수 있습니다. 고르는 즉시 결과가 바뀝니다. <b>물음표</b> 표시에 마우스를 올리면 설명이 나옵니다.</p>

      <div className="ap-flow" aria-label="진행 단계">
        <ol className="ap-flow__steps">
          {STEPS.map(([t, d], i) => (
            <li key={t} data-state={i + 1 < step ? 'done' : i + 1 === step ? 'now' : 'todo'}><span>{i + 1}</span><b>{t}</b><small>{d}</small></li>
          ))}
        </ol>
        <p className="ap-flow__next" role="status">
          {!quote ? '이 조건은 범위를 제공하지 않습니다. 경력이나 지역을 바꿔 보세요.' : applied ? '공고에 반영했습니다. 최종 연봉은 담당자가 확정하세요.' : '범위와 확신도를 확인하고, 제시 연봉을 고른 뒤 공고에 적으세요.'}
          {applied && <button type="button" className="btn btn--sm btn--ghost" onClick={() => setApplied(false)}>다른 값으로 다시</button>}
        </p>
      </div>

      <div className="ap__grid">
        <div className="ap__main">
          <ResultCard data={data} cond={cond} quote={quote} />
          {quote && <StanceCard data={data} quote={quote} stance={stance} applied={applied} hires={hires} onStance={pickStance} onApply={() => setApplied(true)} />}

          <details className="ap-more">
            <summary>근거 더 보기 (기존 방식과 비교, 정확도)</summary>
            <div className="ap-more__body">
          <section className="ap-card" aria-labelledby="e-h">
            <h2 id="e-h">기존 방식과 비교</h2>
            {quote?.basis === 'observed' ? (
              <p className="muted">같은 조건 공고가 {quote.n}건으로 충분해(30건 이상) 관측 범위를 그대로 씁니다. 이 경우 비슷한 공고 찾기(기존 방식)와 같은 값입니다.</p>
            ) : bench ? (
              <>
                <table className="ap-cmp">
                  <thead><tr><th scope="col"><span className="sr-only">항목</span></th><th scope="col">눈치페이</th><th scope="col">비슷한 공고 찾기(기존 방식)</th></tr></thead>
                  <tbody>
                    <tr><th scope="row">연봉 중간값</th><td>{quote ? usd(quote.p50) : '없음'}</td><td>{bench.p50 ? usd(bench.p50) : '없음'}</td></tr>
                    <tr><th scope="row">연봉 범위</th><td>{quote ? rangeText(quote.p25, quote.p75) : '없음'}</td><td>{bench.p25 && bench.p75 ? rangeText(bench.p25, bench.p75) : '없음'}</td></tr>
                    <tr><th scope="row">비교한 공고</th><td>{quote ? quote.n + '건' : '없음'}</td><td>{bench.n}건</td></tr>
                    <tr><th scope="row">비교 방법</th><td>{quote ? (quote.level ? (LEVEL_LABEL[quote.level] ?? quote.level) : basisName(quote)) : '없음'}</td><td>{BACKOFF_LABEL[bench.backoff] ?? bench.backoff}</td></tr>
                  </tbody>
                </table>
                {diff !== null && <p className="muted">눈치페이 중간값이 기존 방식보다 {(diff >= 0 ? '+' : '−') + Math.abs(diff * 100).toFixed(1)}%입니다.</p>}
                {bench.backoff !== 'L0_soc_state_exp' && <p className="muted">같은 직무·지역·경력 공고가 10건 미만이라 기존 방식은 비교 범위를 넓혔습니다.</p>}
              </>
            ) : <p className="muted">기존 방식으로는 비교할 공고가 없습니다.</p>}
          </section>

          <section className="ap-card" aria-labelledby="t-h">
            <h2 id="t-h">이 견적을 믿어도 될까요</h2>
            <ul className="ap-trust">
              <li><b>{pct1(data.simple.cutPct)}</b><span>이 화면(간편 조회형)은 실제 연봉과의 평균 차이가 기존 방식보다 줄었습니다</span><small>{usd(data.simple.maeCell)} → {usd(data.simple.maeModel)}</small></li>
              <li><b>{pct1(k.cutPct)}</b><span>공고 초안형은 더 크게 줄었습니다</span><small>{usd(k.maeCell)} → {usd(k.maeModel)}</small></li>
              <li><b>{pct1(k.coverage)}</b><span>공고 초안형에서 실제 연봉이 예상 범위 안에 들었습니다</span><small>가운데 절반이라 목표는 50%입니다</small></li>
            </ul>
            <p className="faint">정확도는 회사 단위로 나눈 교차검증 결과입니다. 비교 기준은 같은 직무·주·경력 공고의 중간값(기존 방식)입니다.</p>
          </section>
            </div>
          </details>
        </div>

        <aside className="ap__side" aria-label="공고 미리보기">
          <PostingCard data={data} cond={cond} quote={quote} stance={stance} applied={applied} hires={hires} onHires={setHires} />
          <section className="ap-card" aria-labelledby="l-h">
            <h2 id="l-h">연봉 공개 의무</h2>
            <p>{data.laws[cond.state] ?? '이 주의 안내는 데모에 포함하지 않았습니다. 사례 13건에 들어 있는 주만 안내합니다.'}</p>
            <p className="faint">법률 자문이 아닙니다. 시행 여부와 적용 기준은 법령 원문과 주정부 안내로 확인하세요.</p>
          </section>
        </aside>
      </div>

      <p className="foot">
        데이터: 미국 LinkedIn 공고(Kaggle, 2023·2024), 급여가 있는 정규직 연봉 공고 {data.counts.postings.toLocaleString('en-US')}건. 직무 분류 정확도 73.5%(Claude 판정 200건 표본, 사람 검수 없음).
        게시된 연봉을 정답으로 본 모의 계산이며 실제 절감액으로 검증되지 않았습니다.
      </p>
    </main>
  )
}
