import { useState } from 'react'
import PetalRain from './components/PetalRain.jsx'
import NameForm from './components/NameForm.jsx'
import ConfirmName from './components/ConfirmName.jsx'

export default function App() {
  const [screen, setScreen] = useState('name') // name | confirm | gacha | result
  const [name, setName] = useState('')

  return (
    <div className="app">
      <PetalRain />
      <main className="stage">
        {screen === 'name' && (
          <NameForm onSubmit={(n) => { setName(n); setScreen('confirm') }} />
        )}
        {screen === 'confirm' && (
          <ConfirmName name={name} onBack={() => setScreen('name')} onConfirm={() => setScreen('gacha')} />
        )}
      </main>
    </div>
  )
}
