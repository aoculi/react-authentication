import { useState } from 'react'
import { AuthenticationParams, SignInParams } from '../types'

export function useAuthenticationState() {
  const [authentication, setAuthentication] = useState<AuthenticationParams>({
    isAuthenticated: false,
    isLoading: true,
    isError: false,
    error: null,
    jwt: null,
    data: null,
    roles: [],
  })

  const login = ({ jwt, data, roles }: SignInParams) => {
    setAuthentication({
      isAuthenticated: true,
      isLoading: false,
      isError: false,
      error: null,
      jwt: jwt || null,
      data,
      roles: roles || [],
    })
  }

  const logout = () => {
    setAuthentication({
      isAuthenticated: false,
      isLoading: false,
      isError: false,
      error: null,
      jwt: null,
      data: null,
      roles: [],
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
