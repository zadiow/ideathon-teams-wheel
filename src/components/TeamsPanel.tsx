import { useState } from 'react'
import {
  DEFAULT_TEAMS,
  gradientCss,
  gradientForIndex,
  MAX_TEAMS,
  MIN_TEAMS,
  type Team,
} from '../data/teams'
import './TeamsPanel.css'

type TeamsPanelProps = {
  teams: Team[]
  onChange: (teams: Team[]) => void
  onReset: () => void
  locked: boolean
}

function shuffleTeams(teams: Team[]) {
  const next = [...teams]

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swap]] = [next[swap], next[index]]
  }

  return next
}

export default function TeamsPanel({
  teams,
  onChange,
  onReset,
  locked,
}: TeamsPanelProps) {
  const [focusId, setFocusId] = useState<string | null>(null)

  const atMax = teams.length >= MAX_TEAMS
  const atMin = teams.length <= MIN_TEAMS
  const isDefault =
    teams.length === DEFAULT_TEAMS.length &&
    teams.every((team, index) => {
      const original = DEFAULT_TEAMS[index]
      return team.id === original.id && team.label === original.label
    })

  function addTeam() {
    if (locked || atMax) return

    const team: Team = {
      id: crypto.randomUUID(),
      label: 'New team',
    }

    onChange([...teams, team])
    setFocusId(team.id)
  }

  function updateTeam(id: string, label: string) {
    onChange(teams.map((team) => (team.id === id ? { ...team, label } : team)))
  }

  function removeTeam(id: string) {
    if (locked || atMin) return
    onChange(teams.filter((team) => team.id !== id))
  }

  function shuffle() {
    if (locked || teams.length < 3) return
    onChange(shuffleTeams(teams))
  }

  return (
    <aside className="panel" aria-label="Teams">
      <div className="panel-head">
        <h2>Teams</h2>
        <span className="count">
          {teams.length}/{MAX_TEAMS}
        </span>
      </div>
      <p className="panel-hint">Edit the roster, then give it a spin.</p>

      <ul className="team-list">
        {teams.map((team, index) => (
          <li className="team-row" key={team.id}>
            <span
              className="team-dot"
              style={{
                background: gradientCss(gradientForIndex(index).stops),
              }}
              aria-hidden="true"
            />
            <input
              type="text"
              value={team.label}
              maxLength={22}
              disabled={locked}
              autoFocus={team.id === focusId}
              aria-label={`Team ${index + 1}`}
              onChange={(event) => updateTeam(team.id, event.target.value)}
              onBlur={() => {
                if (focusId === team.id) setFocusId(null)
              }}
            />
            <button
              type="button"
              className="remove"
              disabled={locked || atMin}
              aria-label={`Remove ${team.label.trim() || `team ${index + 1}`}`}
              onClick={() => removeTeam(team.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <div className="panel-actions">
        <button
          type="button"
          className="add-btn"
          disabled={locked || atMax}
          onClick={addTeam}
        >
          + Add team
        </button>
        <button
          type="button"
          className="icon-btn"
          disabled={locked || teams.length < 3}
          onClick={shuffle}
        >
          Shuffle
        </button>
        <button
          type="button"
          className="icon-btn"
          disabled={locked || isDefault}
          onClick={onReset}
        >
          Reset
        </button>
      </div>

      <p className="panel-note">
        {teams.length === 1
          ? 'Last team standing. Reset to run it back.'
          : 'Changes save automatically.'}
      </p>
    </aside>
  )
}
