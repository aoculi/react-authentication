import { useContext } from 'react'

import { AuthContext } from './AuthenticationProvider'
import { Authentication } from './types.js'

/**
 *
 * @returns Doooo something
 */
export function useAuthentication() {
  return useContext<Authentication>(AuthContext)
}
