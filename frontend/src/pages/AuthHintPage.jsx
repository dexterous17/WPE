import PagePlaceholder from '../components/PagePlaceholder'

export function LoginHintPage() {
  return (
    <PagePlaceholder
      title="Login"
      legacyPath="/login"
      description="Session-based authentication is still handled by the Symfony app. Use the classic login page to sign in; after migration, this route can host a React login form."
    />
  )
}

export function ChangePasswordHintPage() {
  return (
    <PagePlaceholder
      title="Change password"
      legacyPath="/changePassword"
      description="Password changes require an authenticated Symfony session. Open the classic site when you are logged in."
    />
  )
}

export function TestPage() {
  return (
    <PagePlaceholder
      title="Test"
      legacyPath="/test"
      description="Development route in Symfony; no dedicated React content."
    />
  )
}
