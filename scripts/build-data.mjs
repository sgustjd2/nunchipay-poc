import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseCsv } from './csv.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..', '..') // 퇴근랩스/
const read = (p) => parseCsv(readFileSync(resolve(root, p), 'utf8'))
const num = (s) => (s === '' || s == null ? null : Number(s))

const EXPERIENCES = ['Entry level', 'Associate', 'Mid-Senior level', 'Director', 'Executive']

// 1) 모델 견적 격자: 빈 p25 = 표본 부족 = null
const grid = {}
const socMap = new Map()
const stateSet = new Set()
for (const r of read('delivery/quote_grid_model.csv')) {
  socMap.set(r.soc_code, r.soc_title)
  stateSet.add(r.state)
  grid[`${r.soc_code}|${r.state}|${r.experience}`] =
    r.p25 === '' ? null : [num(r.p25), num(r.p50), num(r.p75), num(r.rows), r.level]
}

// 2) 기준선(셀 조회) 벤치마크. 시급 행이 같은 키의 연봉 행을 덮어쓰지 않게 연봉만 쓴다
const bench = {}
for (const r of read('delivery/cell_benchmark.csv')) {
  if (r.pay_basis !== 'annual') continue
  bench[`${r.soc_code}|${r.state_requested}|${r.experience}`] = [
    num(r.p25), num(r.p50), num(r.p75), num(r.n), r.backoff_level, r.region_level, r.region_value,
  ]
}

// 3) 가상 고객 13건: 발표자료 13쪽의 납품 결과. 해당 조합은 이 값이 최종 납품값이다.
//    basis: cell(관측 범위), model(모델 보완), none(표본 부족으로 제공 보류)
const rec = {}
const laws = {}
const BASIS = { 셀: 'cell', 모형: 'model', '표본 부족': 'none' }
for (const r of read('delivery/client_benchmark_sample.csv')) {
  if (!socMap.has(r.soc_code)) socMap.set(r.soc_code, r.soc_title) // 격자에 없는 직무(화학자)는 사례 전용
  stateSet.add(r.state)
  const note = r.sample_note
  rec[`${r.soc_code}|${r.state}|${r.experience}`] = {
    basis: BASIS[r.basis] ?? 'none',
    note,
    lo: num(r.rec_lo), p50: num(r.rec_p50), hi: num(r.rec_hi),
    loNow: num(r.rec_lo_now), p50Now: num(r.rec_p50_now), hiNow: num(r.rec_hi_now),
    cellN: num(r.cell_n),
    modelRows: Number((note.match(/대표 공고 (\d+)건/) ?? [])[1] ?? 0) || null,
    level: (note.match(/모형 \((.+?),/) ?? [])[1] ?? null,
  }
  if (r.flag_law && !laws[r.state]) laws[r.state] = r.flag_law
}

const socs = [...socMap].map(([code, title]) => ({ code, title, demoOnly: !grid[`${code}|CA|Mid-Senior level`] && !Object.keys(grid).some((k) => k.startsWith(code + '|')) }))
  .sort((a, b) => a.title.localeCompare(b.title))
const states = [...stateSet].sort((a, b) => (a === 'US_REMOTE') - (b === 'US_REMOTE') || a.localeCompare(b))

// 3-2) 직무별 연봉 분포(전체 지역·경력, 2024 공고 실제 연봉의 하위 25% / 중간 / 상위 25%)
const occ = {}
for (const r of read('predictions/occupation_predictions_top100.csv')) {
  if (r.level === 'all') occ[r.soc_code] = [num(r.n), num(r.actual_p25), num(r.actual_p50), num(r.actual_p75)]
}

// 4) 임금 상승(ECI) 환산 계수와 간편 조회형 정확도. business.json에는 NaN이 섞여 있어 정리해서 읽는다
const biz = JSON.parse(readFileSync(resolve(root, 'model/metrics/business.json'), 'utf8').replace(/\bNaN\b/g, 'null'))
const eci = { factor: biz.eci.factor, base: biz.eci.base, latest: biz.eci.latest }
const acc = Object.fromEntries(biz.quote_eval.accuracy.map((a) => [a.방식.slice(0, 1), a.MAE]))
const simple = { n: biz.quote_eval.n, maeModel: acc.B, maeCell: acc['셀'] ?? biz.quote_eval.accuracy[2].MAE }
simple.cutPct = 1 - simple.maeModel / simple.maeCell

// 5) 공고 초안형 KPI는 예측 CSV에서 다시 계산한다
const preds = read('predictions/posting_predictions_2024.csv')
if (preds.length !== 29064) throw new Error(`predictions rows ${preds.length} != 29064`)
let mae = 0, cell = 0, inside = 0, btInside = 0
for (const r of preds) {
  mae += Number(r.cv_abs_error)
  cell += Number(r.cell_abs_error)
  if (r.cv_inside_p25_p75 === 'True') inside++
  const a = Number(r.actual_salary)
  if (a >= Number(r.bt_p25) && a <= Number(r.bt_p75)) btInside++
}
const n = preds.length
const kpi = { maeModel: mae / n, maeCell: cell / n, cutPct: 1 - mae / cell, coverage: inside / n, btCoverage: btInside / n }

mkdirSync(resolve(here, '..', 'public', 'data'), { recursive: true })
writeFileSync(
  resolve(here, '..', 'public', 'data', 'data.json'),
  JSON.stringify({ socs, states, experiences: EXPERIENCES, grid, bench, rec, occ, laws, eci, kpi, simple, counts: { postings: n, gridCells: Object.keys(grid).length, benchCells: Object.keys(bench).length } }),
)
console.log('data.json written', { socs: socs.length, states: states.length, rec: Object.keys(rec).length, eci, simple, kpi })
