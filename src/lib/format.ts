import type { Conf, Quote } from './types'
import { stateKo } from '../content/labels'

export const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US')
export const pct1 = (x: number) => (x * 100).toFixed(1) + '%'

export const EXP_LABEL: Record<string, string> = {
  'Entry level': '신입·초급', Associate: '주니어', 'Mid-Senior level': '중급·시니어',
  Director: '디렉터', Executive: '임원',
}
export const stateLabel = stateKo

export const CONF_LABEL: Record<Conf, string> = { high: '확신도 높음', medium: '확신도 보통', low: '확신도 낮음' }

// 범위의 세 지점을 부르는 말. 통계 용어(P25, P50, P75) 대신 쓴다
export const SPREAD = { lo: '낮은 편', mid: '중간', hi: '높은 편' } as const

// 견적 격자의 근거 수준 (데이터 원문: 직무 x 경력 / 직무 x 인접 경력)
export const LEVEL_LABEL: Record<string, string> = {
  '직무 x 경력': '같은 직무·경력 공고로 계산',
  '직무 x 인접 경력': '비슷한 경력 공고까지 넓혀 계산',
  '표본 부족': '근거 공고 부족',
}

// 기존 방식(비슷한 공고 찾기)이 조건을 얼마나 넓혔는지
export const BACKOFF_LABEL: Record<string, string> = {
  L0_soc_state_exp: '같은 직무·지역·경력 공고',
  L1_soc_division_exp: '같은 권역으로 넓혀 비교',
  L2_soc_exp: '미국 전체로 넓혀 비교',
  L3_soc: '같은 직무 전체로 넓혀 비교',
  L4_soc_major: '비슷한 직무군으로 넓혀 비교',
  unresolved: '비교할 공고 없음',
}

// 견적의 근거 방식. 같은 조건 공고가 충분하면 관측 범위, 부족하면 모델로 보완한다(발표자료 13쪽)
export const basisName = (q: Quote) => (q.basis === 'observed' ? '관측 범위 사용' : '모델로 보완')
export const basisCount = (q: Quote) => (q.basis === 'observed' ? '같은 조건 공고' : '대표 공고')
export const rangeText = (lo: number, hi: number) => usd(lo) + ' – ' + usd(hi)
export const SOURCE_PERIOD = '2024년 3~4월 게시 공고'
