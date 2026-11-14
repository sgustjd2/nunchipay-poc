import type { ReactNode } from 'react'
import type { Data } from '../lib/types'
import { FACTS } from '../content/facts'
import '../styles/business.css'

// 발표용 한 쪽: 시범 운영 제안과 의사결정 요청. 고객용 랜딩(Home)과 분리했다.
function Section({ id, title, lede, children }: { id: string; title: string; lede?: string; children: ReactNode }) {
  return (
    <section className="sec" id={id}>
      <div className="sec__in">
        <header className="sec__head">
          <h2>{title}</h2>
          {lede && <p className="muted">{lede}</p>}
        </header>
        <div className="sec__body">{children}</div>
      </div>
    </section>
  )
}

export function Pitch({ data }: { data: Data }) {
  const f = FACTS
  return (
    <main className="biz">
      <section className="sec">
        <div className="sec__in">
          <header className="sec__head">
            <h1 style={{ fontSize: 28 }}>사업 제안: 공고 초안형 견적 시범 도입</h1>
            <p className="muted">발표용 요약입니다. 고객에게 보이는 소개는 첫 화면에 있습니다.</p>
          </header>
          <div className="sec__body">
            <dl className="spec">
              <div><dt>고객</dt><dd>미국 기업의 채용 담당자</dd></div>
              <div><dt>결정</dt><dd>공고에 적을 제시 연봉과 범위</dd></div>
              <div>
                <dt>납품물</dt>
                <dd>직무 40개 × 지역 31곳 × 경력 5단계 견적표 {data.counts.gridCells.toLocaleString('en-US')}칸, 기존 방식(비슷한 공고 찾기) 비교표 {data.counts.benchCells.toLocaleString('en-US')}칸</dd>
              </div>
              <div><dt>견적 방식</dt><dd>공고 초안형(직무명, 산업, 회사 정보까지 입력, 성능 수치의 기준), 간편 조회형(직무·지역·경력만 입력)</dd></div>
              <div><dt>검증 지표</dt><dd>확정 연봉 초과액, 오퍼 수락률, 채용 소요일, 성사율</dd></div>
              <div><dt>가격</dt><dd className="warn-text">미정, 시범 운영 결과 이후 결정</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <Section id="problem" title="연봉은 높아도 낮아도 비용이 됩니다" lede="결정하는 사람은 미국 기업의 채용 담당자이고, 결정하는 시점은 공고를 쓰는 단계입니다.">
        <div className="two">
          <div><h3>높게 잡으면</h3><p className="muted">인건비 부담이 채용 후에도 계속 반복됩니다.</p></div>
          <div><h3>낮게 잡으면</h3><p className="muted">지원과 오퍼 수락이 줄어 채용이 늦어질 수 있습니다.</p></div>
        </div>
        <div className="lack">
          <h3>비슷한 공고 찾기는 조건을 맞출수록 근거가 사라집니다</h3>
          <p className="muted">같은 조건의 공고가 10건 이상 있어 비교할 수 있는 비율입니다.</p>
          <ul className="bars">
            {[['직무만 맞출 때', 92.6], ['직무 + 경력', 77.1], ['직무 + 경력 + 주', 14.4]].map(([label, v], i) => (
              <li key={label as string}>
                <span>{label}</span>
                <span className="bars__track"><i className={i === 2 ? 'is-key' : ''} style={{ width: v + '%' }} /></span>
                <b>{(v as number).toFixed(1)}%</b>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="effect" title="사업 효과는 아직 모의 값입니다" lede="게시된 연봉을 시장 기준으로 가정하고, 실제 연봉과의 차이를 높게 잡은 쪽과 낮게 잡은 쪽으로 나눈 계산입니다. 실제 비용과 채용 효과는 시범 운영에서 측정합니다.">
        <ul className="figures figures--two">
          <li><b>{f.overCutPct}%</b><span>높게 잡아 생긴 손해 감소</span><small>인건비 부담 쪽</small></li>
          <li><b>{f.underCutPct}%</b><span>낮게 잡아 생긴 손해 감소</span><small>채용 지연 쪽</small></li>
        </ul>
        <div className="lack">
          <h3>모의 기업 사례: AT&T</h3>
          <p className="muted">학습에 없던 AT&T의 2024년 4월 공고 {f.attCase.postings}건에 두 견적(기존 방식, 눈치페이)을 적용하고, 연간 정규직 채용 {f.attCase.hires.toLocaleString('en-US')}명을 가정한 계산입니다. 전체 평균과 가장 비슷한 회사를 골랐습니다.</p>
          <ul className="figures figures--two">
            <li><b>연 {Math.round(f.attCase.savingUsd / 10000)}만 달러</b><span>인건비 과다 감소</span><small>기존 방식 대비 −{f.attCase.cutPct}%, 전체 평균 기준이면 연 {Math.round(f.attCase.avgSavingUsd / 10000)}만 달러</small></li>
            <li><b>{f.attCase.delayCutPct}%</b><span>채용 지연 위험 감소</span><small>모의 계산, 채용 규모가 클수록 절감액이 커집니다</small></li>
          </ul>
        </div>
      </Section>

      <Section id="pilot" title={`${f.pilot.months}개월 시범 운영으로 확인합니다`} lede={`공고 초안형과 기존 방식을 직무·주 단위로 무작위 배정해 비교합니다. 채용 완료 약 ${f.pilot.hires.toLocaleString('en-US')}건, 군당 약 ${f.pilot.perArm.toLocaleString('en-US')}건이 필요합니다.`}>
        <ol className="timeline" aria-label="시범 운영 일정">
          {[['1~2개월', '최신 자료 보강, 직무 검수, 실험 설계'], ['3~5개월', '운영하며 기록'], ['6개월', '비교하고 판정']].map(([when, what], i) => (
            <li key={when} style={{ flexGrow: f.pilot.phases[i], flexBasis: 0 }}>
              <i />
              <b>{when}</b>
              <span className="muted">{what}</span>
            </li>
          ))}
        </ol>
      </Section>

      <section className="close" id="decision">
        <div className="close__in">
          <h2>공고 초안이 있는 채용부터 시범 운영을 시작합니다</h2>
          <p>참여 부서와 기업, 검증 예산과 책임자를 정해 주시면 됩니다. 전사 확대와 자동 결정은 시범 운영 결과를 본 뒤에 판단합니다.</p>
          <ol className="criteria">
            <li>실제 비용이 개선되는가</li>
            <li>채용 성과가 유지되는가</li>
            <li>도입 비용 대비 효과가 있는가</li>
          </ol>
          <a className="btn" href="#/app">견적 직접 써보기</a>
        </div>
      </section>
    </main>
  )
}
