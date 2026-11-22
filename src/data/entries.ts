export type Entry = {
  id: string
  label: string
}

export const MIN_ENTRIES = 2
export const MAX_ENTRIES = 12

/**
 * Palette sampled from the NextGen brand color swatches.
 * Keep this order: the wheel assigns colors by index.
 */
export const PALETTE = [
  { name: 'Violet', hex: '#6A5EED' },
  { name: 'Orange', hex: '#FFA333' },
  { name: 'Blue', hex: '#25B6F3' },
  { name: 'Pink', hex: '#D912D9' },
  { name: 'Green', hex: '#00FF7F' },
  { name: 'Red', hex: '#FB4B4E' },
  { name: 'Yellow', hex: '#FFD819' },
  { name: 'Neutral', hex: '#A7ADBE' },
] as const

const INK = '#2B2F3B'
const WHITE = '#FFFFFF'

export function colorForIndex(index: number) {
  return PALETTE[index % PALETTE.length]
}

function linearChannel(value: number) {
  const channel = value / 255
  return channel <= 0.03928
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4
}

/** Pick ink or white text based on the swatch's relative luminance. */
export function textColorFor(hex: string) {
  const red = Number.parseInt(hex.slice(1, 3), 16)
  const green = Number.parseInt(hex.slice(3, 5), 16)
  const blue = Number.parseInt(hex.slice(5, 7), 16)
  const luminance =
    0.2126 * linearChannel(red) +
    0.7152 * linearChannel(green) +
    0.0722 * linearChannel(blue)

  return luminance > 0.36 ? INK : WHITE
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
