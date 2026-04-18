import ContentPage from '../components/ContentPage'

export default function LegalPage() {
  return (
    <ContentPage title="Legal notice">
      <p className="legal-lead">Information according to § 5 TMG in Germany</p>
      <p className="legal-lead">Responsible according to § 55 Abs. 2 RStV in Germany</p>

      <h2>Address</h2>
      <address>
        World Parliament Experiment e. V.
        <br />
        c/o Tenbergen
        <br />
        Friedbergstraße 25
        <br />
        D-14057 Berlin
      </address>

      <h2>Web</h2>
      <p>
        <a href="https://www.world-parliament.org" target="_blank" rel="noreferrer">
          www.world-parliament.org
        </a>
      </p>

      <h2>Email</h2>
      <p>
        <a href="mailto:team@world-parliament.org">team@world-parliament.org</a>
      </p>

      <h2>Phone</h2>
      <p>(+49) 0177-2853738</p>
    </ContentPage>
  )
}
