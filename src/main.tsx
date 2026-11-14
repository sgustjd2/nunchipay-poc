import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import './kit/stageshow.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/ruler.css'
import type { Data } from './lib/types'
import { Nav, type Route } from './ui/Nav'
import { Home } from './pages/Home'
import { QuoteApp } from './pages/QuoteApp'
import { Pitch } from './pages/Pitch'

// #/app, #/pitch 외의 해시(#how 같은 섹션 앵커 포함)는 모두 홈이다
const routeOf = (): Route => (location.hash.startsWith('#/app') ? 'app' : location.hash.startsWith('#/pitch') ? 'pitch' : 'home')

function Root() {
  const [route, setRoute] = useState<Route>(routeOf())
  const [data, setData] = useState<Data | null>(null)
  useEffect(() => {
    // 페이지가 바뀔 때만 맨 위로 간다. 섹션 앵커 이동은 브라우저에 맡긴다
    const on = () => setRoute((prev) => { const next = routeOf(); if (next !== prev) window.scrollTo(0, 0); return next })
    window.addEventListener('hashchange', on)
    fetch('data/data.json').then((r) => r.json()).then(setData)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  // 데이터가 도착한 뒤에 #how 같은 섹션 주소로 이동한다(그 전에는 이동할 대상이 아직 없다)
  useEffect(() => {
    if (!data || route !== 'home' || !location.hash || location.hash.startsWith('#/')) return
    const id = location.hash.slice(1)
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView(), 50)
    return () => clearTimeout(t)
  }, [data, route])
  return (
    <>
      <Nav route={route} />
      {!data ? <p style={{ padding: 24 }}>데이터를 불러오는 중</p> : route === 'app' ? <QuoteApp data={data} /> : route === 'pitch' ? <Pitch data={data} /> : <Home data={data} />}
    </>
  )
}

createRoot(document.getElementById('root')!).render(<Root />)
