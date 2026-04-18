import { useLocation } from 'react-router-dom'
import PagePlaceholder from './PagePlaceholder'

function titleFromPath(pathname) {
  const tail = pathname.replace(/\/$/, '').split('/').filter(Boolean).pop()
  if (!tail) return 'Page'
  return tail.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function MirrorLegacyPage() {
  const { pathname } = useLocation()
  return (
    <PagePlaceholder
      title={titleFromPath(pathname)}
      legacyPath={pathname}
      description={`React route mirrors ${pathname}.`}
    />
  )
}
