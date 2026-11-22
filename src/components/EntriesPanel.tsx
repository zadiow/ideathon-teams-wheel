import { useState } from 'react'
import {
  DEFAULT_ENTRIES,
  gradientCss,
  gradientForIndex,
  MAX_ENTRIES,
  MIN_ENTRIES,
  type Entry,
} from '../data/entries'
import './EntriesPanel.css'

type EntriesPanelProps = {
  entries: Entry[]
  onChange: (entries: Entry[]) => void
  locked: boolean
}

function shuffleEntries(entries: Entry[]) {
  const next = [...entries]

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swap]] = [next[swap], next[index]]
  }

  return next
}

export default function EntriesPanel({
  entries,
  onChange,
  locked,
}: EntriesPanelProps) {
  const [focusId, setFocusId] = useState<string | null>(null)

  const atMax = entries.length >= MAX_ENTRIES
  const atMin = entries.length <= MIN_ENTRIES
  const isDefault =
    entries.length === DEFAULT_ENTRIES.length &&
    entries.every((entry, index) => {
      const original = DEFAULT_ENTRIES[index]
      return entry.id === original.id && entry.label === original.label
    })

  function addEntry() {
    if (locked || atMax) return

    const entry: Entry = {
      id: crypto.randomUUID(),
      label: `Option ${entries.length + 1}`,
    }

    onChange([...entries, entry])
    setFocusId(entry.id)
  }

  function updateEntry(id: string, label: string) {
    onChange(
      entries.map((entry) => (entry.id === id ? { ...entry, label } : entry)),
    )
  }

  function removeEntry(id: string) {
    if (locked || atMin) return
    onChange(entries.filter((entry) => entry.id !== id))
  }

  function shuffle() {
    if (locked || entries.length < 3) return
    onChange(shuffleEntries(entries))
  }

  function resetEntries() {
    if (locked) return
    onChange(DEFAULT_ENTRIES.map((entry) => ({ ...entry })))
  }

  return (
    <aside className="panel" aria-label="Wheel entries">
      <div className="panel-head">
        <h2>Entries</h2>
        <span className="count">
          {entries.length}/{MAX_ENTRIES}
        </span>
      </div>
      <p className="panel-hint">Edit the list, then give it a spin.</p>

      <ul className="entry-list">
        {entries.map((entry, index) => (
          <li className="entry" key={entry.id}>
            <span
              className="dot"
              style={{
                background: gradientCss(gradientForIndex(index).stops),
              }}
              aria-hidden="true"
            />
            <input
              type="text"
              value={entry.label}
              maxLength={22}
              disabled={locked}
              autoFocus={entry.id === focusId}
              aria-label={`Option ${index + 1}`}
              onChange={(event) => updateEntry(entry.id, event.target.value)}
              onBlur={() => {
                if (focusId === entry.id) setFocusId(null)
              }}
            />
            <button
              type="button"
              className="remove"
              disabled={locked || atMin}
              aria-label={`Remove ${entry.label.trim() || `option ${index + 1}`}`}
              onClick={() => removeEntry(entry.id)}
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
          onClick={addEntry}
        >
          + Add entry
        </button>
        <button
          type="button"
          className="icon-btn"
          disabled={locked || entries.length < 3}
          onClick={shuffle}
        >
          Shuffle
        </button>
        <button
          type="button"
          className="icon-btn"
          disabled={locked || isDefault}
          onClick={resetEntries}
        >
          Reset
        </button>
      </div>

      <p className="panel-note">Changes save automatically in this browser.</p>
    </aside>
  )
}
