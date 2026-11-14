import { FileSearch } from 'lucide-react'
import type { Data } from '../lib/types'
import { FACTS } from '../content/facts'
import { QuoteDemo } from '../demo/QuoteDemo'
import { CaseRail, ModelCanvas, Pilot, Problem, Proof, Solution } from './HomeSections'
import '../styles/business.css'
import '../styles/home.css'

const FAQ: [string, string][] = [
  ['견적이 정답 연봉인가요?', '아닙니다. 같은 조건 공고 연봉의 가운데 절반이 모여 있는 참고 범위입니다. 오퍼 수락을 보장하는 숫자가 아니고, 최종 연봉은 회사의 내부 기준으로 정합니다.'],
  ['비교할 공고가 부족하면 어떻게 되나요?', '같은 조건 공고가 30건 이상이면 관측 범위를 그대로 쓰고, 부족하면 모델로 보완합니다. 그래도 근거가 없으면 숫자를 만들지 않고 제공을 보류합니다. 어떻게 계산했는지는 견적에 함께 표시됩니다.'],
  ['어떤 데이터로 만들었나요?', `미국 LinkedIn 공고(Kaggle, 2023·2024년 수집) 중 급여가 적힌 정규직 연봉 공고 ${FACTS.funnel.used.toLocaleString('en-US')}건을 썼습니다.`],
  ['최신 시세인가요?', '아닙니다. 2023~2024년 공고라 최근 자료로 다시 확인해야 합니다. 2023년 금액은 그 사이 임금 상승분을 반영해 2024년 기준으로 환산했고, 현재 기준 환산값은 참고용으로 따로 표시합니다.'],
  ['연봉 공개 의무도 알려주나요?', '사례 13건에 들어 있는 주에 한해 시행일과 적용 기업 규모를 안내합니다. 법률 자문이 아니므로 법령 원문과 주정부 안내로 확인해야 합니다.'],
]

export function Home({ data }: { data: Data }) {
  return (
    <main className="hm">
      <section className="hm-hero" id="top">
        <div className="hm-hero__box">
          <div className="hm-hero__copy">
            <span className="hm-pill">미국 채용 담당자를 위한 연봉 범위 견적</span>
            <h1><b>공고에 적을 연봉</b>, <span>얼마가 적당한지</span><br /><b>근거와 함께</b> <span>확인하세요</span></h1>
            <p className="hm-lede">직무·지역·경력별로 같은 조건 공고의 연봉 범위와 얼마나 믿을 만한지를 알려주고, 공고에 적을 제시 연봉까지 정하도록 돕습니다.</p>
            <div className="hm-cta">
              <a className="btn" href="#/pitch">시범 운영 안내 보기</a>
              <a className="btn btn--ghost" href="#/app">견적 체험하기</a>
            </div>
          </div>
          <div className="hm-hero__stage" aria-label="견적 도구가 움직이는 모습">
            <QuoteDemo data={data} />
          </div>
        </div>
        <div className="hm-float">
          <span>공고를 쓰는 순간의 모습입니다. 직접 해볼 수 있어요</span>
          <a className="btn btn--sm btn--ghost" href="#/app">견적 체험하기</a>
        </div>
      </section>

      <Problem />
      <Solution data={data} />
      <ModelCanvas />
      <Proof data={data} />
      <CaseRail data={data} />
      <Pilot />

      <section className="hm-sec" id="faq">
        <div className="hm-in">
          <h2>자주 묻는 질문</h2>
          <dl className="hm-faq">
            {FAQ.map(([q, a]) => (
              <div key={q}><dt>{q}</dt><dd className="muted">{a}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section className="hm-final">
        <div className="hm-final__box">
          <h2>공고 초안이 있는 채용부터<br />시범 운영을 시작합니다</h2>
          <a className="btn" href="#/pitch">시범 운영 안내 보기</a>
        </div>
      </section>

      <footer className="hm-foot">
        <div className="hm-in hm-foot__in">
          <div>
            <b>눈치페이</b>
            <p>미국 채용 공고의 연봉 범위와 확신도를 알려주는 연봉 견적 PoC</p>
            <p><FileSearch size={14} strokeWidth={1.5} aria-hidden /> AI빅데이터프로젝트세미나 프로젝트 02, 퇴근랩스 팀</p>
          </div>
          <div>
            <b>바로가기</b>
            <p><a href="#/app">견적 체험</a></p>
            <p><a href="#/pitch">시범 운영 안내</a></p>
            <p><a href="#faq">자주 묻는 질문</a></p>
          </div>
          <div>
            <b>안내</b>
            <p>게시된 연봉을 정답으로 본 모의 계산이며 실제 절감액으로 검증되지 않았습니다.</p>
            <p>서비스 이름은 가칭이며 상표 조사를 하지 않았습니다.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
