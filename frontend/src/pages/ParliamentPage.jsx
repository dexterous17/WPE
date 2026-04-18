import { useEffect, useState } from 'react'
import { symfonyUrl } from '../config/symfonyLegacy'

export default function ParliamentPage() {
  const [rows, setRows] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/v1/parliament/members?max=100')
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return
        if (j.success && Array.isArray(j.data)) setRows(j.data)
        else setErr(j.message || 'Unexpected response')
      })
      .catch((e) => {
        if (!cancelled) setErr(e instanceof Error ? e.message : 'Request failed')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <article className="parliament-page">
      <h1>Virtual Parliament</h1>
      <p className="lead">
        The &quot;Virtual Parliament&quot; consists of the TOP 600 global citizens with the highest
        delegation score. Below is a tabular view from the Node API (the classic Twig page also
        renders a circular layout).
      </p>

      {err ? <p className="error">{err}</p> : null}
      {!err && rows === null ? <p>Loading members…</p> : null}
      {rows && rows.length === 0 ? <p>No members returned.</p> : null}
      {rows && rows.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id ?? i}>
                <td>{i + 1}</td>
                <td>{r.username ?? '—'}</td>
                <td>{r.score ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      <p className="classic-link">
        <a href={symfonyUrl('/parliament')}>Open classic parliament page (full Twig layout)</a>
      </p>
    </article>
  )
}
