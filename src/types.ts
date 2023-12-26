import { ReactElement, ReactNode } from 'react'

export interface AuthenticationProviderProps extends React.PropsWithChildren {
  refreshToken?: Function
  storageKey?: string
  storageType?: 'localstorage' | 'cookie'
  children: ReactElement
}

export interface RequirePermissionsProps extends React.PropsWithChildren {
  roles: string[]
  permissions: string[]
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
  jwt: string | null
  data: any | null
  roles: string[]
  permissions: string[]
}

export type SignInParams = {
  jwt?: string | null
  data?: any | null
  roles?: string[] | null
  permissions?: string[] | null
  afterSignIn?: Function
}

export type SignOutParams = {
  afterSignOut?: Function
}

export type Authentication = AuthenticationParams & {
  signIn: {
    (params: {
      jwt?: string | null
      data?: any | null
      roles?: string[] | null
      permissions?: string[] | null
      afterSignIn?: Function
    }): Promise<void>
  }
  signOut: {
    (params: { afterSignOut?: Function }): Promise<void>
  }
}

export interface RefreshTokenManagerParams {
  storageProvider: IStorageProvider
  login: ({ jwt, data }: SignInParams) => void
  logout: () => void
  setError: (message: string) => void
  refreshToken?: Function
}

export interface IStorageProvider {
  get(): Promise<any>
  set(value: any): Promise<void>
  remove(): Promise<void>
}
