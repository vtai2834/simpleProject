import { useEffect, useRef, useState } from 'react'
import PetalRain from './components/PetalRain.jsx'
import NameForm from './components/NameForm.jsx'
import ConfirmName from './components/ConfirmName.jsx'
import GachaMachine from './components/GachaMachine.jsx'
import PrizeReveal from './components/PrizeReveal.jsx'
import StatusScreens from './components/StatusScreens.jsx'
import { draw } from './lib/draw.js'
import { getDeviceId } from './lib/deviceId.js'
import { useGameState } from './hooks/useGameState.js'
import { usePrizes } from './hooks/usePrizes.js'

export default function App() {
  const game = useGameState()
  const prizes = usePrizes()

  // name | confirm | gacha | result | soldout | notOpen | error
  const [screen, setScreen] = useState('name')
  const [name, setName] = useState('')
  const [phase, setPhase] = useState('idle')
  const [assignment, setAssignment] = useState(null)
  const [shakeDone, setShakeDone] = useState(false)
  const [outcome, setOutcome] = useState(null) // kết quả draw: { status, assignment } hoặc { error }
  const started = useRef(false)

  // Thiết bị đã bốc rồi: vào thẳng màn kết quả
  const savedName = game.data?.devices?.[getDeviceId()]
  const saved = savedName ? game.data.assignments[savedName] : null
  useEffect(() => {
    if (saved && screen === 'name') {
      setAssignment(saved)
      setScreen('result')
    }
  }, [saved, screen])

  const spin = () => {
    if (started.current) return
    started.current = true
    setPhase('shaking')
    draw(name).then(
      (r) => setOutcome(r),
      (e) => setOutcome({ error: e }),
    )
  }

  // Khi vừa lắc xong vừa có kết quả thì mới đi tiếp
  useEffect(() => {
    if (!shakeDone || !outcome) return
    if (outcome.error) {
      setScreen(outcome.error.message === 'GAME_NOT_OPEN' ? 'notOpen' : 'error')
    } else if (outcome.status === 'soldout') {
      setScreen('soldout')
    } else if (outcome.status === 'invalid') {
      setScreen('name')
    } else {
      setAssignment(outcome.assignment)
      setPhase('dropping')
    }
  }, [shakeDone, outcome])

  const onPhaseDone = (p) => {
    if (p === 'shaking') setShakeDone(true)
    else if (p === 'dropping') setPhase('cracking')
    else if (p === 'cracking') setPhase('done')
    else if (p === 'done') setScreen('result')
  }

  const reset = (next) => {
    started.current = false
    setPhase('idle')
    setShakeDone(false)
    setOutcome(null)
    setScreen(next)
  }

  const closed = !game.loading && game.data === null && screen === 'name'
  const prize = assignment ? prizes.data.find((p) => p.id === assignment.prizeId) ?? null : null

  return (
    <div className="app">
      <PetalRain />
      <main className="stage">
        {closed && <StatusScreens kind="notOpen" />}
        {!closed && screen === 'name' && (
          <NameForm onSubmit={(n) => { setName(n); setScreen('confirm') }} />
        )}
        {screen === 'confirm' && (
          <ConfirmName name={name} onBack={() => setScreen('name')} onConfirm={() => setScreen('gacha')} />
        )}
        {screen === 'gacha' && (
          <GachaMachine phase={phase} onSpinStart={spin} onPhaseDone={onPhaseDone} />
        )}
        {screen === 'result' && assignment && <PrizeReveal prize={prize} assignment={assignment} />}
        {(screen === 'soldout' || screen === 'notOpen') && <StatusScreens kind={screen} />}
        {screen === 'error' && <StatusScreens kind="error" onRetry={() => reset('gacha')} />}
      </main>
    </div>
  )
}
