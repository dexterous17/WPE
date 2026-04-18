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
      <section className="home-hero">
        <h1>The World Parliament Experiment</h1>
        <p className="tagline">A Global Polity for the Citizens of the World</p>
        <p className="lead">
          Global democracy is possible if you take part. Create political proposals, discuss
          initiatives, and vote — this React build is the front-end migration path alongside the
          existing Symfony site.
        </p>
        <p>
          <Link to="/login">Log in</Link> or <Link to="/register">create an account</Link> on the
          classic site when flows still require a PHP session. Explore migrated public pages below.
        </p>
      </section>

      <p className="api-status">
        Node API <code>/api/v1/health</code>:{' '}
        {apiOk === null ? '…' : apiOk ? 'OK' : 'unreachable (start backend + Vite proxy)'}
      </p>

      <section className="link-grid">
        <h2>Public pages in React</h2>
        <ul>
          <li>
            <Link to="/faq">FAQ / help</Link>
          </li>
          <li>
            <Link to="/rules">Rules</Link>
          </li>
          <li>
            <Link to="/legal">Legal notice</Link>
          </li>
          <li>
            <Link to="/privacy">Privacy</Link>
          </li>
          <li>
            <Link to="/disclaimer">Disclaimer (beta)</Link>
          </li>
          <li>
            <Link to="/assembly">General Assembly (member directory)</Link>
          </li>
          <li>
            <Link to="/parliament">Virtual Parliament (delegation scores)</Link>
          </li>
        </ul>
        <h2>Initiative hubs</h2>
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
        </ul>
      </section>
    </article>
  )
}
