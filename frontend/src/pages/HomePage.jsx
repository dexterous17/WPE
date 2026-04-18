import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const [apiOk, setApiOk] = useState(null)

  useEffect(() => {
    fetch('/api/v1/health')
      .then((r) => r.json())
      .then((j) => setApiOk(Boolean(j.ok)))
      .catch(() => setApiOk(false))
  }, [])

  return (
    <article className="home-page">
      <h1>The World Parliament Experiment</h1>
      <p className="lead">
        A Global Polity for the Citizens of the World — React shell (Twig pages are
        being migrated incrementally).
      </p>
      <p className="api-status">
        Node API <code>/api/v1/health</code>:{' '}
        {apiOk === null ? '…' : apiOk ? 'OK' : 'unreachable (start backend + Vite proxy)'}
      </p>
      <section className="link-grid">
        <h2>Browse in React</h2>
        <ul>
          <li>
            <Link to="/category/future">Future initiatives</Link>
          </li>
          <li>
            <Link to="/category/current">Ongoing votes</Link>
          </li>
          <li>
            <Link to="/category/program">Program</Link>
          </li>
          <li>
            <Link to="/category/past">Past</Link>
          </li>
          <li>
            <Link to="/assembly">General Assembly</Link>
          </li>
          <li>
            <Link to="/parliament">Parliament (live members from API)</Link>
          </li>
          <li>
            <Link to="/faq">FAQ</Link>
          </li>
        </ul>
      </section>
    </article>
  )
}
