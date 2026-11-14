import { useMemo } from 'react'
import type { Cond, Data } from '../lib/types'
import { SOC_GROUPS, STATE_GROUPS, socOptions, stateOptions } from '../content/labels'
import { EXP_LABEL } from '../lib/format'
import { Picker, Seg } from './Picker'

interface Props {
  data: Data
  value: Cond
  onChange: (p: Partial<Cond>) => void
  /** band는 검색 띠 안의 칸, form은 세로 입력 폼 */
  variant: 'band' | 'form'
  /** 데모 장면에서 커서가 찾아갈 칸 이름을 붙인다 */
  targets?: boolean
}

// 견적 조건 세 가지(직무, 지역, 경력). 홈과 견적 도구, 데모 장면이 같은 입력을 쓴다.
export function Conditions({ data, value, onChange, variant, targets }: Props) {
  const socs = useMemo(() => socOptions(data.socs), [data])
  const states = useMemo(() => stateOptions(data.states), [data])
  const exps = useMemo(() => data.experiences.map((x) => ({ value: x, label: EXP_LABEL[x], group: '경력' })), [data])
  return (
    <>
      <Picker label="직무" value={value.soc} options={socs} groups={SOC_GROUPS} onChange={(v) => onChange({ soc: v })} hint="직무 검색 (예: 개발자, 간호사, 회계)" target={targets ? 'f-soc' : undefined} />
      <Picker label="근무 지역" value={value.state} options={states} groups={STATE_GROUPS} onChange={(v) => onChange({ state: v })} hint="지역 검색 (예: 뉴욕, 캘리포니아)" target={targets ? 'f-state' : undefined} />
      {variant === 'band'
        ? <Picker mode="list" label="경력 수준" value={value.exp} options={exps} onChange={(v) => onChange({ exp: v })} target={targets ? 'f-exp' : undefined} />
        : <Seg label="경력 수준" value={value.exp} options={exps} onChange={(v) => onChange({ exp: v })} />}
    </>
  )
}
