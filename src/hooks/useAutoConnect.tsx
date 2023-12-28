import { useContext, useEffect } from 'react'
import { JwtPayload, jwtDecode } from 'jwt-decode'
import { AuthContext } from '../providers/AuthenticationProvider.js'
import { UseAutoConnect } from '../types.js'

export function useAutoConnect({ login, logout }: UseAutoConnect) {
  const { jwt, data, roles } = useContext(AuthContext)

  useEffect(() => {
    // No jwt stored
    if (!jwt) {
      logout()
      return
    }

    // We have an jwt
    const decoded: JwtPayload = jwtDecode(jwt)
    if (decoded?.exp) {
      // if is isValid
      if (new Date(decoded.exp * 1000).getTime() > Date.now()) {
        login({
          jwt: jwt,
          data: data,
          roles: roles,
        })
        return
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
