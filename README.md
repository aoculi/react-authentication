# react authentication

## Introduction

React Authentication offers a straightforward and efficient way to handle user authentication in your React applications. The primary goal of this package is to store the access token and optional user data returned by the authentication API during the login process. By managing these critical pieces of authentication information, React Authentication simplifies the process of guarding certain pages in your React app, ensuring that only authenticated users can access them.

## Installation

To install the package, use npm or yarn:

```sh
npm install react-authentication
# or
yarn add react-authentication
```

## AuthenticationProvider

A context provider that wraps your application or components where authentication state is needed.

```jsx
import { AuthenticationProvider } from 'react-authentication'

function App() {
  return (
    <AuthenticationProvider>
      {/* Your application components */}
    </AuthenticationProvider>
  )
}
```

Optionnal props:

- refreshToken: Token refresh logic
- afterSignIn: Post-sign-in logic
- afterSignOut: Post-sign-out logic
- storageKey:

## useAuthentication

Within any component wrapped by AuthenticationProvider, you can use the useAuthentication hook to access the authentication state and control methods.

```jsx
import { useAuthentication } from 'react-authentication'

function YourComponent() {
  const { isAuthenticated, isLoading, signIn, signOut } = useAuthentication()
}
```

### Signing

Call this method with an object containing accessToken and any additional data you need to store.

```javascript
signIn({
  accessToken: 'your_access_token',
  data: {
    /* additional data */
  },
})
```

### Signout

This method, which requires no parameters, clears the authentication state.

```javascript
signOut()
```

## Guard

This package doesn't include middleware for route protection, but you can utilize the provided methods to implement such functionality.

```jsx
import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthentication } from 'react-authentication'

export function RequireAuth({ redirectPath }) {
  const location = useLocation()
  const { isLoading, isAuthenticated } = useAuthentication()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated)
    return <Navigate to={redirectPath} state={{ from: location }} replace />

  return <Outlet />
}

export function RequireNoAuth({ redirectPath }) {
  const { isLoading, isAuthenticated } = useAuthentication()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <Outlet />

  return <Navigate to={redirectPath} replace />
}
```

And use it in your app file:

```jsx
function App() {
  return (
    <Routes>
      <Route element={<RequireAuth redirectPath={'/auth/login'} />}>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Route>

      <Route element={<RequireNoAuth redirectPath={'/'} />}>
        <Route path="/auth/login" element={<Login />} />
      </Route>
    </Routes>
  )
}
```

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check issues page for open issues or to open a new issue.

## License

Distributed under the MIT License. See LICENSE for more information.

## Inspiration

- react-auth-kit
