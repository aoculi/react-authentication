import React, { createContext, FC, useEffect } from 'react'

import {
  Authentication,
  AuthenticationProviderProps,
  SignInParams,
} from './types'
import { useAuthenticationState } from './useAuthenticationState'
import { CookieStorageProvider } from './storage/CookieStorageProvider'
import { LocalStorageProvider } from './storage/LocalStorageProvider'
import { accessTokenManager } from './accessTokenManager'

export const AuthContext = createContext<Authentication>({
  isAuthenticated: false,
  isLoading: true,
  isError: false,
  error: null,
  accessToken: null,
  data: null,
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

  const signIn = async ({ accessToken, data }: SignInParams) => {
    await storageProvider.set({ accessToken, data })
    login({ accessToken, data })

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
