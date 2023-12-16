# React Authentication

> **⚠️ Important Notice: This library is currently in beta, and its API is subject to change. It is not recommended for use in production environments at this stage.**

## Introduction

The primary goal of **React Authentication** is to store the access token and optional user data returned by the authentication API during the login process. By managing these critical pieces of authentication information, this package simplifies the process of guarding certain pages in your React app, ensuring that only authenticated users can access them.

## Installation

To install the package, use npm or yarn:

```sh
npm install @aoculi/react-authentication
# or
yarn add @aoculi/react-authentication
```

## AuthenticationProvider

A context provider that wraps your application or components where authentication state is needed.

```jsx
import { AuthenticationProvider } from '@aoculi/react-authentication'

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
import { useAuthentication } from '@aoculi/react-authentication'

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
    roles,
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
  roles: [
    /* all user roles */
  ],
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

### roles

Optionnal user roles returned by the sign-in process.

## Middlewares

### RequireAuth (require react-router-dom)

The RequireAuth component is used to protect routes that should only be accessible to authenticated users. If the user is not authenticated, they are redirected to a specified login or authentication route.

Props

- **redirectPath** (string): The path to redirect unauthenticated users to.
- **loader** (React component, optional): A loader component displayed while authentication status is being determined (e.g., during token validation).

Usage Example

```jsx
import { Routes, Route } from 'react-router-dom'
import { RequireAuth } from '@aoculi/react-authentication'
import Loader from './components/Loader'
import Home from './pages/Home'

function App() {
  return
    <Routes>
      <Route element={
        <RequireAuth redirectPath="/auth/login" loader={<Loader />} />}
      >
        <Route path="/" element={<Home />} />
      </Route>
    <Routes>
}
```

### RequireNoAuth (require react-router-dom)

The RequireNoAuth component is used to protect routes that should be accessible only to unauthenticated users, like login or sign-up pages. Authenticated users visiting these routes are redirected to a specified path.

Props

- **redirectPath** (string): The path to redirect authenticated users to.
- **loader** (React component, optional): A loader component displayed while authentication status is being determined.

Usage Example

```jsx
import { Routes, Route } from 'react-router-dom'
import { RequireAuth } from '@aoculi/react-authentication'
import Loader from './components/Loader'
import Login from './pages/Login'

function App() {
  return
    <Routes>
      <Route element={
        <RequireNoAuth redirectPath="/" loader={<Loader />} />}
      >
        <Route path="/auth/login" element={<Login />} />
      </Route>
    <Routes>
}
```

### RequireRoles

The RequireRoles component is used to guard specific routes or components, ensuring that only users with the specified roles can access them. If a user does not have all the required roles, a fallback component is rendered instead.

Props

- **roles** (array of strings): An array of roles required to access the component or route. Users must have all these roles to view the content.
- **children** (ReactNode): The content or components that are protected by the role check.
- **fallBack** (ReactNode, optional): A fallback component to render if the user does not have the required roles. Defaults to null.

Usage Example

```jsx
import { RequireRoles } from '@aoculi/react-authentication'
import AdminDashboard from './components/AdminDashboard'
import AccessDenied from './components/AccessDenied'

function Component() {
  return (
    <RequireRoles roles={['admin', 'editor']} fallBack={<AccessDenied />}>
      <AdminDashboard />
    </RequireRoles>
  )
}
```

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check issues page for open issues or to open a new issue.

## License

Distributed under the MIT License. See LICENSE for more information.

## Inspiration

- react-auth-kit
