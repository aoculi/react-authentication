import { JwtPayload, jwtDecode } from 'jwt-decode'
import { getStorage, setStorage, removeStorage } from './storage'
import { CheckRefreshTokenValidity } from '../types'

export const checkRefreshTokenValidity = async ({
  key,
  setAuthenticationValues,
  refreshToken,
}: CheckRefreshTokenValidity) => {
  const value = await getStorage(key)

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
    removeStorage(key)
    return
  }

  if (!newToken) {
    setAuthenticationValues({})
    removeStorage(key)
    return
  }

  await setStorage(key, {
    accessToken: newToken.accessToken,
  })
  setAuthenticationValues({
    isAuthenticated: true,
    error: false,
    accessToken: newToken.accessToken,
    data: value?.data || null,
  })
}
