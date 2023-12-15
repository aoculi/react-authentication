import { ReactElement } from 'react'

export interface AuthenticationProviderProps extends React.PropsWithChildren {
  afterSignIn?: Function
  afterSignOut?: Function
  refreshToken?: Function
  storageKey?: string
  children: ReactElement
}

export interface setAuthenticationValues {
  error?: boolean
  isAuthenticated?: boolean
  accessToken?: string | null
  data?: any | null
}

export interface AuthenticationParams {
  isAuthenticated: boolean
  isLoading: boolean
  isError: boolean
  error: boolean
  accessToken: string | null
  data: string | null
}

export type SignInParams = {
  accessToken?: string | null
  data?: any | null
}

export type Authentication = AuthenticationParams & {
  signIn: {
    (params: { accessToken?: string | null; data?: any | null }): Promise<void>
  }
  signOut: {
    (): Promise<void>
  }
}

export interface CheckRefreshTokenValidity {
  key: string
  setAuthenticationValues: Function
  refreshToken?: Function
}
