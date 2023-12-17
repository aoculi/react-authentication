import { useContext } from 'react'

import { AuthContext } from '../providers/AuthenticationProvider'
import { Authentication } from '../types'

/**
 *
 * @returns Doooo something
 */
export function useAuthentication() {
  return useContext<Authentication>(AuthContext)
}
