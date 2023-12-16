import React, { createContext, FC, useEffect } from 'react'

import {
  Authentication,
  AuthenticationProviderProps,
  SignInParams,
} from './types'
import { checkRefreshTokenValidity } from './utils/refresh'
import { useAuthenticationState } from './useAuthenticationState.js'
import { CookieStorageProvider } from './storage/CookieStorageProvider.js'
import { LocalStorageProvider } from './storage/LocalStorageProvider.js'

export const AuthContext = createContext<Authentication>({
  isAuthenticated: false,
  isLoading: true,
  isError: false,
  error: false,
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
  const { authentication, setAuthenticationValues } = useAuthenticationState()

  const currentStorageKey = storageKey || '_authentication'

  const storageProvider =
    storageType === 'cookie'
      ? new CookieStorageProvider(currentStorageKey)
      : new LocalStorageProvider(currentStorageKey)

  const signIn = async ({ accessToken, data }: SignInParams) => {
    await storageProvider.set({ accessToken, data })
    setAuthenticationValues({ accessToken, data, isAuthenticated: true })

    if (afterSignIn) afterSignIn()
  }

  const signOut = async () => {
    setAuthenticationValues({})
    await storageProvider.remove()

    if (afterSignOut) afterSignOut()
  }

  useEffect(() => {
    checkRefreshTokenValidity({
      storageProvider,
      setAuthenticationValues,
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
