import { useContext } from 'react'

import { AuthContext } from '../providers/AuthenticationProvider'
import { useAuthenticationState } from './useAuthenticationState'

export function usePermission() {
  const { roles, permissions } = useContext(AuthContext)
  const { setRole, setPermission } = useAuthenticationState()

  const hasRoles = (currentRoles: string[]): Boolean => {
    if (!roles?.length) return false

    return roles.every((role) => currentRoles.includes(role))
  }

  const hasPermissions = (currentPermissions: string[]): Boolean => {
    if (!permissions?.length) return false

    return permissions.every((permission) =>
      currentPermissions.includes(permission),
    )
  }

  const assignRole = (role: string): Boolean => {
    if (hasRoles([role])) return false

    setRole(role)
    return true
  }

  const givePermissionTo = (permission: string): Boolean => {
    if (hasPermissions([permission])) return false

    setPermission(permission)
    return true
  }

  return { hasRoles, hasPermissions, assignRole, givePermissionTo }
}
