import { useParams } from 'react-router-dom'
import PagePlaceholder from '../components/PagePlaceholder'

/**
 * Symfony: /category/{type}/{id}/{slug} — initiative list + detail within category.
 * Listing and AJAX search remain on the classic site until a public JSON API exists.
 */
export default function CategoryInitiativePage() {
  const { type, id, slug } = useParams()
  const legacyPath = `/category/${type}/${id}/${slug}`
  return (
    <PagePlaceholder
      title="Category initiative"
      legacyPath={legacyPath}
      description={`React route for ${legacyPath}. Initiative cards, sorting, and DataTables still use Twig and jQuery on the classic site.`}
    />
  )
}
