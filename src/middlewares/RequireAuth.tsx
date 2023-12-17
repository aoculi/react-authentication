import React, { useContext } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { AuthContext } from '../providers/AuthenticationProvider'
import { RequireAuthProps } from '../types'

export function RequireAuth({ redirectPath, loader }: RequireAuthProps) {
  const location = useLocation()
  const { isLoading, isAuthenticated } = useContext(AuthContext)

  if (isLoading) return loader ? <>{loader}</> : null
  if (!isAuthenticated)
    return <Navigate to={redirectPath} state={{ from: location }} replace />

  return <Outlet />
}

export function RequireNoAuth({ redirectPath, loader }: RequireAuthProps) {
  const { isLoading, isAuthenticated } = useContext(AuthContext)

  if (isLoading) return loader ? <>{loader}</> : null
  if (!isAuthenticated) return <Outlet />

  return <Navigate to={redirectPath} replace />
}
