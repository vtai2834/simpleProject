import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Capsule from './Capsule.jsx'
import './gacha.css'

const COLORS = ['#ff8fb3', '#ffc2d6', '#ffb3c1', '#f9a8d4', '#fda4af', '#ffd6a5', '#ff9eb5']
// Vị trí tương đối của các capsule trong bóng thủy tinh (phần trăm)
const DOME = [
  { x: 14, y: 58 }, { x: 40, y: 66 }, { x: 64, y: 58 }, { x: 26, y: 38 },
  { x: 52, y: 40 }, { x: 36, y: 16 }, { x: 62, y: 22 },
]

// Chỉ điều khiển hoạt ảnh theo `phase`; không biết gì về Firebase.
// phase: idle -> shaking -> dropping -> cracking -> done
export default function GachaMachine({ phase, onSpinStart, onPhaseDone }) {
  const reduce = useReducedMotion()
  const t = (seconds) => (reduce ? 0.2 : seconds)

  useEffect(() => {
    if (phase === 'done') onPhaseDone('done')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const busy = phase !== 'idle'
  const finish = (p) => () => onPhaseDone(p)

  return (
    <div className="gacha">
      <motion.div
        className="gacha-body"
        animate={
          phase === 'shaking' && !reduce
            ? { x: [0, -8, 8, -10, 10, -6, 6, 0], rotate: [0, -2, 2, -2, 2, -1, 1, 0] }
            : { x: 0, rotate: 0 }
        }
        transition={{ duration: t(1.8), ease: 'easeInOut' }}
        onAnimationComplete={phase === 'shaking' ? finish('shaking') : undefined}
      >
        <div className="gacha-dome">
          {DOME.map((c, i) => (
            <motion.div
              key={i}
              className="dome-capsule"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
              animate={
                phase === 'shaking' && !reduce
                  ? { y: [0, -26, 6, -18, 0], rotate: [0, 40, -40, 25, 0] }
                  : { y: 0, rotate: i * 25 }
              }
              transition={{ duration: 1.8, delay: i * 0.05 }}
            >
              <Capsule color={COLORS[i % COLORS.length]} size={42} />
            </motion.div>
          ))}
          <div className="dome-shine" />
        </div>
        <div className="gacha-base">
          <div className="gacha-slot">
            {phase === 'dropping' && (
              <motion.div
                className="drop-capsule"
                initial={{ y: -90, x: 0, opacity: 0, rotate: 0 }}
                animate={{ y: [-90, 10, -14, 8, 0], opacity: 1, rotate: [0, 160, 340, 380, 360] }}
                transition={{ duration: t(1.4), ease: 'easeOut' }}
                onAnimationComplete={finish('dropping')}
              >
                <Capsule color="#ff6f9c" size={64} />
              </motion.div>
            )}
          </div>
          <motion.button
            type="button"
            className="gacha-btn"
            disabled={busy}
            onClick={onSpinStart}
            animate={phase === 'idle' ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={{ duration: 1.2, repeat: phase === 'idle' ? Infinity : 0 }}
          >
            Quay
          </motion.button>
        </div>
      </motion.div>

      {phase === 'cracking' && (
        <div className="crack-stage">
          <motion.div
            className="crack-glow"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: [0.2, 1.6, 2.4], opacity: [0, 0.95, 0] }}
            transition={{ duration: t(1.6), delay: t(0.8) }}
          />
          <motion.div
            animate={{ x: [0, -6, 6, -6, 6, 0], scale: [1, 1.15, 1.3] }}
            transition={{ duration: t(0.8) }}
            onAnimationComplete={finish('cracking')}
          >
            <CrackingCapsule />
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Capsule rung mạnh rồi tách đôi sau một nhịp
function CrackingCapsule() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setOpen(true), 600)
    return () => clearTimeout(id)
  }, [])
  return <Capsule color="#ff6f9c" size={92} open={open} />
}
