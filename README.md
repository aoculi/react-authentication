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

### Optional Props

The AuthenticationProvider component accepts several optional props to customize its behavior and functionality:

- **refreshToken**: A function that contains the logic for refreshing the authentication token. This is invoked when the token needs to be refreshed, such as when it's nearing expiration.

- **afterSignIn**: A function that is executed after the sign-in process completes successfully. Use this to implement any logic that should run immediately after a user signs in.

- **afterSignOut**: A function that is called following a successful sign-out. This can be used to perform cleanup tasks or redirect the user after they log out.

- **storageKey**: A string specifying the name of the key under which authentication-related information will be stored. The default value is \_authentication. This is useful if you need to customize the storage key, for instance, to avoid conflicts with other items in storage.

- **storageType**: Defines the type of storage mechanism to be used for persisting authentication data. The options are 'localstorage' and 'cookie'. The default is 'localstorage'. Choose 'cookie' if you require cookie-based storage, such as for server-side rendering scenarios or for additional security configurations that cookies allow.

## useAuthentication

Within any component wrapped by AuthenticationProvider, you can use the useAuthentication hook to access the authentication state and control methods.

```jsx
import { useAuthentication } from 'react-authentication'

function YourComponent() {
  const {
    signIn,
    signOut,
    isAuthenticated,
    isLoading,
    isError,
    error,
    accessToken,
    data,
  } = useAuthentication()
}
```

### signing

Call this method with an object containing accessToken and any additional data you need to store.

```javascript
signIn({
  accessToken: 'your_access_token',
  data: {
    /* additional data */
  },
})
```

### signout

This method, which requires no parameters, clears the authentication state.

```javascript
signOut()
```

### isAuthenticated

A boolean flag that represents the user's authentication status in your application. When isAuthenticated is true, it indicates that the user is currently authenticated, meaning they have successfully logged in or have a valid accesToken.

### isLoading

Indicates whether the authentication process is in progress. This is particularly useful for handling UI states in your application, such as displaying loading indicators or disabling certain elements while the authentication status is being determined.

For example, you can use isLoading to show a spinner on your login page or to prevent user interaction with parts of your application until the authentication process has completed [cf: Guard code below](#guard).

### isError

If an error arises while attempting to refresh the token—such as network issues, invalid credentials, or expired tokens—this flag is set to true. This allows you to respond appropriately, for instance, by alerting the user, redirecting to a login page, or attempting a re-authentication.

### error

The error message that appears in case of an error occurrence.

### accesToken

The token value returned by the sign-in process.

### data

Optionnal data returned by the sign-in process.

## Middleware (with react-router-dom)

This package does not come with built-in middleware for protecting routes, however, you can leverage its provided methods to achieve this functionality.

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
