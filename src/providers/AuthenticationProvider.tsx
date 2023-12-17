import React, { createContext, FC, useEffect } from 'react'

import {
  Authentication,
  AuthenticationProviderProps,
  SignInParams,
} from '../types'
import { useAuthenticationState } from '../hooks/useAuthenticationState'
import { CookieStorageProvider } from '../utils/storage/CookieStorageProvider'
import { LocalStorageProvider } from '../utils/storage/LocalStorageProvider'
import { refreshTokenManager } from '../utils/refreshTokenManager'

export const AuthContext = createContext<Authentication>({
  isAuthenticated: false,
  isLoading: true,
  isError: false,
  error: null,
  jwt: null,
  data: null,
  roles: [],
  permissions: [],
  signIn: async () => {},
  signOut: async () => {},
})

export const AuthenticationProvider: FC<AuthenticationProviderProps> = ({
  children,
  refreshToken,
  afterSignOut,
  afterSignIn,
  storageKey,
  storageType = 'localstorage',
}): JSX.Element => {
  const { authentication, login, logout, setError } = useAuthenticationState()

  const currentStorageKey = storageKey || '_authentication'

  const storageProvider =
    storageType === 'cookie'
      ? new CookieStorageProvider(currentStorageKey)
      : new LocalStorageProvider(currentStorageKey)

  const signIn = async ({ jwt, data, roles }: SignInParams) => {
    await storageProvider.set({ jwt, data })
    login({ jwt, data, roles })

    if (afterSignIn) afterSignIn()
  }

  const signOut = async () => {
    logout()
    await storageProvider.remove()

    if (afterSignOut) afterSignOut()
  }

  useEffect(() => {
    refreshTokenManager({
      storageProvider,
      login,
      logout,
      setError,
      refreshToken,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider value={{ ...authentication, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
