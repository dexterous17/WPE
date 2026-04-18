import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import MirrorLegacyPage from './components/MirrorLegacyPage'
import PagePlaceholder from './components/PagePlaceholder'
import HomePage from './pages/HomePage'
import ParliamentPage from './pages/ParliamentPage'
import CategoryHubPage from './pages/CategoryHubPage'
import CategoryInitiativePage from './pages/CategoryInitiativePage'
import AssemblyPage from './pages/AssemblyPage'
import FaqPage from './pages/FaqPage'
import LegalPage from './pages/LegalPage'
import PrivacyPage from './pages/PrivacyPage'
import RulesPage from './pages/RulesPage'
import DisclaimerPage from './pages/DisclaimerPage'
import {
  ChangePasswordHintPage,
  LoginHintPage,
  TestPage,
} from './pages/AuthHintPage'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="legal" element={<LegalPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="rules" element={<RulesPage />} />
        <Route path="disclaimer" element={<DisclaimerPage />} />
        <Route path="assembly" element={<AssemblyPage />} />
        <Route path="login" element={<LoginHintPage />} />
        <Route path="changePassword" element={<ChangePasswordHintPage />} />
        <Route path="test" element={<TestPage />} />
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
        <Route
          path="category/:type/:id/:slug"
          element={<CategoryInitiativePage />}
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
