import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import MirrorLegacyPage from './components/MirrorLegacyPage'
import PagePlaceholder from './components/PagePlaceholder'
import HomePage from './pages/HomePage'
import ParliamentPage from './pages/ParliamentPage'
import CategoryHubPage from './pages/CategoryHubPage'
import './App.css'

const STATIC = [
  { path: 'faq', title: 'FAQ', legacy: '/faq' },
  { path: 'assembly', title: 'General Assembly', legacy: '/assembly' },
  { path: 'legal', title: 'Legal notice', legacy: '/legal' },
  { path: 'privacy', title: 'Privacy', legacy: '/privacy' },
  { path: 'rules', title: 'Rules', legacy: '/rules' },
  { path: 'disclaimer', title: 'Disclaimer', legacy: '/disclaimer' },
  { path: 'login', title: 'Login', legacy: '/login' },
  { path: 'changePassword', title: 'Change password', legacy: '/changePassword' },
  { path: 'test', title: 'Test', legacy: '/test' },
]

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        {STATIC.map(({ path, title, legacy }) => (
          <Route
            key={path}
            path={path}
            element={
              <PagePlaceholder title={title} legacyPath={legacy} />
            }
          />
        ))}
        <Route path="parliament" element={<ParliamentPage />} />
        <Route
          path="category/delegatec"
          element={
            <PagePlaceholder
              title="Delegation (category)"
              legacyPath="/category/delegatec"
            />
          }
        />
        <Route path="category/:type" element={<CategoryHubPage />} />
        <Route path="register/*" element={<MirrorLegacyPage />} />
        <Route path="profile/*" element={<MirrorLegacyPage />} />
        <Route path="user/*" element={<MirrorLegacyPage />} />
        <Route path="admin/*" element={<MirrorLegacyPage />} />
        <Route path="initiative/*" element={<MirrorLegacyPage />} />
        <Route path="otp/*" element={<MirrorLegacyPage />} />
        <Route path="resetting/*" element={<MirrorLegacyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
