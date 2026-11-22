export type Team = {
  id: string
  label: string
}

export type WheelGradient = {
  name: string
  stops: readonly string[]
  text: string
}

export const MIN_TEAMS = 1
export const MAX_TEAMS = 32

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

/** CSS gradient for the team dots in the side panel. */
export function gradientCss(stops: readonly string[], angle = 135) {
  return `linear-gradient(${angle}deg, ${stops.join(', ')})`
}

// Default roster — edit this list to change the teams.
const DEFAULT_TEAM_NAMES = [
  'LOSERS',
  'ESPADA',
  'ETHRIA',
  'YONKO',
  'IDEADIGIT',
  'SPARK',
  'AMK',
  'SUPERNOVA',
  'CUPIDON',
  'LARPERZ',
  'TR1NITY',
  'EL BOARD',
  'ELIOHO',
  '2XSIX',
  'NEWGEN',
  'SOLVIHA',
  'VORTEX',
  "SALAMANCA'S",
  'FLUORINE',
  'HAT TRICK',
  'THE O(LIVE) TREE',
  'CREATIVITY TEAM',
  'TAWATW',
  'INNOVIX',
  'ALINNOVTECH',
]

export const DEFAULT_TEAMS: Team[] = DEFAULT_TEAM_NAMES.map((label, index) => ({
  id: `team-${String(index + 1).padStart(2, '0')}`,
  label,
}))
