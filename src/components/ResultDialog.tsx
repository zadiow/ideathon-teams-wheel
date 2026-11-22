import { useEffect, useRef } from 'react'
import type { Entry } from '../data/entries'
import './ResultDialog.css'

type ResultDialogProps = {
  winner: Entry
  onClose: () => void
  onSpinAgain: () => void
}

export default function ResultDialog({
  winner,
  onClose,
  onSpinAgain,
}: ResultDialogProps) {
  const primaryButton = useRef<HTMLButtonElement>(null)

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

        <p className="result-eyebrow">The wheel has spoken</p>
        <h2 className="result-name" id="result-title">
          {winner.label.trim() || 'Untitled'}
        </h2>
        <p className="result-note" id="result-note">
          That&apos;s the pick. No take-backs.
        </p>

        <div className="result-actions">
          <button
            ref={primaryButton}
            type="button"
            className="primary-btn"
            onClick={onSpinAgain}
          >
            Spin again
          </button>
          <button type="button" className="secondary-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
