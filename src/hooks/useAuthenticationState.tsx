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
    permissions: [],
  })

  const login = ({ jwt, data, roles, permissions }: SignInParams) => {
    setAuthentication({
      isAuthenticated: true,
      isLoading: false,
      isError: false,
      error: null,
      jwt: jwt || null,
      data,
      roles: roles || [],
      permissions: permissions || [],
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
      permissions: [],
    })
  }

  const setError = (error: string) => {
    setAuthentication((prev) => ({
      ...prev,
      isError: true,
      error,
    }))
  }

  const setRole = (role: string) => {
    setAuthentication((prev) => ({
      ...prev,
      roles: [...prev.roles, role],
    }))
  }

  const setPermission = (permission: string) => {
    setAuthentication((prev) => ({
      ...prev,
      permissions: [...prev.permissions, permission],
    }))
  }

  return { authentication, login, logout, setError, setRole, setPermission }
}
