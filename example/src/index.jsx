/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { AuthenticationProvider } from '@aoculi/react-authentication'
import {
  useAuthentication,
  RequireAuth,
  RequireNoAuth,
  RequirePermissions,
} from '@aoculi/react-authentication'

function App() {
  return (
    <AuthenticationProvider
      storageKey="jwt-accessToken"
      refreshToken={async () => {
        return 'xxxxxxx-xxxx-xxxxxx-xxx'
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route
            element={<RequireNoAuth redirectPath="/" loader={<Loader />} />}
          >
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route
            element={<RequireAuth redirectPath="/login" loader={<Loader />} />}
          >
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthenticationProvider>
  )
}

function Home() {
  const { signOut } = useAuthentication()

  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => signOut()}>Logout</button>
      <div>
        <RequirePermissions
          roles={['editor']}
          permissions={['delete articles']}
          fallBack={<AccessDenied />}
        >
          Editor dashboard
        </RequirePermissions>

        <RequirePermissions
          roles={['admin']}
          permissions={['delete articles']}
          fallBack={<AccessDenied />}
        >
          Admin dashboard
        </RequirePermissions>
      </div>
    </div>
  )
}

function LoginPage() {
  const { signIn } = useAuthentication()

  const onLogin = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)

    /* ... Get response from API ... */
    const response = {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      username: 'John Doe',
      roles: ['editor'],
      permissions: ['write articles', 'delete articles'],
    }

    signIn({
      jwt: response.accessToken,
      data: { username: response.username },
      roles: response.roles,
      permissions: response.permissions,
    })
  }

  return (
    <div>
      <h1>Login</h1>
      <div>
        <form onSubmit={onLogin}>
          <input name="email" type="email" />
          <input name="password" type="password" />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  )
}

function Loader() {
  return <div>Loading...</div>
}

function AccessDenied() {
  return <div>Access Restricted</div>
}

const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement).render(<App />)
