import { useCallback, useEffect, useRef, useState } from 'react'
import ResultDialog from './components/ResultDialog'
import TeamsPanel from './components/TeamsPanel'
import Wheel from './components/Wheel'
import { DEFAULT_TEAMS, MIN_TEAMS, type Team } from './data/teams'
import './App.css'

const STORAGE_KEY = 'spin-the-wheel:teams:v2'
const SPIN_FALLBACK_MS = 5200

function loadTeams(): Team[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return DEFAULT_TEAMS

    const parsed: unknown = JSON.parse(stored)
    const valid =
      Array.isArray(parsed) &&
      parsed.length >= MIN_TEAMS &&
      parsed.every(
        (item) =>
          typeof item === 'object' &&
          item !== null &&
          typeof (item as Team).id === 'string' &&
          typeof (item as Team).label === 'string',
      )

    if (valid) return parsed as Team[]
  } catch {
    // Ignore malformed storage and fall back to the defaults.
  }

  return DEFAULT_TEAMS
}

function App() {
  const [teams, setTeams] = useState<Team[]>(loadTeams)
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<Team | null>(null)
  const pendingWinner = useRef<Team | null>(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(teams))
    } catch {
      // Storage can be unavailable (private mode); the app still works.
    }
  }, [teams])

  const finishSpin = useCallback(() => {
    const result = pendingWinner.current
    if (!result) return

    pendingWinner.current = null
    setSpinning(false)
    setWinner(result)
    setTeams((current) => {
      const remaining = current.filter((team) => team.id !== result.id)
      return remaining.length > 0 ? remaining : current
    })
  }, [])

  // Safety net in case the transitionend event never arrives (e.g. hidden tab).
  useEffect(() => {
    if (!spinning) return

    const timer = window.setTimeout(finishSpin, SPIN_FALLBACK_MS)
    return () => window.clearTimeout(timer)
  }, [spinning, finishSpin])

  const spin = useCallback(() => {
    if (spinning || teams.length < 2) return

    const index = Math.floor(Math.random() * teams.length)
    const segment = 360 / teams.length
    const center = index * segment - 90 + segment / 2
    const jitterRange = Math.max(segment / 2 - 12, 2)
    const jitter = (Math.random() * 2 - 1) * jitterRange
    const target = -90 - center + jitter
    const delta = (((target - rotation) % 360) + 360) % 360

    pendingWinner.current = teams[index]
    setRotation(rotation + 6 * 360 + delta)
    setSpinning(true)
  }, [teams, rotation, spinning])

  const spinAgain = useCallback(() => {
    setWinner(null)
    window.setTimeout(spin, 180)
  }, [spin])

  const closeResult = useCallback(() => setWinner(null), [])

  const startOver = useCallback(() => {
    pendingWinner.current = null
    setSpinning(false)
    setWinner(null)
    setRotation(0)
    setTeams(DEFAULT_TEAMS.map((team) => ({ ...team })))
  }, [])

  const lastTeam = teams.length === 1 ? teams[0] : null

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
            <p className="eyebrow">Presentation time</p>
            <h1>
              Let the wheel <span className="gradient-text">decide.</span>
            </h1>
            <p className="lede">
              {teams.length === 1
                ? 'One team left standing. Reset to run it back.'
                : `${teams.length} teams left.`}
            </p>
          </div>

          <Wheel
            teams={teams}
            rotation={rotation}
            spinning={spinning}
            onSpin={spin}
            onSpinEnd={finishSpin}
          />
        </section>

        <TeamsPanel
          teams={teams}
          onChange={setTeams}
          onReset={startOver}
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
          remaining={teams.length}
          lastTeam={lastTeam}
          onClose={closeResult}
          onSpinAgain={spinAgain}
          onStartOver={startOver}
        />
      ) : null}
    </div>
  )
}

export default App
