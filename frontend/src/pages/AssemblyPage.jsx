import { useEffect, useState } from 'react'
import { symfonyUrl } from '../config/symfonyLegacy'

function buildAssemblyBody({ draw, start, length, search }) {
  return {
    draw,
    start,
    length,
    search: { value: search },
    columns: [
      { data: 'id' },
      { data: 'username' },
      { data: 'country' },
      { data: 'city' },
      { data: 'registeredAt' },
    ],
    order: [{ column: 1, dir: 'asc' }],
  }
}

export default function AssemblyPage() {
  const [search, setSearch] = useState('')
  const [applied, setApplied] = useState('')
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState({ recordsTotal: 0, recordsFiltered: 0 })
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  useEffect(() => {
    let cancelled = false
    const body = buildAssemblyBody({
      draw: 1,
      start: 0,
      length: 100,
      search: applied,
    })
    fetch('/api/v1/assembly/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return
        if (j.error) {
          setErr(String(j.error))
          setRows([])
          return
        }
        setErr(null)
        setRows(Array.isArray(j.items) ? j.items : [])
        setMeta({
          recordsTotal: j.recordsTotal ?? 0,
          recordsFiltered: j.recordsFiltered ?? 0,
        })
      })
      .catch((e) => {
        if (!cancelled) {
          setErr(e instanceof Error ? e.message : 'Request failed')
          setRows([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [applied])

  const onSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setApplied(search)
  }

  return (
    <article className="assembly-page">
      <h1>General Assembly</h1>
      <p className="lead">
        Registered participants (first page, up to 100 rows). Data from{' '}
        <code>/api/v1/assembly/search</code> using the same payload shape as the legacy DataTables
        integration.
      </p>

      <form className="assembly-search" onSubmit={onSubmit} role="search">
        <label htmlFor="assembly-q">Filter by name or city</label>
        <div className="assembly-search-row">
          <input
            id="assembly-q"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            autoComplete="off"
          />
          <button type="submit">Search</button>
        </div>
      </form>

      {!loading ? (
        applied ? (
          <p className="muted">
            Showing results for <strong>{applied}</strong> — {meta.recordsFiltered} of{' '}
            {meta.recordsTotal} users.
          </p>
        ) : (
          <p className="muted">
            {meta.recordsFiltered} enabled users (total in directory: {meta.recordsTotal}).
          </p>
        )
      ) : null}

      {err ? <p className="error">{err}</p> : null}
      {loading ? <p>Loading…</p> : null}

      {!loading && !err && rows.length === 0 ? <p>No rows returned.</p> : null}

      {!loading && rows.length > 0 ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Country</th>
                <th>City</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username ?? '—'}</td>
                  <td>{u.country ?? '—'}</td>
                  <td>{u.city ?? '—'}</td>
                  <td>{u.registeredAt ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <p className="classic-link">
        <a href={symfonyUrl('/assembly')}>Open classic General Assembly (DataTables UI)</a>
      </p>
    </article>
  )
}
