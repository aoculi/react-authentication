import { JwtPayload, jwtDecode } from 'jwt-decode'
import { CheckRefreshTokenValidity } from '../types'

export const checkRefreshTokenValidity = async ({
  storageProvider,
  setAuthenticationValues,
  refreshToken,
}: CheckRefreshTokenValidity) => {
  const value = await storageProvider.get()

  // No accessToken stored
  if (!value?.accessToken) {
    setAuthenticationValues({})
    return
  }

  // We have an accessToken
  const decoded: JwtPayload = jwtDecode(value.accessToken)
  if (decoded?.exp) {
    // if is isValid
    if (new Date(decoded.exp * 1000).getTime() > Date.now()) {
      setAuthenticationValues({
        isAuthenticated: true,
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
    setAuthenticationValues({ error: error?.message })
    storageProvider.remove()
    return
  }

  if (!newToken) {
    setAuthenticationValues({})
    storageProvider.remove()
    return
  }

  await storageProvider.set({
    accessToken: newToken.accessToken,
  })
  setAuthenticationValues({
    isAuthenticated: true,
    error: false,
    accessToken: newToken.accessToken,
    data: value?.data || null,
  })
}
