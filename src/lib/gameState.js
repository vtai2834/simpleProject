export function buildInitialState(prizeIds) {
  return { remaining: [...prizeIds], assignments: {}, devices: {} }
}
