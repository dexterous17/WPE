import { useParams } from 'react-router-dom'
import PagePlaceholder from '../components/PagePlaceholder'

const VALID = new Set(['future', 'current', 'past', 'program'])

const labels = {
  future: 'Future initiatives',
  current: 'Ongoing votes',
  program: 'Program',
  past: 'Past initiatives',
}

export default function CategoryHubPage() {
  const { type } = useParams()
  if (!VALID.has(type)) {
    return (
      <PagePlaceholder
        title="Category"
        legacyPath={`/category/${type}`}
        description="This segment is not one of future / current / past / program. Use the classic site for this URL."
      />
    )
  }
  const title = labels[type]
  const legacyPath = `/category/${type}`
  return (
    <PagePlaceholder
      title={title}
      legacyPath={legacyPath}
      description="Listing, filters, and DataTables behaviour still use the Symfony Twig templates."
    />
  )
}
