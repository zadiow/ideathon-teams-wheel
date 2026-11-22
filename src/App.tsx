import { useCallback, useEffect, useRef, useState } from 'react'
import EntriesPanel from './components/EntriesPanel'
import ResultDialog from './components/ResultDialog'
import Wheel from './components/Wheel'
import { DEFAULT_ENTRIES, type Entry } from './data/entries'
import './App.css'

const STORAGE_KEY = 'spin-the-wheel:entries:v1'
const SPIN_FALLBACK_MS = 5200

function loadEntries(): Entry[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return DEFAULT_ENTRIES

    const parsed: unknown = JSON.parse(stored)
    const valid =
      Array.isArray(parsed) &&
      parsed.length >= 2 &&
      parsed.every(
        (item) =>
          typeof item === 'object' &&
          item !== null &&
          typeof (item as Entry).id === 'string' &&
          typeof (item as Entry).label === 'string',
      )

    if (valid) return parsed as Entry[]
  } catch {
    // Ignore malformed storage and fall back to the defaults.
  }

  return DEFAULT_ENTRIES
}

function App() {
  const [entries, setEntries] = useState<Entry[]>(loadEntries)
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<Entry | null>(null)
  const pendingWinner = useRef<Entry | null>(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch {
      // Storage can be unavailable (private mode); the app still works.
    }
  }, [entries])

  const finishSpin = useCallback(() => {
    const result = pendingWinner.current
    if (!result) return

    pendingWinner.current = null
    setSpinning(false)
    setWinner(result)
  }, [])

  // Safety net in case the transitionend event never arrives (e.g. hidden tab).
  useEffect(() => {
    if (!spinning) return

    const timer = window.setTimeout(finishSpin, SPIN_FALLBACK_MS)
    return () => window.clearTimeout(timer)
  }, [spinning, finishSpin])

  const spin = useCallback(() => {
    if (spinning || entries.length < 2) return

    const index = Math.floor(Math.random() * entries.length)
    const segment = 360 / entries.length
    const center = index * segment - 90 + segment / 2
    const jitterRange = Math.max(segment / 2 - 12, 2)
    const jitter = (Math.random() * 2 - 1) * jitterRange
    const target = -90 - center + jitter
    const delta = (((target - rotation) % 360) + 360) % 360

    pendingWinner.current = entries[index]
    setRotation(rotation + 6 * 360 + delta)
    setSpinning(true)
  }, [entries, rotation, spinning])

  const spinAgain = useCallback(() => {
    setWinner(null)
    window.setTimeout(spin, 180)
  }, [spin])

  const closeResult = useCallback(() => setWinner(null), [])

  return (
    <div className="app">
      <header className="site-header">
        <a className="brand" href="/" aria-label="NextGen home">
          <img
            src="/logo/nextgen.png"
            alt="NextGen"
            width="591"
            height="376"
          />
        </a>
        <span className="badge">
          <span className="badge-dot" aria-hidden="true" />
          Spin the wheel
        </span>
      </header>

      <main className="layout">
        <section className="stage">
          <div className="intro">
            <p className="eyebrow">Decision time</p>
            <h1>
              Let the wheel <span className="gradient-text">decide.</span>
            </h1>
            <p className="lede">
              {entries.length} options, one winner. Edit the list, then give it
              a spin.
            </p>
          </div>

          <Wheel
            entries={entries}
            rotation={rotation}
            spinning={spinning}
            onSpin={spin}
            onSpinEnd={finishSpin}
          />
        </section>

        <EntriesPanel
          entries={entries}
          onChange={setEntries}
          locked={spinning}
        />
      </main>

      <footer className="site-footer">
        <span>NextGen starter</span>
        <span aria-hidden="true">·</span>
        <span>Vite + React + TypeScript</span>
      </footer>

      {winner ? (
        <ResultDialog
          winner={winner}
          onClose={closeResult}
          onSpinAgain={spinAgain}
        />
      ) : null}
    </div>
  )
}

export default App
