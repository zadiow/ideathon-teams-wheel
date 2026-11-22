import { useEffect, useRef } from 'react'
import type { Team } from '../data/teams'
import './ResultDialog.css'

type ResultDialogProps = {
  winner: Team
  remaining: number
  lastTeam: Team | null
  onClose: () => void
  onSpinAgain: () => void
  onStartOver: () => void
}

export default function ResultDialog({
  winner,
  remaining,
  lastTeam,
  onClose,
  onSpinAgain,
  onStartOver,
}: ResultDialogProps) {
  const primaryButton = useRef<HTMLButtonElement>(null)
  const hasMoreTeams = remaining > 1

  useEffect(() => {
    primaryButton.current?.focus()
  }, [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div
      className="overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="result-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-title"
        aria-describedby="result-note"
      >
        <span className="spark spark-a" aria-hidden="true" />
        <span className="spark spark-b" aria-hidden="true" />
        <span className="spark spark-c" aria-hidden="true" />
        <span className="spark spark-d" aria-hidden="true" />

        <p className="result-eyebrow">
          {hasMoreTeams ? 'The wheel has spoken' : 'Final pick'}
        </p>
        <h2 className="result-name" id="result-title">
          {winner.label.trim() || 'Untitled'}
        </h2>
        <p className="result-note" id="result-note">
          {hasMoreTeams
            ? `${remaining} teams left in the running.`
            : lastTeam
              ? `${lastTeam.label.trim() || 'One team'} is the last team standing.`
              : 'That was the last team.'}
        </p>

        <div className="result-actions">
          <button
            ref={primaryButton}
            type="button"
            className="primary-btn"
            onClick={hasMoreTeams ? onSpinAgain : onStartOver}
          >
            {hasMoreTeams ? 'Spin again' : 'Start over'}
          </button>
          <button type="button" className="secondary-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
