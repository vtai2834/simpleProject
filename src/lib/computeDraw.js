import { normalizeName, sanitizeDisplayName } from './normalizeName.js'
import { pickWish } from './wish.js'

// Logic bốc thăm thuần: không đụng Firebase, không mutate state.
export function computeDraw(state, { name, deviceId, templates, now, rand }) {
  const displayName = sanitizeDisplayName(name)
  const normName = normalizeName(displayName)
  if (!normName) return { kind: 'invalid' }

  const knownName = state.devices[deviceId] ?? (state.assignments[normName] ? normName : null)
  if (knownName && state.assignments[knownName]) {
    return { kind: 'existing', assignment: state.assignments[knownName] }
  }

  if (state.remaining.length === 0) return { kind: 'soldout' }

  const index = Math.floor(rand() * state.remaining.length)
  const prizeId = state.remaining[index]
  const assignment = {
    name: displayName,
    prizeId,
    wish: pickWish(templates, displayName, rand),
    drawnAt: now,
  }
  return {
    kind: 'new',
    assignment,
    nextState: {
      remaining: state.remaining.filter((_, i) => i !== index),
      assignments: { ...state.assignments, [normName]: assignment },
      devices: { ...state.devices, [deviceId]: normName },
    },
  }
}
