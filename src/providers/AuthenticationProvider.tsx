import React, { createContext, FC, useEffect } from 'react'

import {
  Authentication,
  AuthenticationProviderProps,
  SignInParams,
} from '../types'
import { useAuthenticationState } from '../hooks/useAuthenticationState'
import { CookieStorageProvider } from '../utils/storage/CookieStorageProvider'
import { LocalStorageProvider } from '../utils/storage/LocalStorageProvider'
import { accessTokenManager } from '../utils/accessTokenManager'

export const AuthContext = createContext<Authentication>({
  isAuthenticated: false,
  isLoading: true,
  isError: false,
  error: null,
  accessToken: null,
  data: null,
  roles: [],
  signIn: async () => {},
  signOut: async () => {},
})

export const AuthenticationProvider: FC<AuthenticationProviderProps> = ({
  children,
  refreshToken,
  afterSignOut,
  afterSignIn,
  storageKey,
  storageType,
}): JSX.Element => {
  const { authentication, login, logout, setError } = useAuthenticationState()

  const currentStorageKey = storageKey || '_authentication'

  const storageProvider =
    storageType === 'cookie'
      ? new CookieStorageProvider(currentStorageKey)
      : new LocalStorageProvider(currentStorageKey)

  const signIn = async ({ accessToken, data, roles }: SignInParams) => {
    await storageProvider.set({ accessToken, data })
    login({ accessToken, data, roles })

    if (afterSignIn) afterSignIn()
  }

  const signOut = async () => {
    logout()
    await storageProvider.remove()

    if (afterSignOut) afterSignOut()
  }

  useEffect(() => {
    accessTokenManager({
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
