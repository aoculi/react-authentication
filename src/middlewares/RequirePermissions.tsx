import React, { useContext } from 'react'

import { AuthContext } from '../providers/AuthenticationProvider'
import { RequirePermissionsProps } from '../types'

export const RequirePermissions = ({
  roles = [],
  permissions = [],
  children,
  fallBack = null,
}: RequirePermissionsProps) => {
  const { roles: userRoles, permissions: userPermissions } =
    useContext(AuthContext)

  // Check if the user has all the required roles, if roles are specified
  const hasRequiredRoles =
    roles.length === 0 || roles.every((role) => userRoles.includes(role))

  // Check if the user has all the required permissions, if permissions are specified
  const hasRequiredPermissions =
    permissions.length === 0 ||
    permissions.every((permission) => userPermissions.includes(permission))

  // Render children only if user has all required roles and permissions
  const canAccess = hasRequiredRoles && hasRequiredPermissions

  return canAccess ? <>{children}</> : <>{fallBack}</>
}
