import { gradientForIndex, type Entry } from '../data/entries'
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
const LABEL_RADIUS = 78

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

/**
 * Arc for a curved label. Bottom-half arcs run backwards so the text stays
 * upright instead of hanging upside down.
 */
function labelArc(startAngle: number, endAngle: number, reversed: boolean) {
  const from = polar(LABEL_RADIUS, reversed ? endAngle : startAngle)
  const to = polar(LABEL_RADIUS, reversed ? startAngle : endAngle)
  const sweep = reversed ? 0 : 1
  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0

  return `M ${from.x} ${from.y} A ${LABEL_RADIUS} ${LABEL_RADIUS} 0 ${largeArc} ${sweep} ${to.x} ${to.y}`
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
  const maxLabelLength = entries.length <= 4 ? 16 : entries.length <= 8 ? 13 : 10
  const labelSize = entries.length <= 4 ? 8 : entries.length <= 8 ? 6.6 : 5.4
  const labelPadding = Math.min(2.5, segmentAngle * 0.06)

  const segments = entries.map((entry, index) => {
    const start = index * segmentAngle - 90
    const end = start + segmentAngle
    const mid = start + segmentAngle / 2
    const gradient = gradientForIndex(index)

    return {
      entry,
      index,
      start,
      end,
      mid,
      gradient,
      reversed: mid > 0 && mid < 180,
      from: polar(RADIUS, start),
      to: polar(RADIUS, end),
      labelPath: labelArc(
        start + labelPadding,
        end - labelPadding,
        mid > 0 && mid < 180,
      ),
    }
  })

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
              <radialGradient id="wheel-shade" cx="50%" cy="50%" r="50%">
                <stop offset="58%" stopColor="#2B2F3B" stopOpacity="0" />
                <stop offset="100%" stopColor="#2B2F3B" stopOpacity="0.12" />
              </radialGradient>

              {segments.map(({ index, gradient, from, to }) => (
                <linearGradient
                  key={`gradient-${index}`}
                  id={`segment-gradient-${index}`}
                  gradientUnits="userSpaceOnUse"
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                >
                  {gradient.stops.map((stop, stopIndex) => (
                    <stop
                      key={stop}
                      offset={`${(stopIndex / (gradient.stops.length - 1)) * 100}%`}
                      stopColor={stop}
                    />
                  ))}
                </linearGradient>
              ))}

              {segments.map(({ index, labelPath }) => (
                <path
                  key={`label-path-${index}`}
                  id={`label-path-${index}`}
                  d={labelPath}
                  fill="none"
                />
              ))}
            </defs>

            <circle cx={CENTER} cy={CENTER} r={99} fill="#FFFFFF" />

            {segments.map(({ entry, index, start, end }) => (
              <path
                key={entry.id}
                d={segmentPath(start, end)}
                fill={`url(#segment-gradient-${index})`}
                stroke="#FFFFFF"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
            ))}

            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="url(#wheel-shade)"
              pointerEvents="none"
            />

            {segments.map(({ entry, index, gradient }) => (
              <text
                key={entry.id}
                fill={gradient.text}
                stroke={
                  gradient.text === '#FFFFFF'
                    ? 'rgba(43, 47, 59, 0.18)'
                    : 'none'
                }
                strokeWidth={gradient.text === '#FFFFFF' ? 0.7 : 0}
                paintOrder="stroke"
                fontSize={labelSize}
                fontWeight="700"
                letterSpacing="0.02em"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                <textPath href={`#label-path-${index}`} startOffset="50%">
                  {fitLabel(entry.label, maxLabelLength).toUpperCase()}
                </textPath>
              </text>
            ))}

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
