import {
  colorForIndex,
  textColorFor,
  type Entry,
} from '../data/entries'
import './Wheel.css'

type WheelProps = {
  entries: Entry[]
  rotation: number
  spinning: boolean
  onSpin: () => void
  onSpinEnd: () => void
}

const SIZE = 200
const CENTER = SIZE / 2
const RADIUS = 95

function polar(radius: number, angle: number) {
  const radians = (angle * Math.PI) / 180
  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER + radius * Math.sin(radians),
  }
}

function segmentPath(startAngle: number, endAngle: number) {
  const start = polar(RADIUS, startAngle)
  const end = polar(RADIUS, endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${CENTER} ${CENTER}`,
    `L ${start.x} ${start.y}`,
    `A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ')
}

function fitLabel(label: string, maxLength: number) {
  const clean = label.trim() || 'Untitled'
  return clean.length > maxLength
    ? `${clean.slice(0, maxLength - 1).trimEnd()}…`
    : clean
}

export default function Wheel({
  entries,
  rotation,
  spinning,
  onSpin,
  onSpinEnd,
}: WheelProps) {
  const segmentAngle = 360 / entries.length
  const maxLabelLength = entries.length <= 4 ? 16 : entries.length <= 8 ? 14 : 12
  const labelSize = entries.length <= 4 ? 8 : entries.length <= 8 ? 6.4 : 5.4

  return (
    <div className="wheel-wrap">
      <div className="pointer" aria-hidden="true" />

      <div className="wheel-disc">
        <div
          className="rotor"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: spinning ? 'var(--spin-duration)' : '0ms',
          }}
          onTransitionEnd={(event) => {
            if (event.propertyName === 'transform') onSpinEnd()
          }}
        >
          <svg
            className="wheel-svg"
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="img"
            aria-label={`Wheel with ${entries.length} options`}
          >
            <defs>
              <radialGradient id="wheel-hub" cx="50%" cy="38%" r="72%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#F1F2F5" />
              </radialGradient>
            </defs>

            <circle cx={CENTER} cy={CENTER} r={99} fill="#FFFFFF" />

            {entries.map((entry, index) => {
              const start = index * segmentAngle - 90
              const mid = start + segmentAngle / 2
              const color = colorForIndex(index).hex
              const flip = mid > 90 && mid < 270

              return (
                <g key={entry.id}>
                  <path
                    d={segmentPath(start, start + segmentAngle)}
                    fill={color}
                    stroke="#FFFFFF"
                    strokeWidth="0.8"
                    strokeLinejoin="round"
                  />
                  <text
                    x={87}
                    y={0}
                    transform={`rotate(${mid})${flip ? ' rotate(180 87 0)' : ''}`}
                    textAnchor={flip ? 'start' : 'end'}
                    dominantBaseline="middle"
                    fill={textColorFor(color)}
                    fontSize={labelSize}
                    fontWeight="700"
                    letterSpacing="0.02em"
                  >
                    {fitLabel(entry.label, maxLabelLength).toUpperCase()}
                  </text>
                </g>
              )
            })}

            <circle
              cx={CENTER}
              cy={CENTER}
              r={27}
              fill="url(#wheel-hub)"
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />
          </svg>
        </div>

        <button
          type="button"
          className="spin-btn"
          onClick={onSpin}
          disabled={spinning}
          aria-label={spinning ? 'Wheel is spinning' : 'Spin the wheel'}
        >
          {spinning ? '…' : 'Spin'}
        </button>
      </div>

      <p className="wheel-caption" aria-live="polite">
        {spinning ? 'Round and round…' : 'Tap SPIN and let fate decide.'}
      </p>
    </div>
  )
}
