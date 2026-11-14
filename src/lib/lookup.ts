import type { Bench, Conf, Data, Quote } from './types'

export const cellKey = (soc: string, state: string, exp: string) => `${soc}|${state}|${exp}`

/** 같은 조건 공고가 이 건수 이상이면 관측 범위를 그대로 쓴다(발표자료 13쪽: 79건은 관측, 19건은 모델로 보완) */
export const OBSERVED_MIN = 30

// 상대 폭 (P75-P25)/P50의 3분위 경계 (README: 0.349, 0.476). 폭이 좁을수록 확신도가 높다.
export function confidence(p25: number, p50: number, p75: number): Conf {
  const w = (p75 - p25) / p50
  return w <= 0.349 ? 'high' : w <= 0.476 ? 'medium' : 'low'
}

const round100 = (v: number) => Math.round(v / 100) * 100

function make(d: Data, p25: number, p50: number, p75: number, basis: Quote['basis'], n: number, level: string | null, nowGiven?: [number | null, number | null, number | null]): Quote {
  const f = d.eci.factor
  const [a, b, c] = nowGiven ?? [null, null, null]
  return { p25, p50, p75, basis, n, level, conf: confidence(p25, p50, p75), now: { p25: a ?? round100(p25 * f), p50: b ?? round100(p50 * f), p75: c ?? round100(p75 * f) } }
}

/**
 * 간편 조회형 견적. 우선순위:
 * 1) 납품 사례 13건(발표자료 13쪽)은 납품된 값을 그대로 쓴다
 * 2) 같은 직무·주·경력 공고가 30건 이상이면 관측 범위
 * 3) 아니면 모델 견적 격자(표본 부족이면 null = 제공 보류)
 */
export function getQuote(d: Data, soc: string, state: string, exp: string): Quote | null {
  const key = cellKey(soc, state, exp)
  const rec = d.rec[key]
  if (rec) {
    if (rec.basis === 'none' || rec.lo == null || rec.p50 == null || rec.hi == null) return null
    return make(d, rec.lo, rec.p50, rec.hi, rec.basis === 'cell' ? 'observed' : 'model', (rec.basis === 'cell' ? rec.cellN : rec.modelRows) ?? 0, rec.level, [rec.loNow, rec.p50Now, rec.hiNow])
  }
  const b = d.bench[key]
  if (b && b[4] === 'L0_soc_state_exp' && b[3] >= OBSERVED_MIN && b[0] != null && b[1] != null && b[2] != null) {
    return make(d, b[0], b[1], b[2], 'observed', b[3], null)
  }
  const g = d.grid[key]
  if (!g) return null
  return make(d, g[0], g[1], g[2], 'model', g[3], g[4])
}

/** 견적을 만들지 않을 때 보여줄 이유 */
export function holdReason(d: Data, soc: string, state: string, exp: string): string {
  const rec = d.rec[cellKey(soc, state, exp)]
  if (rec?.basis === 'none') return rec.note
  return '직무, 인접 경력, 대분류까지 넓혀도 해당 경력 공고가 20건 미만이라 범위를 제공하지 않습니다. 이 경우에는 별도 서베이 자료가 필요합니다.'
}

export function getBench(d: Data, soc: string, state: string, exp: string): Bench | null {
  const r = d.bench[cellKey(soc, state, exp)]
  if (!r) return null
  const [p25, p50, p75, n, backoff, regionLevel, regionValue] = r
  return { p25, p50, p75, n, backoff, regionLevel, regionValue }
}

/** 제시 연봉: 채용 지연 손해가 인건비 손해의 몇 배인지(k)에 따라 범위의 하단·중앙·상단을 고른다(발표자료 12쪽) */
export type Stance = 'low' | 'mid' | 'high'
export const K_LOW = 0.55
export const K_HIGH = 1.67
export const stanceOf = (k: number): Stance => (k < K_LOW ? 'low' : k > K_HIGH ? 'high' : 'mid')
export const offerOf = (q: Quote, s: Stance) => (s === 'low' ? q.p25 : s === 'high' ? q.p75 : q.p50)
