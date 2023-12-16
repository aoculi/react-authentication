import { JwtPayload, jwtDecode } from 'jwt-decode'
import { AccessTokenManagerParams } from '../types'

export const accessTokenManager = async ({
  storageProvider,
  login,
  logout,
  setError,
  refreshToken,
}: AccessTokenManagerParams) => {
  const value = await storageProvider.get()

  // No accessToken stored
  if (!value?.accessToken) {
    logout()
    return
  }

  // We have an accessToken
  const decoded: JwtPayload = jwtDecode(value.accessToken)
  if (decoded?.exp) {
    // if is isValid
    if (new Date(decoded.exp * 1000).getTime() > Date.now()) {
      login({
        accessToken: value.accessToken,
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
    accessToken: newToken.accessToken,
  })
  login({
    accessToken: newToken.accessToken,
    data: value?.data || null,
  })
}
