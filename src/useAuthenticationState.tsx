import { useState } from 'react'
import { AuthenticationParams, SignInParams } from './types'

export function useAuthenticationState() {
  const [authentication, setAuthentication] = useState<AuthenticationParams>({
    isAuthenticated: false,
    isLoading: true,
    isError: false,
    error: null,
    accessToken: null,
    data: null,
  })

  const login = ({ accessToken, data }: SignInParams) => {
    setAuthentication({
      isAuthenticated: true,
      isLoading: false,
      isError: false,
      error: null,
      accessToken: accessToken || null,
      data,
    })
  }

  const logout = () => {
    setAuthentication({
      isAuthenticated: false,
      isLoading: false,
      isError: false,
      error: null,
      accessToken: null,
      data: null,
    })
  }

  const setError = (error: string) => {
    setAuthentication((prev) => ({
      ...prev,
      isError: true,
      error,
    }))
  }

  return { authentication, login, logout, setError }
}
