import React, { createContext, FC, useEffect } from 'react'

import {
  Authentication,
  AuthenticationProviderProps,
  SignInParams,
} from './types'
import { setStorage, removeStorage } from './utils/storage'
import { checkRefreshTokenValidity } from './utils/refresh'
import { useAuthenticationState } from './useAuthenticationState.js'

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
}): JSX.Element => {
  const { authentication, setAuthenticationValues } = useAuthenticationState()

  const currentStorageKey = storageKey || 'authenticate'

  const signIn = async ({ accessToken, data }: SignInParams) => {
    await setStorage(currentStorageKey, { accessToken, data })
    setAuthenticationValues({ accessToken, data, isAuthenticated: true })

    if (afterSignIn) afterSignIn()
  }

  const signOut = async () => {
    setAuthenticationValues({})
    await removeStorage(currentStorageKey)

    if (afterSignOut) afterSignOut()
  }

  useEffect(() => {
    checkRefreshTokenValidity({
      key: currentStorageKey,
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
