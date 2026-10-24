import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import Capsule from './Capsule.jsx'
import CapsuleDome from './CapsuleDome.jsx'
import { play } from '../lib/sfx.js'
import { vibrate } from '../lib/haptics.js'
import './gacha.css'

// Thời lượng từng phase (giây). Phase kết thúc bằng timer, không dựa vào sự kiện animation,
// để game không bao giờ bị kẹt (kể cả khi bật giảm chuyển động).
const DURATION = { shaking: 1.8, dropping: 1.5, cracking: 2.7 }

// Chỉ điều khiển hoạt ảnh theo `phase`; không biết gì về Firebase.
// phase: idle -> shaking -> dropping -> cracking -> done
export default function GachaMachine({ phase, onSpinStart, onPhaseDone }) {
  const reduce = useReducedMotion()
  const t = (seconds) => (reduce ? 0.2 : seconds)

  const bodyRef = useRef(null)
  const slotRef = useRef(null)
  const dropRef = useRef(null)
  const crackRef = useRef(null)
  const [open, setOpen] = useState(false)

  // ---- Kết thúc phase + âm thanh + rung ----
  useEffect(() => {
    if (phase === 'done') {
      onPhaseDone('done')
      return undefined
    }
    const ids = []
    if (phase === 'shaking') {
      play('spin')
      vibrate([40, 30, 40, 30, 40])
    }
    if (phase === 'dropping') {
      play('drop')
      vibrate(60)
    }
    if (phase === 'cracking') {
      play('charge')
      ids.push(setTimeout(() => {
        play('crack')
        vibrate([80, 40, 160])
      }, t(1.6) * 1000))
    }
    if (DURATION[phase]) {
      ids.push(setTimeout(() => onPhaseDone(phase), t(DURATION[phase]) * 1000))
    }
    return () => ids.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, reduce])

  // ---- Capsule bung ra đúng lúc chớp sáng ----
  useEffect(() => {
    setOpen(false)
    if (phase !== 'cracking') return undefined
    const id = setTimeout(() => setOpen(true), t(1.6) * 1000)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, reduce])

  // ---- Hoạt ảnh GSAP (chỉ để đẹp, không ảnh hưởng luồng) ----
  useLayoutEffect(() => {
    if (reduce) return undefined
    const cleanups = []
    const ctx = gsap.context(() => {
      if (phase === 'shaking' && bodyRef.current) {
        gsap.to(bodyRef.current, {
          x: 'random(-10,10)',
          y: 'random(-6,6)',
          rotation: 'random(-2.4,2.4)',
          duration: 0.06,
          repeat: Math.floor(DURATION.shaking / 0.06),
          yoyo: true,
          repeatRefresh: true,
          ease: 'none',
        })
      }

      if (phase === 'dropping' && dropRef.current && slotRef.current) {
        gsap.fromTo(
          dropRef.current,
          { y: -130, scale: 0.5, opacity: 0, rotation: -240 },
          { y: 0, scale: 1, opacity: 1, rotation: 0, duration: 0.7, ease: 'bounce.out' },
        )
        // tia lửa tóe ra lúc chạm đáy
        const slot = slotRef.current
        const sparks = Array.from({ length: 14 }, () => {
          const s = document.createElement('span')
          s.className = 'spark'
          slot.appendChild(s)
          return s
        })
        cleanups.push(() => sparks.forEach((s) => s.remove()))
        sparks.forEach((s, i) => {
          const a = (i / sparks.length) * Math.PI * 2
          const d = 40 + Math.random() * 50
          gsap.fromTo(
            s,
            { x: 0, y: 0, opacity: 1, scale: 1 },
            { x: Math.cos(a) * d, y: -Math.abs(Math.sin(a)) * d - 10, opacity: 0, scale: 0, duration: 0.8, delay: 0.5, ease: 'power2.out' },
          )
        })
      }
    }, bodyRef)

    // Cảnh vỡ capsule: ghi chú thời gian (giây) trên timeline
    const crackCtx = gsap.context(() => {
      if (phase !== 'cracking' || !crackRef.current) return
      const app = document.querySelector('.app')
      const tl = gsap.timeline()

      tl.fromTo('.crack-capsule', { scale: 0.5, y: 80, opacity: 0 }, { scale: 1.3, y: 0, opacity: 1, duration: 0.5, ease: 'back.out(2.4)' }, 0)
      // capsule rung ngày càng mạnh và phình to
      tl.to('.crack-capsule', { x: 'random(-12,12)', y: 'random(-12,12)', rotation: 'random(-9,9)', duration: 0.05, repeat: 22, yoyo: true, repeatRefresh: true, ease: 'none' }, 0.5)
      tl.to('.crack-capsule', { scale: 2, duration: 1.1, ease: 'power2.in' }, 0.5)
      // vòng năng lượng co dần vào capsule
      tl.fromTo('.crack-ring', { scale: 3.2, opacity: 0 }, { scale: 0.5, opacity: 0.9, duration: 0.75, stagger: 0.28, ease: 'power2.in' }, 0.4)
      // chớp trắng + sóng xung kích + chùm tia
      tl.to('.crack-flash', { opacity: 1, duration: 0.1 }, 1.6)
      tl.to('.crack-flash', { opacity: 0, duration: 0.7, ease: 'power2.out' }, 1.72)
      tl.fromTo('.crack-shock', { scale: 0.2, opacity: 0.95 }, { scale: 4.5, opacity: 0, duration: 1, ease: 'power3.out' }, 1.6)
      tl.fromTo('.crack-rays', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, 1.6)
      gsap.to('.crack-rays', { rotation: 360, duration: 10, repeat: -1, ease: 'none' })
      // rung cả màn hình
      if (app) {
        tl.to(app, { x: 'random(-3,3)', y: 'random(-3,3)', duration: 0.04, repeat: 30, yoyo: true, repeatRefresh: true, ease: 'none' }, 0.5)
        tl.to(app, { x: 'random(-11,11)', y: 'random(-11,11)', duration: 0.04, repeat: 9, yoyo: true, repeatRefresh: true, ease: 'none' }, 1.6)
        tl.set(app, { x: 0, y: 0 }, 2.1)
        cleanups.push(() => gsap.set(app, { x: 0, y: 0 }))
      }
    }, crackRef)

    return () => {
      ctx.revert()
      crackCtx.revert()
      cleanups.forEach((fn) => fn())
    }
  }, [phase, reduce])

  const busy = phase !== 'idle'

  return (
    <div className={`gacha gacha--${phase}`}>
      <div className="gacha-body" ref={bodyRef}>
        <div className="gacha-dome">
          <CapsuleDome phase={phase} />
          <div className="dome-glow" />
          <div className="dome-shine" />
          <div className="dome-shine dome-shine--b" />
        </div>
        <div className="gacha-base">
          <div className="base-lights" aria-hidden="true">
            {Array.from({ length: 7 }, (_, i) => <i key={i} style={{ animationDelay: `${i * 0.14}s` }} />)}
          </div>
          <div className="gacha-slot" ref={slotRef}>
            {phase === 'dropping' && (
              <div className="drop-capsule" ref={dropRef}>
                <Capsule color="#ff4d8d" size={62} />
              </div>
            )}
          </div>
          <button type="button" className="gacha-btn" disabled={busy} onClick={onSpinStart}>
            Quay
          </button>
        </div>
      </div>

      {phase === 'cracking' && (
        <div className="crack-stage" ref={crackRef}>
          <div className="crack-rays" />
          <div className="crack-ring" />
          <div className="crack-ring" />
          <div className="crack-ring" />
          <div className="crack-capsule">
            <Capsule color="#ff4d8d" size={92} open={open} />
          </div>
          <div className="crack-shock" />
          <div className="crack-flash" />
        </div>
      )}
    </div>
  )
}
