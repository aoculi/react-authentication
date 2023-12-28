import { JwtPayload, jwtDecode } from 'jwt-decode'
import { AutoConnect } from '../types.js'

export const autoConnect = ({ storageData, signOut, login }: AutoConnect) => {
  // No jwt stored
  if (!storageData?.jwt) {
    signOut()
    return null
  }

  // We have an jwt
  const decoded: JwtPayload = jwtDecode(storageData.jwt)

  if (!decoded?.exp) {
    login({
      jwt: storageData?.jwt,
      data: storageData?.data,
      roles: storageData?.roles,
      permissions: storageData?.permissions,
    })
  } else {
    // if is isValid
    if (new Date(decoded.exp * 1000).getTime() > Date.now()) {
      login({
        jwt: storageData?.jwt,
        data: storageData?.data,
        roles: storageData?.roles,
        permissions: storageData?.permissions,
      })
    }
  }

  return null
}
