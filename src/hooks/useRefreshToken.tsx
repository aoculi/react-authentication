import { useContext, useEffect } from 'react'
import { jwtDecode, JwtPayload } from 'jwt-decode'
import { AuthContext } from '../providers/AuthenticationProvider'
import { UseRefreshToken } from '../types.js'

export function useRefreshToken({
  refreshToken,
  signIn,
  signOut,
  setError,
}: UseRefreshToken) {
  const { jwt, data, roles } = useContext(AuthContext)
  useEffect(() => {
    if (!jwt || !refreshToken) return

    const decoded: JwtPayload = jwtDecode(jwt)
    if (decoded?.exp) {
      // Convert JWT expiration time from seconds to milliseconds
      const expirationTimeInMs = decoded.exp * 1000

      // Calculate remaining time for the token to expire
      const timeUntilExpiration = expirationTimeInMs - Date.now()

      // Set a timeout only if the time until expiration is positive
      if (timeUntilExpiration > 0) {
        const timeout = setTimeout(() => {
          refresh()
        }, timeUntilExpiration)

        return () => {
          clearTimeout(timeout)
        }
      }
    }

    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwt])

  const refresh = async () => {
    if (!refreshToken) return

    let newToken
    try {
      newToken = await refreshToken()
      signIn({ jwt: newToken, data, roles })
    } catch (error: any) {
      setError(error?.message)
      await signOut()
      return
    }
  }

  return null
}
