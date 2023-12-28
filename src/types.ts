import { ReactElement, ReactNode } from 'react'

export interface RefreshToken {
  refreshToken: Function | null
}

export interface AuthenticationProviderProps
  extends RefreshToken,
    React.PropsWithChildren {
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

export interface SignInParams {
  jwt?: string | null
  data?: any | null
  roles?: string[] | null
  permissions?: string[] | null
  afterSignIn?: Function
}

export interface SignOutParams {
  afterSignOut?: Function
}

export interface SignIn {
  signIn: (params: SignInParams) => Promise<void>
}

export interface SignOut {
  signOut: (params?: SignOutParams) => Promise<void>
}

export interface Authentication extends AuthenticationParams, SignIn, SignOut {}

export interface Login {
  login: ({ jwt, data }: SignInParams) => void
}
export interface Logout {
  logout: () => void
}

export interface RefreshTokenManagerParams extends RefreshToken, Login, Logout {
  storageProvider: StorageProvider

  setError: (message: string) => void
}

export interface StorageProvider {
  get(): Promise<any>
  set(value: any): Promise<void>
  remove(): Promise<void>
}

export interface UseRefreshToken extends SignIn, SignOut, RefreshToken {
  setError: (message: string) => void
}

export interface UseAutoConnect extends Login, Logout {}
