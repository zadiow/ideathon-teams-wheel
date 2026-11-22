export type Entry = {
  id: string
  label: string
}

export type WheelGradient = {
  name: string
  stops: readonly string[]
  text: string
}

export const MIN_ENTRIES = 2
export const MAX_ENTRIES = 12

const INK = '#2B2F3B'
const WHITE = '#FFFFFF'

/**
 * Gradient recipes sampled from the NextGen "Gradients" sheet.
 * The wheel cycles through these in order so neighbouring wedges stay distinct.
 */
export const WHEEL_GRADIENTS: readonly WheelGradient[] = [
  { name: 'Pink → Red', stops: ['#D912D9', '#FB4B4E'], text: WHITE },
  { name: 'Blue → Violet', stops: ['#25B6F3', '#6A5EED'], text: WHITE },
  {
    name: 'Orange → Red → Pink',
    stops: ['#FFA333', '#FB4B4E', '#D912D9'],
    text: INK,
  },
  { name: 'Light Blue → Violet', stops: ['#E9F8FE', '#F0F0FD'], text: INK },
  { name: 'Red → Orange', stops: ['#FB4B4E', '#FFA333'], text: INK },
  {
    name: 'Pink → Violet → Blue',
    stops: ['#C91DDB', '#6A5EED', '#30A9F2'],
    text: WHITE,
  },
  { name: 'Light Red → Pink', stops: ['#FEEBED', '#FAD9F8'], text: INK },
  { name: 'Violet → Blue', stops: ['#6A5EED', '#30A9F2'], text: WHITE },
]

export function gradientForIndex(index: number) {
  return WHEEL_GRADIENTS[index % WHEEL_GRADIENTS.length]
}

/** CSS gradient for the entry dots in the side panel. */
export function gradientCss(stops: readonly string[], angle = 135) {
  return `linear-gradient(${angle}deg, ${stops.join(', ')})`
}

export const DEFAULT_ENTRIES: Entry[] = [
  { id: 'ship-it', label: 'Ship it' },
  { id: 'coffee-run', label: 'Coffee run' },
  { id: 'pizza-party', label: 'Pizza party' },
  { id: 'design-sprint', label: 'Design sprint' },
  { id: 'demo-day', label: 'Demo day' },
  { id: 'bug-bash', label: 'Bug bash' },
  { id: 'team-retro', label: 'Team retro' },
  { id: 'wildcard', label: 'Wildcard' },
]
