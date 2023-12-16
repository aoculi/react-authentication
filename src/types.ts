import { ReactElement, ReactNode } from 'react'

export interface AuthenticationProviderProps extends React.PropsWithChildren {
  afterSignIn?: Function
  afterSignOut?: Function
  refreshToken?: Function
  storageKey?: string
  storageType?: 'localstorage' | 'cookie'
  children: ReactElement
}

export interface RequireRolesProps extends React.PropsWithChildren {
  roles: string[]
  children: ReactElement
  fallBack?: ReactNode
}

export interface RequireAuthProps {
  redirectPath: string
  loader?: ReactElement
}

export interface AuthenticationParams {
  isAuthenticated: boolean
  isLoading: boolean
  isError: boolean
  error: string | null
  accessToken: string | null
  data: string | null
  roles: string[]
}

export type SignInParams = {
  accessToken?: string | null
  data?: any | null
  roles?: string[] | null
}

export type Authentication = AuthenticationParams & {
  signIn: {
    (params: { accessToken?: string | null; data?: any | null }): Promise<void>
  }
  signOut: {
    (): Promise<void>
  }
}

export interface AccessTokenManagerParams {
  storageProvider: IStorageProvider
  login: ({ accessToken, data }: SignInParams) => void
  logout: () => void
  setError: (message: string) => void
  refreshToken?: Function
}

export interface IStorageProvider {
  get(): Promise<any>
  set(value: any): Promise<void>
  remove(): Promise<void>
}
