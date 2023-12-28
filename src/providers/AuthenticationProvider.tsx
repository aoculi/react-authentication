import React, { createContext, FC, useCallback, useEffect } from 'react'

import {
  Authentication,
  AuthenticationProviderProps,
  SignInParams,
  SignOutParams,
} from '../types'
import { useAuthenticationState } from '../hooks/useAuthenticationState'
// import { useRefreshToken } from '../hooks/useRefreshToken'
import { CookieStorageProvider } from '../utils/storage/CookieStorageProvider'
import { LocalStorageProvider } from '../utils/storage/LocalStorageProvider'
import { autoConnect } from '../utils/autoConnect'

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
  // refreshToken,
  storageKey,
  storageType = 'localstorage',
}): JSX.Element => {
  const { authentication, login, logout /*setError*/ } =
    useAuthenticationState()

  const currentStorageKey = storageKey || '_authentication'

  const storageProvider =
    storageType === 'cookie'
      ? new CookieStorageProvider(currentStorageKey)
      : new LocalStorageProvider(currentStorageKey)

  const signIn = async ({
    jwt,
    data,
    roles,
    permissions,
    afterSignIn,
  }: SignInParams) => {
    await storageProvider.set({ jwt, data, roles, permissions })
    login({ jwt, data, roles, permissions })

    if (afterSignIn) await afterSignIn()
  }

  const signOut = async (params?: SignOutParams) => {
    logout()
    await storageProvider.remove()

    if (params?.afterSignOut) await params.afterSignOut()
  }

  const authProviderValue = { ...authentication, signIn, signOut }

  const autoConnectCb = useCallback(async () => {
    const storageData = await storageProvider.get()
    autoConnect({ storageData, signOut, login })
  }, [])

  useEffect(() => {
    autoConnectCb()
  }, [autoConnectCb])

  // useRefreshToken({ refreshToken, signIn, signOut, setError })

  return (
    <AuthContext.Provider value={authProviderValue}>
      {children}
    </AuthContext.Provider>
  )
}
