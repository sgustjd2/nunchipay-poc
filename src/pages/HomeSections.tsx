import { useMemo, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Cond, Data } from '../lib/types'
import { getQuote } from '../lib/lookup'
import { CONF_LABEL, EXP_LABEL, basisCount, pct1, rangeText, stateLabel, usd } from '../lib/format'
import { FACTS } from '../content/facts'
import { socGroup, socKo } from '../content/labels'
import { ResultCard } from '../features/quote/cards'

// 랜딩은 사업 설명 한 흐름이다: 문제 → 해결 → 사업모델 → 증명 → 시범 운영.
// 도구로 가는 길은 납품 사례 카드와 상단 버튼뿐이고, 버튼은 시범 운영 안내 보기 하나를 앞세운다.

export const toolHref = (c: Cond) => `#/app?soc=${c.soc}&state=${c.state}&exp=${encodeURIComponent(c.exp)}`

/** 1. 문제: 누가, 무엇이 어렵나 */
export function Problem() {
  const bars: [string, number][] = [['직무만 맞출 때', 92.6], ['직무 + 경력', 77.1], ['직무 + 경력 + 주', 14.4]]
  return (
    <section className="hm-sec" id="problem">
      <div className="hm-in">
        <h2>채용 공고마다 연봉 범위를 써야 하는데,<br />근거가 부족합니다</h2>
        <p className="muted hm-sub">급여 범위 기재 의무가 시행 중인 14개 주와 DC 등에서, 인사팀과 HR 컨설턴트는 공고마다 지역·직무·경력별 범위를 제시해야 합니다. 세부 조건별 비교 자료가 부족해 일관되게 정하기 어렵습니다.</p>
        <div className="hm-two">
          <div className="hm-box">
            <h3>연봉은 높아도 낮아도 비용입니다</h3>
            <dl className="hm-dl">
              <div><dt>높게 잡으면</dt><dd>인건비 부담이 채용 후에도 계속 반복됩니다</dd></div>
              <div><dt>낮게 잡으면</dt><dd>지원과 오퍼 수락이 줄어 채용이 늦어질 수 있습니다</dd></div>
            </dl>
            <p className="faint">사용자는 미국 기업의 채용 담당자, 결정하는 것은 공고에 적을 제시 연봉과 범위, 시점은 공고 작성 단계입니다.</p>
          </div>
          <div className="hm-box">
            <h3>지금 쓰는 방법의 한계</h3>
            <dl className="hm-dl">
              <div><dt>유료 보상 조사</dt><dd>비용이 들고, 갱신 시차가 있습니다</dd></div>
              <div><dt>같은 조건 공고 찾기</dt><dd>조건을 맞출수록 비교할 공고가 사라집니다</dd></div>
            </dl>
            <p className="faint">같은 조건 공고가 10건 이상 있어 비교할 수 있는 비율</p>
            <ul className="bars">
              {bars.map(([label, v], i) => (
                <li key={label}>
                  <span>{label}</span>
                  <span className="bars__track"><i className={i === 2 ? 'is-key' : ''} style={{ width: v + '%' }} /></span>
                  <b>{v.toFixed(1)}%</b>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/** 2. 해결: 무엇을 납품하나 */
export function Solution({ data }: { data: Data }) {
  const sample = getQuote(data, '15-1252', 'CA', 'Mid-Senior level')
  const items = [
    { t: '참고 연봉 범위와 확신도', d: '같은 조건 공고 연봉의 가운데 절반을 범위로 보여주고, 얼마나 믿을 만한지(확신도)와 근거(관측 범위인지 모델 보완인지, 공고 수, 기준 시점)를 함께 줍니다.' },
    { t: '제시 연봉 선택', d: '인건비 절감, 균형, 채용 지연 중 회사가 더 피하고 싶은 손해에 맞춰 낮은 편, 중간값, 높은 편 중 공고에 적을 값을 고르게 합니다.' },
    { t: '견적표와 비교표', d: `직무 40개 × 지역 31곳 × 경력 5단계 견적표 ${data.counts.gridCells.toLocaleString('en-US')}칸과, 기존 방식(비슷한 공고 찾기) 비교표 ${data.counts.benchCells.toLocaleString('en-US')}칸을 납품합니다.` },
  ]
  return (
    <section className="hm-sec" id="solution">
      <div className="hm-in">
        <h2>눈치페이가 납품하는 것</h2>
        <p className="muted hm-sub">공고 작성 단계에서, 근거가 붙은 연봉 범위와 공고에 적을 제시 연봉을 줍니다.</p>
        <div className="hm-solution">
          <ol className="hm-solution__list">
            {items.map((x, i) => (
              <li key={x.t}><span className="hm-steps4__n">{i + 1}</span><span><b>{x.t}</b><span className="muted">{x.d}</span></span></li>
            ))}
          </ol>
          <div className="hm-solution__preview" aria-label="견적 한 장">
            <span className="hm-badge hm-badge--soft">견적 한 장 예시</span>
            <div className="hm-solution__card"><ResultCard data={data} cond={{ soc: '15-1252', state: 'CA', exp: 'Mid-Senior level' }} quote={sample} /></div>
          </div>
        </div>
        <div className="hm-two">
          <div className="hm-box">
            <h3>공고 초안형</h3>
            <p className="muted">공고 초안이 있을 때 씁니다. 직무명, 산업, 회사 정보까지 넣어 공고 작성 단계에서 연봉을 검토합니다. 정확도 숫자의 대부분이 이 방식 기준입니다.</p>
          </div>
          <div className="hm-box">
            <h3>간편 조회형</h3>
            <p className="muted">직무·지역·경력만으로 조회합니다. 같은 조건 공고가 충분하면 관측 범위를, 부족하면 모델로 보완하고, 근거가 없으면 제공을 보류합니다. 체험 화면은 이 방식입니다.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/** 3. 사업모델: 고객, 문제, 가치, 전달 방식, 성과 지표, 수익구조 */
export function ModelCanvas() {
  const cells: [string, string][] = [
    ['고객', '미국 기업의 채용 담당자, 인사팀과 HR 컨설턴트'],
    ['해결할 문제', '공고마다 지역·직무·경력별 연봉 범위를 일관된 근거로 제시하기 어렵다'],
    ['제공 가치', '근거와 확신도가 붙은 참고 범위, 공고에 적을 제시 연봉, 견적표와 비교표'],
    ['전달 방식', '공고 작성 단계의 견적(공고 초안형, 간편 조회형)과 견적표·비교표 납품'],
    ['성과 지표', '확정 연봉 초과액, 오퍼 수락률, 채용 소요일, 성사율을 시범 운영에서 측정'],
  ]
  return (
    <section className="hm-sec" id="model">
      <div className="hm-in">
        <h2>누구에게, 무엇을, 어떻게 제공하나</h2>
        <p className="muted hm-sub">사업모델을 한 장으로 정리했습니다. 가격은 아직 정하지 않았고, 시범 운영 결과를 보고 정합니다.</p>
        <div className="hm-canvas">
          {cells.map(([t, d]) => (
            <div key={t} className="hm-canvas__cell"><small>{t}</small><p>{d}</p></div>
          ))}
          <div className="hm-canvas__cell hm-canvas__cell--money">
            <small>수익 구조 (단계형 제안)</small>
            <ol>
              <li><b>1단계 시범 운영</b><span>6개월, 공고 초안이 있는 채용부터. 실제 비용과 채용 효과를 확인하는 단계입니다.</span></li>
              <li><b>2단계 정식 도입</b><span className="warn-text">가격은 아직 정하지 않았습니다. 시범 운영 결과를 본 뒤 협의합니다.</span></li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

/** 4. 증명: 얼마나 정확한가, 아직 증명하지 못한 것 */
export function Proof({ data }: { data: Data }) {
  const k = data.kpi
  return (
    <section className="hm-sec" id="proof">
      <div className="hm-in">
        <h2>얼마나 정확한가</h2>
        <p className="muted hm-sub">비교 대상은 같은 직무·지역·경력 공고의 중간값을 쓰는 기존 방식입니다. 같은 회사의 공고가 만들 때와 확인할 때 섞이지 않도록 나눠서 확인했습니다.</p>
        <ul className="figures">
          <li><b>{pct1(k.cutPct)}</b><span>공고 초안형: 실제 연봉과의 평균 차이가 줄었습니다</span><small>기존 방식 {usd(k.maeCell)} → 눈치페이 {usd(k.maeModel)}</small></li>
          <li><b>{pct1(data.simple.cutPct)}</b><span>간편 조회형: 직무·지역·경력만 넣어도 평균 차이가 줄었습니다</span><small>기존 방식 {usd(data.simple.maeCell)} → 눈치페이 {usd(data.simple.maeModel)}</small></li>
          <li><b>{pct1(k.coverage)}</b><span>공고 초안형: 실제 연봉이 예상 범위 안에 들었습니다</span><small>범위는 가운데 절반이라 목표는 50%입니다</small></li>
        </ul>
        <table className="rules">
          <caption>견적마다 확신도를 붙이고, 확신도에 따라 검토 수준을 정합니다</caption>
          <thead><tr><th scope="col">확신도</th><th scope="col">실제 연봉과의 평균 차이</th><th scope="col">쓰는 방법</th></tr></thead>
          <tbody>
            <tr><th scope="row">높음</th><td>약 {usd(FACTS.confidenceMae.high)}</td><td>출발점으로 써도 됩니다</td></tr>
            <tr><th scope="row">보통</th><td>그 중간</td><td>참고 범위와 함께 검토합니다</td></tr>
            <tr><th scope="row">낮음</th><td>약 {usd(FACTS.confidenceMae.low)}</td><td className="warn-text">담당자가 꼭 검토합니다</td></tr>
          </tbody>
        </table>
        <div className="hm-box hm-box--warn">
          <h3>아직 증명하지 못한 것</h3>
          <ul className="hm-list">
            <li>실제 비용 절감: 게시된 연봉을 정답으로 본 모의 계산이며, 시범 운영에서 확정 연봉으로 측정합니다</li>
            <li>최신 시세: 2023~2024년 공고입니다. 처음 보는 회사 {FACTS.timeValidation.newCompanyPostings.toLocaleString('en-US')}건에서 평균 차이가 {FACTS.timeValidation.cutPct}% 줄었고, 과거 자료로 이듬해를 맞춰 봤을 때 범위 안에 든 비율은 {pct1(k.btCoverage)}였습니다</li>
            <li>대표성: 급여를 공개한 공고만 분석했습니다</li>
            <li>직무 분류: 자동 매칭 정확도 {FACTS.socAccuracy}%(Claude 판정 200건 표본, 사람 검수 없음)</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

/** 5. 시범 운영: 무엇을, 얼마 동안, 어떻게 판단하나 */
export function Pilot() {
  const p = FACTS.pilot
  const phases = [['1~2개월', '최신 자료 보강, 직무 검수, 실험 설계'], ['3~5개월', '운영하며 기록'], ['6개월', '비교하고 판정']]
  return (
    <section className="hm-sec" id="pilot">
      <div className="hm-in">
        <h2>{p.months}개월 시범 운영으로 확인합니다</h2>
        <p className="muted hm-sub">공고 초안형 견적과 기존 방식을 직무·주 단위로 무작위 배정해 비교합니다. 채용 완료 약 {p.hires.toLocaleString('en-US')}건(군당 약 {p.perArm.toLocaleString('en-US')}건)이 필요합니다.</p>
        <ol className="timeline" aria-label="시범 운영 일정">
          {phases.map(([when, what], i) => (
            <li key={when} style={{ flexGrow: p.phases[i], flexBasis: 0 }}>
              <i />
              <b>{when}</b>
              <span className="muted">{what}</span>
            </li>
          ))}
        </ol>
        <div className="hm-two">
          <div className="hm-box">
            <h3>확대 여부는 세 가지로 판단합니다</h3>
            <ol className="hm-list hm-list--num">
              <li>실제 비용이 개선되는가</li>
              <li>채용 성과가 유지되는가</li>
              <li>도입 비용 대비 효과가 있는가</li>
            </ol>
          </div>
          <div className="hm-box">
            <h3>요청드리는 결정</h3>
            <p className="muted">공고 초안이 있는 채용부터 시범 운영을 시작합니다. 참여 부서와 기업, 검증 예산과 책임자를 정해 주시면 됩니다. 전사 확대와 자동 결정은 시범 운영 결과를 본 뒤에 판단합니다.</p>
            <div className="hm-cta"><a className="btn" href="#/pitch">시범 운영 안내 보기</a></div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** 납품 사례 13건(발표자료 13쪽, 가상 고객). 카드를 누르면 그 조건으로 견적 체험 화면이 열린다. */
export function CaseRail({ data }: { data: Data }) {
  const rail = useRef<HTMLDivElement>(null)
  const items = useMemo(() => Object.keys(data.rec).map((key) => {
    const [soc, state, exp] = key.split('|')
    return { key, soc, state, exp, q: getQuote(data, soc, state, exp) }
  }), [data])
  const go = (dir: number) => rail.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  return (
    <section className="hm-block" id="cases">
      <div className="hm-panel">
        <div className="hm-panel__head">
          <h2>납품 사례 <em>{items.length}건</em></h2>
          <p className="muted">가상 고객이 요청한 직무·지역·경력에 납품한 견적입니다(모의). 카드를 누르면 그 조건으로 체험 화면이 열립니다.</p>
          <div className="hm-arrows">
            <button type="button" aria-label="이전 사례" onClick={() => go(-1)}><ChevronLeft size={20} strokeWidth={1.5} /></button>
            <button type="button" aria-label="다음 사례" onClick={() => go(1)}><ChevronRight size={20} strokeWidth={1.5} /></button>
          </div>
        </div>
        <div className="hm-rail" ref={rail}>
          {items.map(({ key, soc, state, exp, q }) => (
            <a key={key} className="hm-card" href={toolHref({ soc, state, exp })}>
              <span className="hm-card__top">
                <span className={'hm-badge' + (!q ? ' hm-badge--warn' : q.basis === 'model' ? ' hm-badge--soft' : '')}>{!q ? '제공 보류' : q.basis === 'observed' ? '관측 범위' : '모델 보완'}</span>
                <span className="faint">{stateLabel(state)} · {EXP_LABEL[exp]}</span>
              </span>
              <span className="hm-card__title">{socKo(soc)}</span>
              <span className="hm-tags"><i>{socGroup(soc)}</i>{q ? <i>{CONF_LABEL[q.conf]}</i> : <i>근거 부족</i>}</span>
              <span className="hm-card__range">{q ? rangeText(q.p25, q.p75) : '범위를 제공하지 않습니다'}</span>
              <span className="hm-card__meta">{q ? `${basisCount(q)} ${q.n}건 · 중간값 ${usd(q.p50)}` : '해당 경력 공고 20건 미만'}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
