import { symfonyUrl } from '../config/symfonyLegacy'

export default function PagePlaceholder({
  title,
  description,
  legacyPath,
  children,
}) {
  const href = symfonyUrl(legacyPath)
  return (
    <article className="page-placeholder">
      <h1>{title}</h1>
      {description ? <p className="lead">{description}</p> : null}
      <p className="migration-note">
        This URL is handled in the React shell during the Symfony → React migration.
        Forms, sessions, and server-rendered content still live on the classic site
        until each area has APIs and UI ported here.
      </p>
      <p>
        <a className="button primary" href={href}>
          Open classic Symfony page
        </a>
      </p>
      {children}
    </article>
  )
}
