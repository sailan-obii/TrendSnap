const COLOR_POOL = [
  'rgba(100, 255, 218, 0.48)',
  'rgba(99, 102, 241, 0.44)',
  'rgba(192, 38, 211, 0.4)',
  'rgba(255, 107, 107, 0.38)',
  'rgba(251, 191, 36, 0.36)',
  'rgba(56, 189, 248, 0.42)',
  'rgba(244, 114, 182, 0.4)',
  'rgba(163, 230, 53, 0.35)',
]

const ANGLES = [110, 120, 130, 140, 150, 160, 125, 135]

function hashString(value) {
  const input = String(value)
  let hash = 0

  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }

  return Math.abs(hash)
}

export function getCardBorderStyle(seed) {
  const hash = hashString(seed)
  const pick = (offset) => COLOR_POOL[(hash + offset) % COLOR_POOL.length]

  return {
    '--card-border-angle': `${ANGLES[hash % ANGLES.length]}deg`,
    '--card-border-c1': pick(0),
    '--card-border-c2': pick(3),
    '--card-border-c3': pick(5),
    '--card-border-c4': pick(7),
  }
}
