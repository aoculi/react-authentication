import React, { useContext } from 'react'

import { AuthContext } from '../providers/AuthenticationProvider'
import { RequirePermissionsProps } from '../types'

export const RequirePermissions = ({
  roles,
  children,
  fallBack = null,
}: RequirePermissionsProps) => {
  const { roles: userRoles } = useContext(AuthContext)

  // Check if the user has all the required roles
  const hasRequiredRoles = roles.every((role) => userRoles.includes(role))

  return hasRequiredRoles ? <>{children}</> : { fallBack }
}
