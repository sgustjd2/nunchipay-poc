import { Stage, Window, type Act } from '../kit'
import type { Cond, Data } from '../lib/types'
import { getQuote, type Stance } from '../lib/lookup'
import { Conditions } from '../ui/Conditions'
import { PostingCard, ResultCard, StanceCard } from '../features/quote/cards'
import './demo.css'

// 실제 견적 도구(#/app)의 카드를 그대로 써서, 공고를 쓰다가 연봉 범위를 받고 제시 연봉을 정해 공고에 적는 과정을 보여준다.
// 값은 모두 data.json의 실제 칸을 조회한다. 카드 부품은 견적 도구와 같다(src/features/quote/cards.tsx).

type S = { cond: Cond; basis: Cond; stance: Stance; applied: boolean }

const FROM: Cond = { soc: '13-2011', state: 'NY', exp: 'Associate' }
const TO: Cond = { soc: '15-1252', state: 'CA', exp: 'Mid-Senior level' }
const initial: S = { cond: FROM, basis: FROM, stance: 'mid', applied: false }
const poster: S = { cond: TO, basis: TO, stance: 'high', applied: true }
const REST = { wide: { x: 880, y: 560 }, compact: { x: 300, y: 700 } }
const noop = () => {}

export function QuoteDemo({ data }: { data: Data }) {
  async function script(a: Act<S>) {
    await a.wait(900)
    await a.move('f-soc'); await a.wait(200); await a.click()
    await a.set((s) => ({ cond: { ...s.cond, soc: TO.soc } })); await a.wait(500)
    await a.move('f-state'); await a.wait(200); await a.click()
    await a.set((s) => ({ cond: { ...s.cond, state: TO.state } })); await a.wait(500)
    await a.move('f-exp'); await a.wait(200); await a.click()
    await a.set((s) => ({ cond: { ...s.cond, exp: TO.exp } })); await a.wait(350)
    await a.set((s) => ({ basis: s.cond })) // 세 칸을 다 고른 뒤에 견적이 갱신된다
    await a.wait(2400)
    await a.move('stance-high'); await a.wait(250); await a.click()
    await a.set({ stance: 'high' }); await a.wait(900)
    await a.move('apply'); await a.wait(250); await a.click()
    await a.set({ applied: true })
    await a.move('rest'); await a.wait(3200)
    // 처음 장면으로 돌려놓는다. 되감기는 한 번만, 마지막 장면을 충분히 보여 준 뒤에 일어난다
    await a.set({ ...initial }); await a.wait(600)
  }

  return (
    <Stage fill width={1100} height={700} compact={{ below: 560, width: 520, height: 900 }} initial={initial} poster={poster} script={script} cursor={{ at: REST }} className="qd">
      {(s, _rect, layout) => {
        const quote = getQuote(data, s.basis.soc, s.basis.state, s.basis.exp)
        return (
          <>
            <Window title="공고 연봉 견적" className="qd-win">
              <div className="qd-real">
                <div className="search-band search-band--3" role="group" aria-label="공고 조건">
                  <Conditions variant="band" data={data} value={s.cond} onChange={noop} targets />
                </div>
                <div className="qd-grid">
                  <div className="qd-main">
                    <ResultCard data={data} cond={s.basis} quote={quote} />
                    {quote && <StanceCard data={data} quote={quote} stance={s.stance} applied={s.applied} onStance={noop} onApply={noop} targets />}
                  </div>
                  <PostingCard data={data} cond={s.basis} quote={quote} stance={s.stance} applied={s.applied} hires={1} />
                </div>
              </div>
            </Window>
            <span data-target="rest" style={{ position: 'absolute', left: REST[layout].x, top: REST[layout].y }} />
          </>
        )
      }}
    </Stage>
  )
}
