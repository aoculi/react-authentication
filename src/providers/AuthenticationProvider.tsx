import React, { createContext, FC } from 'react'

import {
  Authentication,
  AuthenticationProviderProps,
  SignInParams,
  SignOutParams,
} from '../types'
import { useAuthenticationState } from '../hooks/useAuthenticationState'
import { useRefreshToken } from '../hooks/useRefreshToken'
import { useAutoConnect } from '../hooks/useAutoCOnnect.js'
import { CookieStorageProvider } from '../utils/storage/CookieStorageProvider'
import { LocalStorageProvider } from '../utils/storage/LocalStorageProvider'

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
  storageKey,
  storageType = 'localstorage',
}): JSX.Element => {
  const { authentication, login, logout, setError } = useAuthenticationState()

  const currentStorageKey = storageKey || '_authentication'

  const storageProvider =
    storageType === 'cookie'
      ? new CookieStorageProvider(currentStorageKey)
      : new LocalStorageProvider(currentStorageKey)

  const signIn = async ({ jwt, data, roles, afterSignIn }: SignInParams) => {
    await storageProvider.set({ jwt, data })
    login({ jwt, data, roles })

    if (afterSignIn) await afterSignIn()
  }

  const signOut = async (params?: SignOutParams) => {
    logout()
    await storageProvider.remove()

    if (params?.afterSignOut) await params.afterSignOut()
  }

  useRefreshToken({ refreshToken, signIn, signOut, setError })
  useAutoConnect({ login, logout })

  return (
    <AuthContext.Provider value={{ ...authentication, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
