import { NavLink, Outlet } from 'react-router-dom'

const navClass = ({ isActive }) => (isActive ? 'active' : undefined)

export default function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink to="/" className="brand" end>
          WPE
        </NavLink>
        <nav className="primary-nav" aria-label="Primary">
          <NavLink to="/" className={navClass} end>
            Home
          </NavLink>
          <span className="nav-group">
            <NavLink to="/category/future" className={navClass}>
              Future
            </NavLink>
            <NavLink to="/category/current" className={navClass}>
              Current
            </NavLink>
            <NavLink to="/category/program" className={navClass}>
              Program
            </NavLink>
            <NavLink to="/category/past" className={navClass}>
              Past
            </NavLink>
          </span>
          <span className="nav-group">
            <NavLink to="/assembly" className={navClass}>
              Assembly
            </NavLink>
            <NavLink to="/parliament" className={navClass}>
              Parliament
            </NavLink>
            <NavLink to="/faq" className={navClass}>
              FAQ
            </NavLink>
          </span>
          <span className="nav-group">
            <NavLink to="/legal" className={navClass}>
              Legal
            </NavLink>
            <NavLink to="/privacy" className={navClass}>
              Privacy
            </NavLink>
            <NavLink to="/rules" className={navClass}>
              Rules
            </NavLink>
            <NavLink to="/disclaimer" className={navClass}>
              Disclaimer
            </NavLink>
          </span>
          <span className="nav-group">
            <NavLink to="/login" className={navClass}>
              Login
            </NavLink>
            <NavLink to="/register" className={navClass}>
              Register
            </NavLink>
          </span>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>
          React migration shell — set <code>VITE_SYMFONY_ORIGIN</code> in dev so
          “classic” links reach Symfony.
        </p>
      </footer>
    </div>
  )
}
