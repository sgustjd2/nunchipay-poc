export type Conf = 'high' | 'medium' | 'low'

export interface Form { soc: string; state: string; exp: string; hires: number }

// 견적을 정하는 세 가지 조건
export type Cond = Pick<Form, 'soc' | 'state' | 'exp'>

/** observed: 같은 조건 공고가 충분해 관측 범위를 그대로 씀 / model: 모델로 보완 */
export type Basis = 'observed' | 'model'

export interface Quote {
  p25: number; p50: number; p75: number
  basis: Basis
  /** 근거 공고 수: 관측이면 같은 조건 공고 수, 모델이면 대표 공고 수 */
  n: number
  /** 모델 견적의 근거 수준(직무 x 경력 / 직무 x 인접 경력) */
  level: string | null
  conf: Conf
  /** 임금 상승(ECI)으로 현재 기준 환산한 참고값 */
  now: { p25: number; p50: number; p75: number }
}

export interface Bench {
  p25: number | null; p50: number | null; p75: number | null
  n: number; backoff: string; regionLevel: string; regionValue: string
}

export interface Rec {
  basis: 'cell' | 'model' | 'none'
  note: string
  lo: number | null; p50: number | null; hi: number | null
  loNow: number | null; p50Now: number | null; hiNow: number | null
  cellN: number | null; modelRows: number | null; level: string | null
}

export interface Kpi { maeModel: number; maeCell: number; cutPct: number; coverage: number; btCoverage: number }

export interface Data {
  socs: { code: string; title: string; demoOnly: boolean }[]
  states: string[]
  experiences: string[]
  grid: Record<string, [number, number, number, number, string] | null>
  bench: Record<string, [number | null, number | null, number | null, number, string, string, string]>
  rec: Record<string, Rec>
  /** 직무별 연봉 분포(전체 지역·경력): [공고 수, 하위 25%, 중간, 상위 25%] */
  occ: Record<string, [number, number, number, number]>
  laws: Record<string, string>
  eci: { factor: number; base: string; latest: string }
  kpi: Kpi
  /** 간편 조회형(직무·지역·경력만 입력) 정확도: 셀 조회 대비 */
  simple: { n: number; maeModel: number; maeCell: number; cutPct: number }
  counts: { postings: number; gridCells: number; benchCells: number }
}
