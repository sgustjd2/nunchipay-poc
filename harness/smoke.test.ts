import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { confidence, getBench, getQuote, holdReason, offerOf, stanceOf } from '../src/lib/lookup'
import type { Data } from '../src/lib/types'

const data: Data = JSON.parse(readFileSync('public/data/data.json', 'utf8'))

// 발표자료 13쪽(간편 조회형) 사례 3건과 같은 값이 나와야 한다
describe('간편 조회형 견적: 발표자료 13쪽', () => {
  it('캘리포니아 개발자(중급·시니어): 같은 조건 공고 79건, 관측 범위 $142,000~$202,100', () => {
    expect(getQuote(data, '15-1252', 'CA', 'Mid-Senior level')).toMatchObject({ p25: 142000, p50: 175500, p75: 202100, basis: 'observed', n: 79 })
  })
  it('뉴욕 회계사(중급·시니어): 19건뿐이라 모델로 보완, $82,800~$111,500', () => {
    expect(getQuote(data, '13-2011', 'NY', 'Mid-Senior level')).toMatchObject({ p25: 82800, p75: 111500, basis: 'model', n: 293 })
  })
  it('뉴저지 화학자(디렉터): 근거 부족, 제공 보류', () => {
    expect(getQuote(data, '19-2031', 'NJ', 'Director')).toBeNull()
    expect(holdReason(data, '19-2031', 'NJ', 'Director')).toContain('표본 부족')
  })
})

describe('견적 조회 규칙', () => {
  it('납품 사례의 현재 기준 환산값은 납품된 값을 쓴다', () => {
    expect(getQuote(data, '15-1252', 'CA', 'Mid-Senior level')?.now).toMatchObject({ p25: 153200, p50: 189200, p75: 217900 })
  })
  it('사례가 아니고 관측이 30건 미만이면 모델 격자를 쓰고, 환산값은 ECI 계수로 계산한다', () => {
    const q = getQuote(data, '15-1252', 'CA', 'Entry level')
    expect(q?.basis).toBe('model')
    expect(q?.now.p50).toBe(Math.round((q!.p50 * data.eci.factor) / 100) * 100)
  })
  it('격자에서 표본 부족인 칸은 null을 돌려준다', () => {
    expect(getQuote(data, '15-1252', 'CA', 'Executive')).toBeNull()
  })
  it('확신도 경계는 README의 0.349 / 0.476', () => {
    expect(confidence(100, 200, 169)).toBe('high')
    expect(confidence(100, 200, 171)).toBe('medium')
    expect(confidence(100, 200, 195)).toBe('medium')
    expect(confidence(100, 200, 200)).toBe('low')
  })
  it('기준선 벤치마크는 연봉 행만 쓴다', () => {
    expect(getBench(data, '11-1011', 'AL', 'Executive')).toMatchObject({ p50: 205000, n: 63, backoff: 'L2_soc_exp' })
    expect(Object.values(data.bench).every((b) => (b[1] ?? 0) > 1000)).toBe(true) // 시급(30.06)이 섞이지 않음
  })
})

// 발표자료 12쪽: 채용 지연 손해 ÷ 인건비 과다 손해 = k
describe('제시 연봉 선택', () => {
  it('k < 0.55 하단, 0.55~1.67 중앙값, k > 1.67 상단', () => {
    expect(stanceOf(0.5)).toBe('low')
    expect(stanceOf(1)).toBe('mid')
    expect(stanceOf(2)).toBe('high')
  })
  it('같은 범위에서 하단·중앙·상단 값을 고른다', () => {
    const q = getQuote(data, '15-1252', 'CA', 'Mid-Senior level')!
    expect([offerOf(q, 'low'), offerOf(q, 'mid'), offerOf(q, 'high')]).toEqual([142000, 175500, 202100])
  })
})

describe('KPI (README 검증값, 공고 초안형 기준)', () => {
  const k = data.kpi
  it('오차 감소율 19.3%, MAE $25,297 / $31,357', () => {
    expect(Math.round(k.cutPct * 1000) / 10).toBe(19.3)
    expect(Math.round(k.maeModel)).toBe(25297)
    expect(Math.round(k.maeCell)).toBe(31357)
  })
  it('포함률 50.0%, 시간 검증 52.5%', () => {
    expect(Math.round(k.coverage * 1000) / 10).toBe(50)
    expect(Math.round(k.btCoverage * 1000) / 10).toBe(52.5)
  })
  it('간편 조회형은 셀 조회 대비 오차가 5.3% 낮다(공고 초안형 19.3%와 다르다)', () => {
    expect(Math.round(data.simple.cutPct * 1000) / 10).toBe(5.3)
    expect(data.simple.n).toBe(8323)
  })
})
