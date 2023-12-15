// import React from 'react'
// import { Navigate, Outlet, useLocation } from 'react-router-dom'

// import useAuthenticate from '@hooks/useAuthenticate.jsx'

// export function RequireAuth({ redirectPath }) {
// 	const location = useLocation()
// 	const { isLoading, isAuthenticated } = useAuthenticate()

// 	if (isLoading) return <div>...</div>
// 	if (!isAuthenticated)
// 		return <Navigate to={redirectPath} state={{ from: location }} replace />

// 	return <Outlet />
// }

// export function RequireNoAuth({ redirectPath }) {
// 	const { isLoading, isAuthenticated } = useAuthenticate()

// 	if (isLoading) return <div>...</div>
// 	if (!isAuthenticated) return <Outlet />

// 	return <Navigate to={redirectPath} replace />
// }
