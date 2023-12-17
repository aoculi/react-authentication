import { JwtPayload, jwtDecode } from 'jwt-decode'
import { RefreshTokenManagerParams } from '../types'

export const refreshTokenManager = async ({
  storageProvider,
  login,
  logout,
  setError,
  refreshToken,
}: RefreshTokenManagerParams) => {
  const value = await storageProvider.get()

  // No jwt stored
  if (!value?.jwt) {
    logout()
    return
  }

  // We have an jwt
  const decoded: JwtPayload = jwtDecode(value.jwt)
  if (decoded?.exp) {
    // if is isValid
    if (new Date(decoded.exp * 1000).getTime() > Date.now()) {
      login({
        jwt: value.jwt,
        data: value?.data || null,
      })
      return
    }
  }

  if (!refreshToken) return

  // No valid token, try to refresh it
  let newToken
  try {
    newToken = await refreshToken()
  } catch (error: any) {
    setError(error?.message)
    storageProvider.remove()
    return
  }

  if (!newToken) {
    logout()
    storageProvider.remove()
    return
  }

  await storageProvider.set({
    jwt: newToken.jwt,
  })
  login({
    jwt: newToken.jwt,
    data: value?.data || null,
  })
}
