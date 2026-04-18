/**
 * Static marketing / legal pages migrated from Twig (default-content style, simplified).
 */
export default function ContentPage({ title, children }) {
  return (
    <article className="content-page">
      <header className="content-page-header">
        <h1>{title}</h1>
      </header>
      <div className="content-page-body">{children}</div>
    </article>
  )
}
