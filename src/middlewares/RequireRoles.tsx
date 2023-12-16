import React, { useContext } from 'react'
import { AuthContext } from '../providers/AuthenticationProvider'
import { RequireRolesProps } from '../types.js'

export const RequireRoles = ({
  roles,
  children,
  fallBack = null,
}: RequireRolesProps) => {
  const { roles: userRoles } = useContext(AuthContext)

  // Check if the user has all the required roles
  const hasRequiredRoles = roles.every((role) => userRoles.includes(role))

  return hasRequiredRoles ? <>{children}</> : { fallBack }
}
