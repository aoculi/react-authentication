import { useState } from 'react'
import { AuthenticationParams, setAuthenticationValues } from './types'

export function useAuthenticationState() {
  const [authentication, setAuthentication] = useState<AuthenticationParams>({
    isAuthenticated: false,
    isLoading: true,
    isError: false,
    error: false,
    accessToken: null,
    data: null,
  })

  const setAuthenticationValues = ({
    error = false,
    isAuthenticated = false,
    accessToken = null,
    data = null,
  }: setAuthenticationValues) =>
    setAuthentication({
      isAuthenticated,
      isLoading: false,
      isError: false,
      error,
      accessToken,
      data,
    })

  return { authentication, setAuthenticationValues }
}
